import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from '@shared/schema';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: 'planmytrip',
});

export const db = drizzle(pool, { schema });

// Initialize database tables (only creates if they don't exist)
export async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const adminPool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'postgres', // Connect to default database first
    });

    const client = await adminPool.connect();
    
    try {
      // Check if database exists
      const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = 'planmytrip'"
      );
      
      if (result.rows.length === 0) {
        await client.query('CREATE DATABASE planmytrip');
        console.log('✅ Database "planmytrip" created successfully');
      } else {
        console.log('✅ Database "planmytrip" already exists');
      }
    } catch (error) {
      console.log('Database already exists or error creating:', error);
    } finally {
      client.release();
      await adminPool.end();
    }

    // Create tables only if they don't exist (no DROP)
    const planmytripPool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'planmytrip',
    });

    const dbClient = await planmytripPool.connect();
    
    try {
      // Create users table only if it doesn't exist
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY,
          email VARCHAR NOT NULL UNIQUE,
          name VARCHAR NOT NULL,
          username VARCHAR NOT NULL UNIQUE,
          password_hash VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Users table ready');

      // Create saved_itineraries table only if it doesn't exist
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS saved_itineraries (
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
      console.log('✅ Saved itineraries table ready');

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Error creating tables:', error);
    } finally {
      dbClient.release();
      await planmytripPool.end();
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}


