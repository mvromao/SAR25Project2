# SAR Auction Project Architecture

This document provides a detailed architectural overview of the SAR Auction MEAN stack application, focusing on the structure, patterns, and design decisions that have been implemented.

## Architecture Overview

The application follows a modern, modular architecture based on the MEAN stack:

- **MongoDB**: Document database for data storage
- **Express.js**: Node.js web framework for the backend API
- **Angular**: Frontend framework
- **Node.js**: JavaScript runtime for server-side logic

### System Architecture Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  Angular        │ ◄───► │  Express.js     │ ◄───► │  MongoDB        │
│  Frontend       │   HTTP│  Backend        │       │  Database       │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        ▲                         ▲
        │                         │
        │                         │
        └─────────────────────────┘
                WebSockets
```

## Frontend Architecture

The frontend follows a modular architecture organized around features, with core services and shared components separated for better maintainability and code organization.

### Module Structure

```
app/
├── core/                # Core functionality (loaded once)
│   ├── guards/          # Route guards
│   ├── models/          # Data models
│   └── services/        # Singleton services
├── features/            # Feature modules (domain-specific)
│   ├── auction/         # Auction-related components 
│   ├── auth/            # Authentication components
│   └── items/           # Item management components
├── material/            # Angular Material module
├── shared/              # Shared components, directives, pipes
└── app.module.ts        # Root module
```

### Key Patterns Implemented

1. **Feature Modules Pattern**: Code is organized into feature modules, each representing a domain of the application (auth, auction, items).

2. **Core Module Pattern**: Singleton services and application-wide providers are placed in the Core module, which is imported only in the App module.

3. **Shared Module Pattern**: Reusable components, directives, and pipes are placed in the Shared module that can be imported by any feature module.

4. **Barrel Exports Pattern**: Index.ts files are used to simplify imports across the application.

5. **Smart/Presentational Component Pattern**: Components are conceptually divided between "smart" components (with logic and service dependencies) and "presentational" components (focused on UI).

### Data Flow

1. **Service Layer**: Services act as the data access layer, communicating with the backend API and managing state.

2. **Component Interaction**: Components consume services and emit events to communicate with parent components.

3. **Real-time Updates**: Socket.io is used for real-time updates from the server.

## Backend Architecture

The backend uses Express.js with TypeScript, following a layered architecture with clear separation of concerns.

### Directory Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Express middlewares
├── models/           # Mongoose models
├── routes/           # Express routes
├── services/         # Business logic services
└── server.ts         # Entry point
```

### Key Patterns Implemented

1. **MVC Pattern**: The backend follows a Model-View-Controller pattern (without the View, which is handled by Angular).

2. **Middleware Pattern**: Express middlewares are used for cross-cutting concerns like authentication and error handling.

3. **Repository Pattern**: Models encapsulate database operations.

4. **Service Layer Pattern**: Business logic is separated into service files.

5. **Dependency Injection**: Services and controllers depend on abstractions rather than concrete implementations.

## Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication:

1. The client sends credentials to the server
2. The server validates credentials and returns a JWT
3. The client stores the JWT and includes it in subsequent requests
4. Protected routes check the JWT before allowing access

## Real-time Communication

WebSockets (Socket.io) are used for real-time communication:

1. Client establishes a WebSocket connection after authentication
2. Server emits events for:
   - Item updates
   - New bids
   - User presence
   - Chat messages
3. Clients subscribe to relevant events and update the UI accordingly

## Database Schema

The application uses MongoDB with Mongoose schemas:

1. **User Schema**: Stores user information and credentials
2. **Item Schema**: Stores auction item details
3. **Message Schema**: Stores chat messages between users

## Deployment Architecture

The application can be deployed in various ways:

1. **Development**: Local environment with separate Angular dev server and Express server
2. **Production**: 
   - Angular build artifacts served by Express server
   - Secure HTTPS connections
   - Environment variables for configuration
   - MongoDB connection through connection string

## Security Considerations

1. **JWT Authentication**: Secure token-based authentication
2. **HTTPS**: Secure communication between client and server
3. **Input Validation**: Server-side validation of all inputs
4. **Error Handling**: Custom error middleware to prevent information leakage

## Performance Considerations

1. **Lazy Loading**: Feature modules can be lazy-loaded for better initial load time
2. **WebSocket Optimization**: Real-time updates only for required data
3. **MongoDB Indexing**: Proper indexing for frequently queried fields

## Extension Points

The architecture is designed to be extensible in several ways:

1. **New Feature Modules**: Add new feature modules for additional functionality
2. **Enhanced Services**: Extend existing services or add new ones in the core module
3. **Additional API Endpoints**: Add new routes and controllers for new features
4. **Advanced State Management**: Integrate NgRx or another state management solution if needed

## Development Workflow

1. **Frontend Development**: 
   - Develop feature modules and components
   - Use services for API communication
   - Run with Angular CLI

2. **Backend Development**:
   - Develop Express routes and controllers
   - Create or modify models as needed
   - Test API endpoints

3. **Full Stack Development**:
   - Run both frontend and backend servers
   - Test end-to-end functionality

## Best Practices Implemented

1. **TypeScript** for type safety
2. **Modular Architecture** for maintainability
3. **Single Responsibility Principle** in components and services
4. **Clean Code Practices** throughout the codebase
5. **Consistent Error Handling** for better debugging
6. **Secure Authentication** using modern patterns
7. **Real-time Updates** for a responsive user experience

This architecture provides a solid foundation for extension and further development while demonstrating modern best practices in MEAN stack development.