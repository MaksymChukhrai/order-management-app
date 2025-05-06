# Order Management Application

🇺🇦 [Read in Ukrainian](README.uk.md)

## General Description

Order Management Application is a full-featured order management application that allows users to browse products, create orders and manage their purchases. The application provides interaction with a database to store information about users, products and orders, and also supports transactions when creating orders and limiting API request rates.

## Technologies Used

### Frontend

- **React**: library for creating user interface
- **TypeScript**: typed JavaScript for improved code quality
- **Vite**: modern build tool for fast development
- **Material-UI**: component library for modern design
- **Axios**: HTTP client for API requests
- **React Router**: for application routing

### Backend

- **Node.js** - platform for running JavaScript on the server
- **Express** - web framework for creating APIs
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - ODM for MongoDB, providing model operations
- **express-rate-limit** - middleware for request rate limiting
- **cors** - middleware for CORS support
- **dotenv** - working with environment variables
- **Winston** - creating a logging system

### Testing

- **Jest** - used for unit and integration tests
- **babel-jest** and presets - code transpilation for tests
- **supertest** - used for testing HTTP requests to the API

## Installation and Launch

### Prerequisites

* [Local installation of Node.js v22+](https://nodejs.org/en/download/current)
* [Local installation of MongoDB](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.6-signed.msi)

### 🚀 Standard Installation

1. Clone the repository:

`git clone https://github.com/MaksymChukhrai/order-management-app.git`

### Running in Development Mode

#### NPM Installation

`cd <project root folder>` - go to the project root folder  
`npm install` - install all project dependencies with one command  
`npm start` - start frontend, backend, MongoDB simultaneously with one command  

##### The application will be available at <http://localhost:5173>

#### Installation via Docker

`docker-compose up --build` - build and run containers  
`docker-compose up -d` - run in background mode  

##### The application will be available at: <http://localhost:5173>

MongoDB will be available on port 27017  
Backend API will be available on port 5000  

### Testing

The application includes automated tests to verify the correct functioning of the API and business logic.

#### Running Tests

`npm test` - run all tests for frontend and backend. 20 in total.

##### Running Tests via Docker

`docker-compose -f docker-compose.test.yml up`

##### Tests check the following aspects:

- **Unit tests**: Testing key business logic (balance checking, stock validation, total price calculation)
- **API tests**: Checking the correct operation of all endpoints and error handling
- **Transaction tests**: Verifying that partial orders do not occur (e.g., if balance deduction fails, stocks remain unchanged)
- **Rate limiting tests**: Checking that the API limits users after exceeding the limit (returns 429)
- **Frontend tests**: 6 tests

### HTTP Error Code Handling (400, 403, 404, 429)

Error handling with appropriate HTTP codes is implemented in several places:  

1. `backend/controllers/orderController.js` - the main controller where API requests are processed and appropriate error codes are returned:  
    * 400 (Bad Request) - for invalid data in the request (e.g., negative quantity)  
    * 403 (Forbidden) - when the user has insufficient balance to place an order  
    * 404 (Not Found) - if the user or product is not found  

2. `backend/middleware/rateLimiter.js` - middleware for request rate limiting: 
    * 429 (Too Many Requests) - returned when a user exceeds the request limit (10 per minute)

3. `backend/middleware/errorHandler.js` - centralized error handling:
    * Converts Mongoose and other library errors into appropriate HTTP codes  
    * Formats error messages for better readability  
    * Adds additional information for debugging in development mode  

4. `frontend/src/services/api.ts` - client-side error handling:  
    * Intercepts API request errors  
    * Extracts error messages from the server response  
    * Passes error information to components for display to the user  

This multi-level error handling provides informative messages for the user and allows for efficient application debugging.  

## Project Structure

```
order-management-app/
├── backend/           # Server-side with Node.js/Express
│   ├── controllers/   # Request handlers and error codes (400, 403, 404, 429)
│   ├── logs/          # Log files for operations, API requests and errors
│   ├── middleware/    # Middleware (rate limiting, logging)
│   ├── models/        # Mongoose data models
│   ├── routes/        # API routes
│   ├── tests/         # Backend tests
│   ├── package.json   # Dependencies and scripts for separate backend launch
│   ├── seeder.js      # Script for populating the DB with test data (users and products)
│   └── server.js      # Server entry point
├── frontend/          # Client-side with React/TypeScript
│   ├── public/        # Static files
│   ├── src/           # Source code
│   │   ├── tests/   # Frontend tests
│   │   ├── components/# React components
│   │   ├── contexts/  # React contexts for state management
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Page components
│   │   ├── services/  # Services for working with API
│   │   ├── types/     # TypeScript types and interfaces
│   │   └── App.tsx    # Root application component
│   ├── Dockerfile     # Instructions for creating frontend Docker image
│   ├── package.json   # Dependencies and scripts for separate frontend launch
│   └── index.html     # Main HTML file
├── docker-compose.yml # Configuration for running all containers (frontend, backend, mongodb)
└── package.json       # Root dependencies and scripts for launching the entire project
```

**Author: [Maksym Chukhrai](https://www.mchukhrai.com/)**