# Bus Fare Finder Backend

This is the backend server for the Bus Fare Finder application. It provides authentication for admin users and API endpoints for managing bus routes and fares.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bus-fare-finder
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=admin@busfarefinder.com
   ADMIN_PASSWORD=admin123
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server

## API Endpoints

### Authentication

- POST `/api/auth/login`
  - Login for admin users
  - Body: `{ "email": "admin@busfarefinder.com", "password": "admin123" }`
  - Returns: JWT token

## Security Notes

- Change the JWT secret and admin credentials in production
- Use strong passwords
- Enable CORS only for trusted domains
- Use HTTPS in production 