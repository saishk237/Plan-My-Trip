# TripCraft - AI-Powered Travel Itinerary Generator

## Overview
TripCraft is a full-stack web application that generates personalized day-by-day travel itineraries using AI. Users input their travel preferences, and the application creates detailed, customized itineraries with activities, dining recommendations, and timing suggestions.

## Project Architecture

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **AI Integration**: OpenAI GPT-4o-mini
- **PDF Generation**: jsPDF
- **Routing**: Wouter
- **State Management**: React Query

### Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx                 # Landing page hero section
│   │   │   ├── TripForm.tsx             # Travel preferences input form
│   │   │   ├── InterestChips.tsx        # Multi-select interest chips
│   │   │   ├── BudgetSelector.tsx       # Budget level selector
│   │   │   ├── ItineraryDisplay.tsx     # Day-by-day itinerary view
│   │   │   └── LoadingState.tsx         # Loading animation
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Landing page
│   │   │   └── Plan.tsx                 # Trip planning page
│   │   └── lib/
│   │       └── pdfGenerator.ts          # PDF export functionality
├── server/
│   ├── routes.ts                        # API routes
│   └── openai.ts                        # OpenAI integration
└── shared/
    └── schema.ts                        # Shared types and validation schemas
```

## Features

### User Input Form
- **Destination**: Text input for destination(s)
- **Duration**: Slider for 1-30 days
- **Budget**: Card selector (Low, Moderate, Luxury)
- **Travel Type**: Dropdown (Solo, Couple, Family, Group)
- **Interests**: Multi-select chips (Adventure, Culture, Food, Shopping, Relaxation, Offbeat)
- **Pace**: Selector (Relaxed, Balanced, Packed)
- **Accommodation**: Dropdown (Hotel, Hostel, Resort, Homestay)
- **Transportation**: Dropdown (Public Transport, Rental Car, Walk)
- **Meal Preference**: Dropdown (Veg, Non-Veg, Vegan)

### AI-Generated Itineraries
- Day-by-day breakdown with themed titles
- Time-specific activities (breakfast, lunch, dinner, activities)
- Activity type indicators (📍 activity, 🍽️ meal, 🛌 rest)
- Customized based on all user preferences
- Trip highlights summary

### Itinerary Display
- Clean, card-based layout
- Trip metadata (destination, duration, budget, travel type)
- Highlighted trip features
- Day-wise activity timeline
- Three action buttons:
  - **Regenerate**: Create a new itinerary with same preferences
  - **Edit Preferences**: Return to form with pre-filled values
  - **Download PDF**: Export itinerary as formatted PDF

### PDF Export
- Professional formatting with headers, sections, and icons
- Includes all itinerary details
- Auto-pagination for multi-day trips
- Timestamped generation date

## API Endpoints

### POST /api/itinerary
Generates a personalized travel itinerary using OpenAI.

**Request Body:**
```json
{
  "destination": "Tokyo",
  "days": 5,
  "budget": "Moderate",
  "travelType": "Couple",
  "interests": ["Culture", "Food"],
  "pace": "Balanced",
  "accommodation": "Hotel",
  "transportation": "Public Transport",
  "mealPreference": "Non-Veg"
}
```

**Response:**
```json
{
  "title": "Tokyo Culture & Cuisine Adventure",
  "destination": "Tokyo",
  "duration": "5 Days",
  "budget": "Moderate",
  "travelType": "Couple",
  "highlights": ["Cherry Blossoms", "Sushi Master Class", "Ancient Temples"],
  "days": [
    {
      "day": 1,
      "title": "Arrival & Exploration",
      "activities": [
        {
          "time": "10:00 AM",
          "title": "Arrive at Airport",
          "description": "...",
          "type": "activity"
        }
      ]
    }
  ]
}
```

## Environment Variables

### Required
- `OPENAI_API_KEY`: OpenAI API key for generating itineraries

### Optional
- `SESSION_SECRET`: Session secret for Express (auto-generated if not provided)

## Development

### Running the Application
The workflow "Start application" runs `npm run dev` which:
- Starts Express backend server
- Starts Vite frontend dev server
- Serves on port 5000

### Design System
- **Primary Color**: Cyan/Teal (#32A0C6) - evokes travel and adventure
- **Typography**: Inter for UI, Playfair Display for headlines
- **Components**: Shadcn UI with custom styling
- **Responsive**: Mobile-first design with breakpoints at md, lg

## Recent Changes
- 2025-01-04: Initial project setup with full-stack implementation
- Integrated OpenAI GPT-4o-mini for itinerary generation
- Added comprehensive travel preference form
- Implemented PDF export functionality
- Created responsive, travel-themed UI design

## Future Enhancements
- User authentication and saved itineraries
- Itinerary editing (modify individual activities)
- Map integration with route visualization
- Real-time pricing estimates via travel APIs
- Social sharing features
- Multi-destination trip planning
- Collaboration features for group travel
