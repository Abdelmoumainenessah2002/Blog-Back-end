# Blog API

This is a simple RESTful API for a blog application, built with Node.js, Express, MongoDB, and other technologies. The API allows users to register, log in, and perform CRUD operations on blog posts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middlewares](#middlewares)
- [Utilities](#utilities)
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
- **Database:** MongoDB, Mongoose, Cloudinary
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
   Create a `.env` file in the root directory and add the following variables:
   ```bash
   PORT=8000
   MONGO_URI = your_mongo_db_connection_string
   JWT_SECRET = your_jwt_secret
   NODE_ENV = development
   CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret

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

- **POST** `/api/users/profile/profile-photo-upload` - Upload profile picture
  - **Description:** Allows the user to upload a profile picture. The image is uploaded to Cloudinary, and the user's profile is updated with the new image.
  - **Request:** Multipart form-data with the file field named `file`.
  - **Access:** Private (only the user themselves)

- **DELETE** `/api/users/profile/:id` - Delete user profile
  - **Description:** Deletes a user profile, including the user's profile photo from Cloudinary and other associated data.
  - **Access:** Private (only admin or the user themselves)

### Posts

- **POST** `/api/posts` - Create new post
  - **Description:** Creates a new post with an image uploaded to Cloudinary. The post is saved in the database.
  - **Request Body:**
    ```json
    {
      "title": "Post title",
      "description": "Post description",
      "category": "Post category"
    }
    ```
  - **Request:** Multipart form-data with the file field named `file`.
  - **Access:** Private (only logged-in users)

- **GET** `/api/posts` - Get all posts
  - **Description:** Retrieves a list of all posts. Supports pagination and filtering by category.
  - **Query Parameters:**
    - `pageNumber`: Page number for pagination.
    - `category`: Filter posts by category.
  - **Access:** Public

- **GET** `/api/posts/:id` - Get single post
  - **Description:** Retrieves a specific post by its ID.
  - **Access:** Public

- **GET** `/api/posts/count` - Get posts count
  - **Description:** Retrieves the total count of posts in the system.
  - **Access:** Private (only admin)

- **DELETE** /api/posts/:id - Delete post
  - **Description:** Deletes a specific post by its ID. Only the admin or the user who created the post can delete it.
  - **Access:** Private (only admin or the user who created the post)

- **PUT** /api/posts/:id - Update post
  - **Description:** Updates a specific post by its ID. Only the user who created the post can update it.
  - **Request Body:**
    
    ```json
    {
      "title": "Updated title",
      "description": "Updated description",
      "category": "Updated category"
    }
    ```

  - **Access:** Private (only the user who created the post)

- **PUT** /api/posts/upload-image/:id - Update post image
  - **Description:** Updates the image of a specific post by its ID. Only the user who created the post can update the image.
  - **Request:** Multipart form-data with the file field named `file`.
  - **Access:** Private (only the user who created the post)

- **PUT** /api/posts/liked/:id - Toggle Like
  - **Description:** Toggles the like status of a specific post by its ID. Only logged-in users can like or unlike the post.
  - **Access:** Private (only logged-in users)

### Comments

- **POST** /api/comments - Add a new comment
  - **Description:** Adds a new comment to a specific post.
  - **Request Body:**
    
    ```json
    {
      "postId": "ID of the post",
      "text": "Comment text"
    }
    ```

  - **Access:** Private (only logged-in users)

- **GET** /api/comments - Get all comments
  - **Description:** Retrieves a list of all comments in the system.
  - **Access:** Private (only admin)

- **DELETE** /api/comments/:id - Delete comment
  - **Description:** Deletes a specific comment by its ID. Only the admin or the user who created the comment can delete it.
  - **Access:** Private (only admin or the user who created the comment)

- **PUT** /api/comments/:id - Update comment
  - **Description:** Updates a specific comment by its ID. Only the user who created the comment can update it.
  - **Request Body:**
    
    ```json
    {
      "text": "Updated comment text"
    }
    ```

  - **Access:** Private (only logged-in users and who create the post)


## Middlewares

- **Authentication Middleware:** Ensures routes are protected by verifying JWT tokens.

- **Error Handling Middleware:** Catches and processes errors from various parts of the application.

- **Object ID Validation Middleware:** Validates MongoDB Object IDs in request parameters.
  - **Functionality:** This middleware checks if the provided ID is a valid MongoDB Object ID. If the ID is invalid, it returns a `400 Bad Request` response with a message indicating that the Object ID is invalid.
  - **Usage:**
    ```javascript
    const validateObjectId = require('./path/to/middleware');
    app.use('/api/some-route/:id', validateObjectId, someController);
    ```

- **Photo Upload Middleware:** Handles image uploads using `multer`.
  - **Functionality:** This middleware manages image uploads, storing them in a specified directory on the server. It also enforces file size limits (e.g., 5MB) and ensures that only image files are accepted.
  - **Usage:**
    ```javascript
    const photoUpload = require('./path/to/middleware');
    app.post('/api/users/profile/profile-photo-upload', photoUpload.single('file'), profilePhotoUploadCtrl);
    ```

## Utilities

- **Cloudinary Utility:** This utility, located in the `utils/Cloudinary.js` file, handles image uploads and deletions using Cloudinary.
  - **Functions:**
    - `cloudinaryUploadImage(file)`: Uploads an image to Cloudinary and returns the uploaded image data.
    - `cloudinaryRemoveImage(imagePublicId)`: Deletes an image from Cloudinary using its public ID.
  - **Usage:** These functions are used in controllers that require image upload or deletion functionality.
  

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
