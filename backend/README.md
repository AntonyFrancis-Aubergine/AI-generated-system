# Fitness Class Booking System API

A RESTful API for managing fitness class bookings, built with Node.js, TypeScript, Express, and Prisma ORM.

## Features

- User authentication and authorization
- Fitness class management
- Booking management
- Role-based access control (User, Instructor, Admin)
- CORS support for cross-origin requests from frontend applications

## Tech Stack

- Node.js (v22 LTS)
- TypeScript (with strict mode)
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for authentication

## Project Setup

### Prerequisites

- Node.js (v22 LTS)
- PostgreSQL

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_booking_db"
PORT=3000
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000,https://yourfrontend.com"  # Comma-separated origins, or use * for all origins
```

### Installation

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Build the project
npm run build

# Start the server
npm start
```

### Development

```bash
# Run in development mode
npm run dev
```

### Seeding the Database

```bash
# Seed the database with initial data (fitness class categories)
npm run seed
```

## API Documentation

A Postman collection is included in the project root (`postman_collection.json`). Import this into Postman to test the API endpoints.

### Available Endpoints

#### Health Check

- `GET /api/v1/health` - Check if the API is running

#### Authentication

- `POST /api/v1/auth/register` - Register a new user
  - Only USER and INSTRUCTOR roles are allowed for public registration
  - ADMIN accounts cannot be created through public registration
- `POST /api/v1/auth/login` - Login a user

#### Fitness Classes (User)

- `GET /api/v1/fitness-classes` - Get available fitness classes with filtering and pagination
  - Only shows classes that start more than 1 hour from now
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `name` - Filter by class name
    - `categoryId` - Filter by category ID
    - `instructorId` - Filter by instructor ID
    - `startDateFrom` - Filter classes starting after this date
    - `startDateTo` - Filter classes starting before this date
- `POST /api/v1/fitness-classes/:fitnessClassId` - Book a fitness class
  - Only allows booking classes that start more than 1 hour from now
  - Uses authenticated user's ID for booking

#### User Bookings

- `GET /api/v1/bookings` - Get all bookings for the authenticated user with pagination
  - Requires authentication
  - Returns fitness class details with each booking
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)

#### Admin Endpoints (All require ADMIN role)

- `GET /api/admin/fitness-classes` - Get all fitness classes with filtering and pagination
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `name` - Filter by class name
    - `categoryId` - Filter by category ID
    - `instructorId` - Filter by instructor ID
    - `startDateFrom` - Filter classes starting after this date
    - `startDateTo` - Filter classes starting before this date
- `POST /api/admin/fitness-classes` - Create a fitness class
- `PUT /api/admin/fitness-classes/:fitnessClassId` - Update a fitness class
  - All fields are optional - only provided fields will be updated
  - If updating time or instructor, checks for scheduling conflicts
  - Request body parameters:
    - `name` - Class name (optional)
    - `categoryId` - Category ID (optional)
    - `instructorId` - Instructor ID (optional)
    - `startsAt` - Start time of the class (ISO format, optional)
    - `endsAt` - End time of the class (ISO format, optional)
- `DELETE /api/admin/fitness-classes/:fitnessClassId` - Delete a fitness class
  - Cannot delete classes that have active bookings
  - Returns a success message when deletion is successful

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # Database models
├── routes/         # API routes
│   ├── v1/         # Regular versioned routes
│   └── admin/      # Admin-only routes (no versioning)
├── schemas/        # Validation schemas
├── scripts/        # Utility scripts
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── server.ts       # Application entry point
```
