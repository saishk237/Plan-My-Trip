# Changelog

All notable changes to PlanMyTrip will be documented in this file.

## [v1.0.0] - 2025-11-12

### 🎉 First Official Release

This is the first official release of PlanMyTrip - a production-ready AI-powered travel itinerary generator with user authentication, persistent storage, and enhanced features.

---

## ✨ New Features

### 🔐 User Authentication System
- **User Registration & Login**: Secure signup/login system with JWT authentication
- **User Profiles**: Dedicated profile page showing user information and saved itineraries
- **Session Management**: Persistent authentication across browser sessions
- **Password Security**: Bcrypt-based password hashing for secure credential storage

### 💾 Database Integration
- **PostgreSQL Database**: Full migration from in-memory storage to PostgreSQL
- **Persistent Data Storage**: Users and itineraries are now stored permanently
- **Save Itineraries**: Users can save their generated itineraries for future reference
- **View Saved Trips**: Access all saved itineraries from the profile page
- **Database Management**: Automated database initialization and migration scripts

### 🎨 Theme Support
- **Dark/Light Mode**: Toggle between dark and light themes
- **Theme Persistence**: User theme preferences saved in local storage
- **Responsive Theme UI**: All components optimized for both themes
- **Smooth Transitions**: Elegant theme switching animations

### 🗺️ Enhanced Trip Planning
- **Starting Location**: Users can now specify their trip starting point
- **Day 1 Travel Planning**: Itineraries include travel arrangements from starting location
- **Flexible Meal Preferences**: Added "No preference" option alongside Veg/Non-Veg
- **Activity Details**: Each activity now includes a detailed paragraph with tips and insights
- **Natural Activity Types**: AI generates descriptive activity categories (sightseeing, adventure, culture, etc.)

### 🤖 AI Model Migration
- **Groq Integration**: Switched from OpenAI to Groq for free, high-quality AI generation
- **Model**: Using `llama-3.1-8b-instant` for fast and accurate itinerary generation
- **Improved Prompts**: Enhanced AI prompts for better JSON formatting and content quality
- **Structured Output**: Reliable JSON generation with proper validation

---

## 🔧 Improvements

### User Experience
- **Field Validation**: Real-time form validation with specific error messages
- **Required Field Indicators**: Red asterisks mark mandatory fields
- **Loading States**: Clear loading indicators during itinerary generation
- **Error Handling**: Comprehensive error messages for better user guidance
- **Authentication Flow**: Seamless login/logout experience with proper redirects

### PDF Generation
- **Enhanced Layout**: Improved PDF formatting with better spacing and typography
- **Activity Details**: Detailed information boxes for each activity
- **Professional Design**: Color-coded sections and clean typography
- **Multi-page Support**: Automatic page breaks for long itineraries
- **Metadata**: Trip highlights and overview sections

### Code Quality
- **TypeScript Fixes**: Resolved all type safety issues
- **React Best Practices**: Proper hook usage and component structure
- **Environment Variables**: Secure configuration management with dotenv
- **Database Migrations**: Proper database setup and reset commands
- **Code Organization**: Modular structure with clear separation of concerns

---

## 🐛 Bug Fixes

### Critical Fixes
- **Environment Variables**: Fixed `.env` file not being loaded on server startup
- **React Hooks**: Resolved `useRef` and `useEffect` null reference errors
- **AI Model**: Fixed deprecated Groq model error
- **JSON Parsing**: Fixed malformed JSON responses from AI
- **Database Persistence**: Fixed data loss on server restart
- **Authentication State**: Fixed auth state not syncing across components

### UI/UX Fixes
- **Login Redirect**: Fixed logout button not redirecting to homepage
- **Profile Display**: Fixed undefined `name` field causing crashes
- **Form Validation**: Added field-specific error messages during signup
- **Auth Modal**: Fixed authentication modal not closing properly
- **Theme Toggle**: Fixed theme toggle positioning and functionality

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  username VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Saved Itineraries Table
```sql
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
```

---

## 📦 Dependencies Added

### Backend
- `bcrypt`: ^5.1.1 - Password hashing
- `jsonwebtoken`: ^9.0.2 - JWT authentication
- `drizzle-orm`: ^0.39.1 - PostgreSQL ORM
- `pg`: ^8.11.3 - PostgreSQL client
- `dotenv`: ^16.4.5 - Environment variable management

### Frontend
- `next-themes`: ^0.3.0 - Theme management
- `jspdf`: Latest - PDF generation

---

## 🚀 Migration Guide

### For Existing Users

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   POSTGRES_PASSWORD=your_postgres_password
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   ```

3. **Setup Database**
   ```bash
   npm run db:setup
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Database Commands

- `npm run dev` - Start development server (preserves data)
- `npm run db:setup` - Initial database setup
- `npm run db:reset` - Reset database (deletes all data)

---

## 🔒 Security Notes

- All passwords are hashed using bcrypt
- JWT tokens used for session management
- Environment variables for sensitive data
- SQL injection protection via parameterized queries
- CORS and security headers configured

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Itineraries
- `POST /api/itinerary` - Generate new itinerary
- `POST /api/itinerary/save` - Save itinerary
- `GET /api/itinerary/user/:userId` - Get user's saved itineraries
- `GET /api/itinerary/:id` - Get specific itinerary

---

## 📊 Statistics

- **Files Changed**: 25+
- **New Components**: 6
- **New API Endpoints**: 4
- **Bug Fixes**: 15+
- **Features Added**: 10+

---

## 🙏 Acknowledgments

- Groq for providing free AI API access
- shadcn/ui for beautiful UI components

---

## 🔮 Future Roadmap

- [ ] Social sharing of itineraries
- [ ] Collaborative trip planning
- [ ] Real-time weather integration
- [ ] Budget tracking
- [ ] Multi-language support
- [ ] Mobile app version

---

## 📄 License

MIT License - See LICENSE file for details

