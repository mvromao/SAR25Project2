# Development Workflow

This document outlines the recommended workflow for developing the auction application backend.

## Getting Started

1. Set up the environment:
   ```
   ./setup.sh
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- **src/config/** - Configuration files including database and environment settings
- **src/controllers/** - Request handlers that process HTTP requests
- **src/middlewares/** - Express middleware functions
- **src/models/** - Mongoose models for MongoDB
- **src/routes/** - Express routes that define API endpoints
- **src/services/** - Business logic and services
- **src/utils/** - Utility functions and helpers

## Development Tasks

### Adding a New API Endpoint

1. Create controller function in the appropriate controller file
2. Add route in the api.routes.ts file
3. Test the endpoint with a REST client (like Postman)

### Adding Database Features

1. Update the model in the models/ directory
2. Use mongoose methods in the controller or service

### Authentication

- JWT tokens are used for authentication
- Protected routes use the authentication middleware
- Socket.IO connections also use JWT for authentication

## MongoDB Connection

The database connection is managed in `src/config/db.ts`. The connection string is defined in the `.env` file.

## Environment Variables

Configuration is managed via environment variables in the `.env` file:

- PORT - HTTP port
- HTTPS_PORT - HTTPS port
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret for signing JWT tokens
- NODE_ENV - Environment (development, production)

## Tips for Students

1. Use TypeScript types to ensure code quality and get better IDE support
2. Follow the existing patterns when adding new features
3. Use console.log for basic debugging but consider more structured logging for real projects
4. Remember to validate user inputs on the server side
5. Always handle errors and provide appropriate error responses
6. Keep controllers thin and move business logic to services