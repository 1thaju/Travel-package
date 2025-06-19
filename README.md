# Travel Package Management System

A full-stack MERN application for managing travel packages, bookings, and user authentication.

## Project Structure

```
Travel Package/
├── backend/
│   ├── config/
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── travelPackageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── TravelPackage.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── travelPackageRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User Authentication (Register, Login, Logout)
- Travel Package Management
- Booking System
- Admin Dashboard
- User Profile Management
- Responsive Design

## Technologies Used

- **Frontend:**
  - React.js
  - Vite
  - React Router
  - Axios
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Passport.js

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- GET `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Travel Packages
- GET `/api/travel-packages` - Get all packages
- GET `/api/travel-packages/:id` - Get single package
- POST `/api/travel-packages` - Create package (Admin)
- PUT `/api/travel-packages/:id` - Update package (Admin)
- DELETE `/api/travel-packages/:id` - Delete package (Admin)

### Bookings
- GET `/api/bookings` - Get user bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Cancel booking
