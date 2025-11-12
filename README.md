# 🌍 TripCraft - AI-Powered Travel Itinerary Generator

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/YOUR_USERNAME/Plan-My-Trip/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)](https://www.postgresql.org/)

> Transform your travel dreams into detailed itineraries with the power of AI

TripCraft is a full-stack web application that uses AI to generate personalized travel itineraries based on your preferences, budget, and interests. Built with React, Express, PostgreSQL, and powered by Groq's Llama 3.1 AI model.

---

## ✨ Features

### 🤖 AI-Powered Planning
- **Smart Itinerary Generation**: Get detailed day-by-day travel plans
- **Personalized Recommendations**: Based on your interests and travel style
- **Activity Details**: Each activity includes helpful tips and insights
- **Travel Arrangements**: Includes transportation from your starting location

### 🔐 User Management
- **Secure Authentication**: JWT-based login system
- **User Profiles**: Manage your account and preferences
- **Save Itineraries**: Keep all your travel plans in one place
- **View History**: Access your saved itineraries anytime

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Components**: Built with shadcn/ui
- **Smooth Animations**: Polished user experience

### 📄 Export & Share
- **PDF Generation**: Download itineraries for offline access
- **Professional Formatting**: Clean, printable layouts
- **Detailed Information**: All activities, times, and tips included

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Plan-My-Trip.git
   cd Plan-My-Trip
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get a Groq API Key** (Free)
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for a free account
   - Create an API key

4. **Setup PostgreSQL**
   - Ensure PostgreSQL is running on `localhost:5432`
   - Note your postgres user password

5. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```env
   # Groq AI API Key (Required)
   GROQ_API_KEY=your_groq_api_key_here
   
   # PostgreSQL Configuration (Required)
   POSTGRES_PASSWORD=your_postgres_password
   
   # JWT Secret (Required - change in production)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # Server Port (Optional, defaults to 5000)
   PORT=5000
   ```

6. **Initialize the database**
   ```bash
   npm run db:setup
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to `http://localhost:5000`

---

## 📖 Usage Guide

### Creating Your First Itinerary

1. **Sign Up**
   - Click "Get Started" on the homepage
   - Fill in your details (name, email, username, password)
   - All fields are required

2. **Login**
   - Enter your email and password
   - You'll be redirected to the homepage

3. **Plan Your Trip**
   - Click "Plan My Trip"
   - Fill in the trip details:
     - **Starting Location**: Where you're traveling from
     - **Destination**: Where you want to go
     - **Duration**: Number of days (1-30)
     - **Budget**: Low, Moderate, or Luxury
     - **Travel Type**: Solo, Couple, Family, or Group
     - **Interests**: Select activities you enjoy
     - **Pace**: Relaxed, Balanced, or Packed
     - **Accommodation**: Hotel, Hostel, Resort, or Homestay
     - **Transportation**: Public Transport, Rental Car, or Walk
     - **Meal Preference**: Veg, Non-Veg, or No preference

4. **Generate Itinerary**
   - Click "Generate my itinerary"
   - Wait 3-5 seconds for AI to create your plan

5. **Review & Save**
   - Review your personalized itinerary
   - Click "Save Itinerary" to keep it
   - Click "Download PDF" to export

6. **View Saved Itineraries**
   - Click your profile avatar (top-right)
   - Select "View Profile"
   - See all your saved trips

---

## 🛠️ Development

### Project Structure

```
Plan-My-Trip/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   ├── database.ts       # Database connection
│   └── openai.ts         # AI integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas and types
├── scripts/              # Utility scripts
│   └── setup-database.js # Database setup script
└── .env                  # Environment variables (create this)
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run check            # Run TypeScript type checking

# Database
npm run db:setup         # Initial database setup
npm run db:reset         # Reset database (deletes all data)

# Production
npm run build            # Build for production
npm start                # Start production server
```

### Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Wouter (routing)
- TanStack Query
- jsPDF

**Backend:**
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT Authentication
- Bcrypt

**AI:**
- Groq API
- Llama 3.1 8B Instant

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
);
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
);
```

---

## 🔌 API Endpoints

### Authentication

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "password": "securepassword"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Itineraries

**POST** `/api/itinerary`
- Generate new itinerary
- Body: TripRequest object

**POST** `/api/itinerary/save`
- Save itinerary to database
- Body: { userId, itinerary, startingLocation }

**GET** `/api/itinerary/user/:userId`
- Get all saved itineraries for a user

**GET** `/api/itinerary/:id`
- Get specific itinerary by ID

---

## 🔒 Security

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Environment Variables**: Sensitive data protection
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configured for security
- **Input Validation**: Zod schema validation

---

## 🚢 Deployment

### Option 1: Railway (Recommended)

1. Create account on [Railway.app](https://railway.app)
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```
4. Add PostgreSQL service in Railway dashboard
5. Set environment variables in Railway

### Option 2: Render

1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Option 3: Docker

```dockerfile
# Dockerfile included in repository
docker build -t tripcraft .
docker run -p 5000:5000 tripcraft
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 🐛 Bug Reports

Found a bug? Please open an issue on [GitHub Issues](https://github.com/YOUR_USERNAME/Plan-My-Trip/issues) with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** - For providing free AI API access
- **shadcn/ui** - For beautiful UI components
- **Replit Agent 3** - For the initial codebase structure
- **Lucide** - For the icon set
- **Vercel** - For Next Themes

---

## 📊 Project Stats

- **Version**: 2.0.0
- **Last Updated**: November 12, 2025
- **Contributors**: 1
- **Stars**: ⭐ Star us on GitHub!
- **License**: MIT

---

## 🗺️ Roadmap

### v2.1.0 (Planned)
- [ ] Social sharing of itineraries
- [ ] Collaborative trip planning
- [ ] Real-time weather integration
- [ ] Budget tracking

### v2.2.0 (Planned)
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Hotel booking integration
- [ ] Flight search integration

### v3.0.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Trip collaboration
- [ ] AI chat assistant

---

## 📞 Support

Need help? Reach out:

- **GitHub Issues**: [Report bugs or request features](https://github.com/YOUR_USERNAME/Plan-My-Trip/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/YOUR_USERNAME/Plan-My-Trip/discussions)
- **Email**: support@tripcraft.example.com

---

## ⭐ Show Your Support

If you find TripCraft helpful, please consider:

- ⭐ **Star** this repository
- 🐛 **Report** bugs you find
- 💡 **Suggest** new features
- 🤝 **Contribute** to the codebase
- 📢 **Share** with fellow travelers

---

<div align="center">

**Made with ❤️ by developers, for travelers**

[Website](https://tripcraft.example.com) • [Documentation](https://docs.tripcraft.example.com) • [Demo](https://demo.tripcraft.example.com)

</div>
