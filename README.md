# PropertyFinder - Real Estate Discovery Platform

A comprehensive real estate platform that integrates with SmythOS AI agents to provide intelligent property search, neighborhood analysis, agent discovery, and marketing automation.

## Features

- **Property Listings**: Generate customized property listings based on location, price, and preferences
- **Property Details**: Get comprehensive property information including amenities and neighborhood data
- **Neighborhood Analysis**: Access demographic data, schools, transportation, and market trends
- **Agent Profiles**: Find qualified real estate agents with specialties and experience
- **Marketing Ads**: Generate professional property advertisements

## SmythOS API Integration

This application integrates with SmythOS AI agents using the following endpoints:

### Base URL
```
https://cmfutewj7t8k62py5m7lqkqlm.agent.a.smyth.ai
```

### Endpoints
- `POST /api/generate_listings` - Generate property listings
- `POST /api/property_detail` - Get detailed property information
- `GET /api/neighborhood_data` - Retrieve neighborhood demographics and data (uses query parameters)
- `POST /api/agent_profiles` - Find real estate agents
- `POST /api/generate_ads` - Create property advertisements

### Response Format
- All SmythOS responses are returned as `text/plain`
- The backend automatically attempts JSON parsing but falls back to raw text
- All request bodies use JSON format with string values

## Project Structure

```
property-finder/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions (SmythOS API client)
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── .env                # Environment variables
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Frontend utilities
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`:
   ```
   PORT=3001
   SMYTHOS_API_URL=https://cmfutewj7t8k62py5m7lqkqlm.agent.a.smyth.ai
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Usage Examples

### Generate Property Listings
```javascript
POST /api/properties/generate-listings
{
  "location": "San Francisco, CA",
  "min_price": "500000",
  "max_price": "1000000",
  "bedrooms": "2",
  "bathrooms": "2",
  "property_type": "apartment",
  "features": "modern kitchen, balcony",
  "count": "10"
}
```

### Get Neighborhood Data
```javascript
GET /api/neighborhoods/data?neighborhood=SoMa&city=San Francisco
```

### Find Agent Profiles
```javascript
POST /api/agents/profiles
{
  "location": "San Francisco, CA",
  "count": "10",
  "specialties": "luxury homes, first-time buyers"
}
```

### Generate Property Ads
```javascript
POST /api/ads/generate
{
  "location": "San Francisco, CA",
  "property_type": "apartment",
  "price_range": "$500K - $800K",
  "ad_type": "social_media",
  "count": "5"
}
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `SMYTHOS_API_URL` - Base URL for SmythOS API

## Development

### Adding New Features
1. Create API routes in `backend/src/routes/`
2. Add corresponding service functions in `src/services/`
3. Build UI components in `src/components/`
4. Update types in `src/types/`

### Error Handling
- Backend includes comprehensive error handling and logging
- Frontend displays user-friendly error messages
- API responses handle both JSON and text/plain formats
- SmythOS API errors are properly propagated to the frontend

## Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
npm run build
```

Deploy the `dist` folder to your preferred hosting service.

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Express.js, Node.js
- **AI Integration**: SmythOS API
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom service layer

## Testing the Integration

1. Start both frontend and backend servers
2. Navigate to http://localhost:5173
3. Test each feature:
   - **Property Listings**: Enter a location and search criteria
   - **Neighborhoods**: Enter a neighborhood and city name
   - **Agent Profiles**: Search for agents by location
   - **Ad Generation**: Create property advertisements

The application will make real-time calls to your SmythOS agents and display the results in a beautiful, responsive interface.