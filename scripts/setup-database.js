import { Pool } from 'pg';
import 'dotenv/config';

async function setupDatabase() {
  // First, connect to default postgres database to create tripcraft database
  const adminPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: 'postgres',
  });

  let client = await adminPool.connect();
  
  try {
    // Create database if it doesn't exist
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'tripcraft'"
    );
    
    if (result.rows.length === 0) {
      await client.query('CREATE DATABASE tripcraft');
      console.log('✅ Database "tripcraft" created successfully');
    } else {
      console.log('✅ Database "tripcraft" already exists');
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  } finally {
    client.release();
    await adminPool.end();
  }

  // Now connect to tripcraft database to create tables
  const tripcraftPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: 'tripcraft',
  });

  client = await tripcraftPool.connect();
  
  try {
    // Drop existing users table if it exists
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);
    console.log('🗑️  Dropped existing users table');

    // Create users table with name field
    await client.query(`
      CREATE TABLE users (
        id VARCHAR PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        name VARCHAR NOT NULL,
        username VARCHAR NOT NULL UNIQUE,
        password_hash VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Users table created successfully');

    // Drop and recreate saved_itineraries table
    await client.query(`DROP TABLE IF EXISTS saved_itineraries CASCADE`);
    console.log('🗑️  Dropped existing saved_itineraries table');

    await client.query(`
      CREATE TABLE saved_itineraries (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        destination VARCHAR NOT NULL,
        starting_location VARCHAR NOT NULL,
        duration VARCHAR NOT NULL,
        budget VARCHAR NOT NULL,
        travel_type VARCHAR NOT NULL,
        itinerary_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Saved itineraries table created successfully');

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    client.release();
    await tripcraftPool.end();
  }
}

setupDatabase().catch(console.error);
