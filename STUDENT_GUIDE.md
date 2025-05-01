# Student Guide to the SAR Auction Project

## Introduction

This guide provides an overview of the MEAN (MongoDB, Express, Angular, Node.js) stack auction application you'll be working with in this course. The project has been structured according to modern best practices to give you a solid foundation for your own development work.

## Project Structure

The application is divided into two main parts:

1. **Frontend**: Angular application (in the `src/` directory)
2. **Backend**: Node.js and Express application (in the `Backend/` directory)

### Frontend Structure (Angular)

The Angular frontend follows a modular architecture organized by feature:

```
src/
├── app/
│   ├── core/              # Core functionality used throughout the app
│   │   ├── guards/        # Route guards for authentication
│   │   ├── models/        # Data models/interfaces
│   │   └── services/      # Singleton services
│   ├── features/          # Feature modules organized by domain
│   │   ├── auction/       # Auction feature module
│   │   ├── auth/          # Authentication feature module
│   │   └── items/         # Items feature module
│   ├── material/          # Material design module
│   ├── shared/            # Shared components, directives, pipes
│   ├── app.component.ts   # Root component
│   └── app.module.ts      # Root module
├── assets/                # Static files
└── environments/          # Environment configuration
```

#### Key Components of the Frontend

- **Core Module**: Contains singleton services and models that are loaded once and used throughout the application
  - **Guards**: Authentication guards for route protection
  - **Models**: TypeScript interfaces representing data structures
  - **Services**: Services for API communication and business logic

- **Feature Modules**: Modules organized by feature/domain
  - **Auth Module**: Components for user authentication (signin/register)
  - **Auction Module**: Components for the auction functionality
  - **Items Module**: Components for item management

- **Shared Module**: Reusable components, directives, and pipes that can be imported by feature modules

### Backend Structure (Express.js & Node.js)

The backend follows a modular structure separated by concern:

```
Backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── services/         # Business logic
│   └── server.ts         # Entry point
├── cert.pem              # SSL certificate
├── key.pem               # SSL key
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

#### Key Components of the Backend

- **Config**: Configuration for database connections and environment variables
- **Controllers**: Handle the request/response logic
- **Middlewares**: Express middlewares for authentication and error handling
- **Models**: Mongoose schemas and models for MongoDB
- **Routes**: API route definitions
- **Services**: Business logic services, including websocket handling

## Key Technologies

- **MongoDB**: NoSQL database for data storage
- **Express.js**: Web framework for creating the API
- **Angular**: Frontend framework
- **Node.js**: JavaScript runtime for the server
- **TypeScript**: Typed JavaScript for better development experience
- **Socket.io**: Real-time communication between client and server
- **Angular Material**: UI component library
- **JWT**: JSON Web Tokens for authentication

## Application Features

The application is an auction site with the following features:

1. **User Authentication**: Registration and login
2. **Item Listing**: View available items for auction
3. **Bidding System**: Place bids on items
4. **Real-time Updates**: Live updates of bids and auction status via websockets
5. **Item Management**: Add new items to the auction
6. **User Geolocation**: Track and display user locations on a map
7. **Chat Functionality**: Send messages between users

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Setting Up the Development Environment

1. Clone the repository
2. Install backend dependencies:
   ```
   cd Backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd ..
   npm install
   ```
4. Start MongoDB
5. Start the backend server:
   ```
   cd Backend
   npm start
   ```
6. Start the Angular development server:
   ```
   npm start
   ```
7. Navigate to `https://localhost:3043` in your browser

## Development Guidelines

### Angular Development

1. **Component Structure**: When creating new components, place them in the appropriate feature module.
2. **Services**: Services that are used across multiple feature modules should be placed in the core/services directory.
3. **Models**: Data models should be defined in the core/models directory.
4. **State Management**: The application uses services for simple state management. For complex state, consider implementing NgRx.
5. **Routing**: Add new routes in the appropriate feature module's routing file.

### Backend Development

1. **API Endpoints**: Add new endpoints in the appropriate route file in the `Backend/src/routes` directory.
2. **Controllers**: Implement controller logic in the `Backend/src/controllers` directory.
3. **Models**: Define MongoDB schemas in the `Backend/src/models` directory.
4. **Middleware**: Add custom middleware in the `Backend/src/middlewares` directory.
5. **Authentication**: The application uses JWT for authentication. Protected routes require a valid JWT token.

### Best Practices

1. **Use TypeScript**: Write type-safe code with interfaces and proper typing.
2. **Follow Angular Style Guide**: Adhere to the [Angular Style Guide](https://angular.io/guide/styleguide).
3. **Error Handling**: Implement proper error handling with try/catch blocks and error services.
4. **Comments**: Write clear and concise comments explaining complex logic.
5. **Testing**: Write unit tests for components and services.
6. **Performance**: Be mindful of performance impacts, especially with Angular change detection.
7. **Security**: Always validate user input on both client and server sides.

## Project Structure Best Practices

This project follows several best practices for MEAN stack development:

### Angular Best Practices

- **Modular architecture**: Code is organized into feature modules
- **Core module**: Contains singleton services and guards
- **Shared module**: Contains reusable components, directives, and pipes
- **Barrel exports**: Index files are used for cleaner imports
- **Component isolation**: Components are organized by feature with their own templates and styles

### Express.js Best Practices

- **Route organization**: Routes are structured by feature
- **Middleware**: Uses middleware for authentication and error handling
- **Controllers**: Route handlers are separated into controller functions
- **Error middleware**: Centralized error handling

### MongoDB Best Practices

- **Schema design**: Schemas are designed according to application access patterns
- **Validation**: Implements schema validation
- **Relationships**: Uses references or embedding based on data relationships

## Common Tasks

### Adding a New Component

1. Create the component in the appropriate feature module:
   ```
   ng generate component features/[feature-name]/components/[component-name]
   ```

2. Add the component to the feature module's declarations.

3. If the component needs to be visible outside its module, add it to the module's exports.

### Adding a New Service

1. Create the service in the core/services directory:
   ```
   ng generate service core/services/[service-name]
   ```

2. Add the service to the core module's providers.

3. Import the service where needed.

### Adding a New API Endpoint

1. Create a route handler in the appropriate controller file in `Backend/src/controllers`.

2. Add the route to the appropriate route file in `Backend/src/routes`.

3. If needed, create a new model in `Backend/src/models`.

## Troubleshooting

### Common Issues

1. **JWT Token Expired**: Log out and log in again to refresh your token.

2. **WebSocket Connection Failed**: Ensure the backend server is running and check for any CORS issues.

3. **MongoDB Connection Issues**: Verify that MongoDB is running and the connection string is correct.

4. **TypeScript Compilation Errors**: Check for type errors and missing imports.

## Conclusion

This guide should help you understand the structure and organization of the MEAN stack auction application. Follow the development guidelines and best practices to ensure your code is maintainable, scalable, and follows industry standards.

For more detailed information about specific technologies, refer to their official documentation:

- [Angular Documentation](https://angular.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/)