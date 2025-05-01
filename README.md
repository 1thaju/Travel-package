# Express.js API with MongoDB

A basic Express.js API with MongoDB integration, featuring CORS, dotenv, and body-parser.

## Project Structure

```
Backend/
├── controllers/
│   └── userController.js
├── models/
│   └── User.js
├── routes/
│   └── userRoutes.js
└── server.js
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get a single user
- POST `/api/users` - Create a new user
- PUT `/api/users/:id` - Update a user
- DELETE `/api/users/:id` - Delete a user

## Technologies Used

- Express.js
- MongoDB with Mongoose
- CORS
- dotenv
- body-parser 