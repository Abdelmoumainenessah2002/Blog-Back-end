# Blog API

This is a simple RESTful API for a blog application, built with Node.js, Express, MongoDB, and other technologies. The API allows users to register, log in, and perform CRUD operations on blog posts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
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

- Use a tool like [Postman](https://www.postman.com/) to interact with the API.
- Register a new user, log in, and obtain a token for authentication.
- Include the token in the `Authorization` header for routes that require authentication.

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

## Upcoming Features

The API currently supports user registration and login. The implementation for additional endpoints (such as CRUD operations for blog posts) is in progress and will be added in a future update. Stay tuned for the next version!

## License

This project is licensed under the MIT License.
    ```
    You can copy and paste this directly into your `README.md` file.
    ```
