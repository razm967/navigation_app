# Navigation App

A web-based navigation application built with React and Mapbox, providing users with navigation features, including maps, routes, and location services.

## Features

- Interactive maps with Mapbox integration
- Location search functionality
- Turn-by-turn navigation
- Route calculation between points
- Customizable settings (map type, distance units)
- Responsive UI that adapts to different screen sizes and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm
- Mapbox account and access token (for future integration)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. For future Mapbox integration, update the Mapbox access token in:
   - `src/components/Map.tsx`
   - `src/services/LocationService.ts`

## Running the App

```bash
npm start
```

## Project Structure

```
navigation-app/
├── public/            # Static files
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API and business logic
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── assets/        # Images, fonts, etc.
│   ├── App.tsx        # Main App component
│   └── index.tsx      # Entry point
└── package.json       # Dependencies and scripts
```

## Technologies Used

- React
- TypeScript
- Mapbox for maps and navigation
- React Router for routing
- Styled Components or Material UI for UI components