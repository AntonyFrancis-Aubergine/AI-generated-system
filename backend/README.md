# Fitness Class Booking System API

A RESTful API for managing fitness class bookings, built with Node.js, TypeScript, Express, and Prisma ORM.

## Features

- User authentication and authorization
- Fitness class management
- Booking management
- Role-based access control (User, Instructor, Admin)

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
- `POST /api/v1/auth/login` - Login a user

#### Fitness Classes

- `GET /api/v1/fitness-classes` - Get all fitness classes with filtering and pagination (Admin only)
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `name` - Filter by class name
    - `categoryId` - Filter by category ID
    - `instructorId` - Filter by instructor ID
    - `startDateFrom` - Filter classes starting after this date
    - `startDateTo` - Filter classes starting before this date
- `POST /api/v1/fitness-classes` - Create a fitness class (Admin only)

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # Database models
├── routes/         # API routes
├── schemas/        # Validation schemas
├── scripts/        # Utility scripts
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── server.ts       # Application entry point
```
