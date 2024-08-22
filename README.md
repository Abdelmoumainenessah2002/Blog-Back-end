# Blog API

This is a simple RESTful API for a blog application, built with Node.js, Express, MongoDB, and other technologies. The API allows users to register, log in, and perform CRUD operations on blog posts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middlewares](#middlewares)
- [Error Handling](#error-handling)
- [Upcoming Features](#upcoming-features)
- [License](#license)

## Features

- User Registration and Login
- Authentication using JSON Web Tokens (JWT)
- Password hashing using bcryptjs
- CRUD operations on blog posts
- Input validation using Joi

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Validation:** Joi
- **Development Tools:** Nodemon

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdelmoumainenessah2002/Blog-Back-end.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a .env file in the root directory and add the following variables:
   ```bash
   PORT = 8000
   MONGO_URI = your_mongo_db_connection_string
   JWT_SECRET = your_jwt_secret
   NODE_ENV = developement
   ```
4. **Start the development server:**

    ```bash
    npm run dev
    ```


## Usage

- Use a tool like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to interact with the API.
- **Authenticate with the API:**
  - **Register a new user:**
    - Send a POST request to `/api/auth/register` with the required fields (`username`, `email`, `password`) to create a new user account.
  - **Log in an existing user:**
    - Send a POST request to `/api/auth/login` with `email` and `password` to receive a JWT token.
- **Include the token in requests:**
  - Use the received token in the `Authorization` header of requests to access protected routes. The token should be prefixed with `Bearer `.
  - Example header: `Authorization: Bearer your_jwt_token_here`


## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user
  - **Request Body:**
    ```json
    {
      "username": "your_username",
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```

- **POST** `/api/auth/login` - Log in an existing user
  - **Request Body:**
    ```json
    {
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```
### Users
- **GET** `/api/users` - Get all users
  - **Description:** Retrieves a list of all users.
  - **Access:** Private (requires authentication)

- **GET** `/api/users/:id` - Get user profile
  - **Description:** Retrieves the profile of a specific user by their ID.
  - **Access:** Private (requires authentication)

- **PUT** `/api/users/:id` - Update user profile
  - **Description:** Updates the profile information of a specific user by their ID.
  - **Request Body:**
    ```json
    {
      "username": "new_username",
      "password": "new_password", // Optional
      "Bio": "new_bio"
    }
    ```
  - **Access:** Private (requires authentication)

- **GET** `/api/users/count` - Get the total number of users
  - **Description:** Retrieves the total count of users in the system.
  - **Access:** Private (requires authentication)

## Middlewares

- **Authentication Middleware:** Ensures routes are protected by verifying JWT tokens.
- **Error Handling Middleware:** Catches and processes errors from various parts of the application.

Add details about each middleware, including their functionality and how they integrate with the rest of the application.

## Error Handling

- **400 Bad Request:** This error occurs when the request is invalid or has missing or incorrect data. For example, if required fields are missing or data validation fails.

  ```json
  {
    "message": "Invalid request data"
  }
  ```

- **401 Unauthorized:** This error occurs when authentication is required but the request does not include valid credentials. For example, if a token is missing or invalid.

  ```json
  {
  "message": "Authentication failed"
  }
  ```

- **403 Forbidden:** This error occurs when the user is authenticated but does not have permission to access the requested resource. For example, if a non-admin user tries to access admin-only endpoints.

  ```json
  {
  "message": "Access denied"
  }
  ```

- **404 Not Found:** This error occurs when the requested resource could not be found. For example, if a user tries to access a non-existent endpoint or user.

  ```json
  {
  "message": "Resource not found"
  }
  ```

- **500 Internal Server Error:** This error occurs when there is an unexpected server-side issue. For example, if there is an error in the server code or an unhandled exception occurs

  ```json
  {
  "message": "Internal server error"
  }
  ```

This format provides clear and concise information about the possible errors and their responses, suitable for inclusion in your `README.md` file.






## Upcoming Features

The API currently supports user registration and login. The implementation for additional endpoints (such as CRUD operations for blog posts) is in progress and will be added in a future update. Stay tuned for the next version!

## License

This project is licensed under the MIT License.
    ```
    You can copy and paste this directly into your `README.md` file.
    ```
