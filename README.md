# Restaurant Backend API

A comprehensive Node.js/Express backend for a restaurant management system with user authentication, menu management, shopping cart, order processing, and table booking features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)

## Features

- **User Authentication**: Register, login, and profile management with JWT tokens
- **Admin Panel**: Special admin credentials for administrative tasks
- **Category Management**: Create, read, update, delete food categories
- **Menu Management**: Manage restaurant menu items with images
- **Shopping Cart**: Add/remove items from cart, view cart contents
- **Order Processing**: Place orders, track order status, view order history
- **Table Booking**: Reserve tables with date, time, and guest count
- **Image Storage**: Cloud-based image uploads using Cloudinary
- **Database**: MongoDB for persistent data storage

## Tech Stack

- **Backend Framework**: Express.js
- **Runtime**: Node.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **CORS**: Cross-Origin Resource Sharing enabled
- **Environment**: dotenv for configuration

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd restaurent-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file** in the root directory with required environment variables (see below)

4. **Start the server**

```bash
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Port configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=admin_password_123

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=development

# CORS origin
CORS_ORIGIN=your_cors_origin_url
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

---

## Authentication Routes

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "success": true
}
```

**Error Responses:**

- `400`: Missing required fields
- `409`: User already exists

---

### 2. Login User

**POST** `/auth/login`

Login with email and password. Sets JWT token in HTTP-only cookie.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login Successful",
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `400`: Missing email or password
- `401`: Invalid credentials

---

### 3. Admin Login

**POST** `/auth/admin/login`

Special endpoint for admin login using hardcoded credentials.

**Request Body:**

```json
{
  "email": "admin@restaurant.com",
  "password": "admin_password_123"
}
```

**Response (200):**

```json
{
  "message": "Admin Login Successful",
  "success": true
}
```

**Error Responses:**

- `400`: Missing credentials
- `401`: Invalid credentials

---

### 4. Logout User

**POST** `/auth/logout`

Clear the authentication cookie and logout the user.

**Response (200):**

```json
{
  "message": "Logout Successful",
  "success": true
}
```

---

### 5. Get User Profile

**GET** `/auth/profile`

Get authenticated user's profile information.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (in cookies)
```

**Response (200):**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `401`: Unauthorized (no/invalid token)
- `404`: User not found

---

## Category Routes

### 1. Add Category

**POST** `/category/add`

Add a new food category (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: multipart/form-data
```

**Form Data:**

```
name: "Appetizers"
image: <image_file>
```

**Response (201):**

```json
{
  "message": "Category added successfully",
  "success": true,
  "category": {
    "_id": "category_id",
    "name": "Appetizers",
    "image": "https://cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- `400`: Missing name or image
- `403`: Forbidden (admin only)
- `409`: Category already exists

---

### 2. Get All Categories

**GET** `/category/all`

Retrieve all food categories.

**Response (200):**

```json
{
  "message": "Categories fetched successfully",
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "name": "Appetizers",
      "image": "https://cloudinary.com/...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Update Category

**PUT** `/category/update/:id`

Update a category (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: multipart/form-data (if uploading image)
```

**Form Data:**

```
name: "New Category Name" (optional)
image: <image_file> (optional)
```

**Response (200):**

```json
{
  "message": "Category updated successfully",
  "success": true,
  "category": {
    /* updated category data */
  }
}
```

---

### 4. Delete Category

**DELETE** `/category/delete/:id`

Delete a category (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
```

**Response (200):**

```json
{
  "message": "Category deleted successfully",
  "success": true
}
```

**Error Responses:**

- `403`: Forbidden (admin only)
- `404`: Category not found

---

## Menu Routes

### 1. Add Menu Item

**POST** `/menu/add`

Add a new menu item (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: multipart/form-data
```

**Form Data:**

```
name: "Chicken Biryani"
description: "Fragrant rice dish with spices"
price: 250
category: "category_id"
image: <image_file>
```

**Response (201):**

```json
{
  "message": "Menu item added successfully",
  "success": true,
  "menuItem": {
    "_id": "menu_id",
    "name": "Chicken Biryani",
    "description": "Fragrant rice dish with spices",
    "price": 250,
    "image": "https://cloudinary.com/...",
    "category": "category_id",
    "isAvailable": true
  }
}
```

**Error Responses:**

- `400`: Missing required fields
- `403`: Forbidden (admin only)

---

### 2. Get All Menu Items

**GET** `/menu/all`

Retrieve all menu items with category details.

**Response (200):**

```json
{
  "message": "Menu items fetched successfully",
  "success": true,
  "menuItems": [
    {
      "_id": "menu_id",
      "name": "Chicken Biryani",
      "description": "Fragrant rice dish with spices",
      "price": 250,
      "image": "https://cloudinary.com/...",
      "category": {
        "_id": "category_id",
        "name": "Main Course"
      },
      "isAvailable": true
    }
  ]
}
```

---

### 3. Update Menu Item

**PUT** `/menu/update/:id`

Update a menu item (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: multipart/form-data (if uploading image)
```

**Form Data:**

```
name: "Updated Name" (optional)
description: "Updated description" (optional)
price: 300 (optional)
category: "category_id" (optional)
isAvailable: true (optional)
image: <image_file> (optional)
```

**Response (200):**

```json
{
  "message": "Menu item updated successfully",
  "success": true,
  "menuItem": {
    /* updated data */
  }
}
```

---

### 4. Delete Menu Item

**DELETE** `/menu/delete/:id`

Delete a menu item (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
```

**Response (200):**

```json
{
  "message": "Menu item deleted successfully",
  "success": true
}
```

---

## Cart Routes

All cart routes require user authentication.

### 1. Add to Cart

**POST** `/cart/add`

Add an item to the shopping cart.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "menuItemId": "menu_id",
  "quantity": 2
}
```

**Response (200):**

```json
{
  "message": "Item added to cart successfully",
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "menuItem": "menu_id",
        "quantity": 2
      }
    ]
  }
}
```

**Error Responses:**

- `401`: Unauthorized
- `404`: Menu item not found

---

### 2. Get Cart

**GET** `/cart/get`

Retrieve the current user's shopping cart.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "_id": "item_id",
      "menuItem": {
        "_id": "menu_id",
        "name": "Chicken Biryani",
        "price": 250,
        "image": "https://cloudinary.com/..."
      },
      "quantity": 2
    }
  ]
}
```

**Empty Cart Response:**

```json
{
  "items": []
}
```

---

### 3. Remove from Cart

**DELETE** `/cart/remove`

Remove an item from the cart.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "menuItemId": "menu_id"
}
```

**Response (200):**

```json
{
  "message": "Item removed from the cart",
  "success": true,
  "cart": {
    /* updated cart */
  }
}
```

---

## Order Routes

### 1. Place Order

**POST** `/order/place`

Create a new order from the shopping cart.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "address": "123 Main Street, City, Country"
}
```

**Response (201):**

```json
{
  "message": "Order Placed Successfully",
  "success": true,
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "menuItem": "menu_id",
        "quantity": 2
      }
    ],
    "totalAmount": 500,
    "address": "123 Main Street, City, Country",
    "status": "Pending",
    "paymentMethod": "Cash on Delivery",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- `400`: Address missing or cart empty
- `401`: Unauthorized

---

### 2. Get User Orders

**GET** `/order/my-orders`

Retrieve all orders for the authenticated user.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "message": "Orders fetched successfully",
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "user": "user_id",
      "items": [
        /* order items */
      ],
      "totalAmount": 500,
      "address": "123 Main Street",
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Get All Orders (Admin)

**GET** `/order/orders`

Retrieve all orders in the system (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
```

**Response (200):**

```json
{
  "message": "Orders fetched successfully",
  "success": true,
  "orders": [
    /* all orders with user details */
  ]
}
```

---

### 4. Update Order Status (Admin)

**PUT** `/order/update-status/:orderId`

Update the status of an order (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "Preparing"
}
```

**Valid Status Values:**

- `Pending`
- `Preparing`
- `Delivered`

**Response (200):**

```json
{
  "message": "Order Status Updated",
  "success": true
}
```

---

## Booking Routes

### 1. Create Booking

**POST** `/bookings/create`

Create a new table reservation.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "98765432100",
  "numberOfPeople": 4,
  "date": "2024-02-15",
  "time": "19:00",
  "note": "Window seat preferred"
}
```

**Response (201):**

```json
{
  "message": "Table Booked Successfully",
  "success": true,
  "booking": {
    "_id": "booking_id",
    "user": "user_id",
    "name": "John Doe",
    "phone": "98765432100",
    "numberOfPeople": 4,
    "date": "2024-02-15",
    "time": "19:00",
    "note": "Window seat preferred",
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- `400`: Missing required fields
- `409`: Time slot already booked

---

### 2. Get User Bookings

**GET** `/bookings/my-bookings`

Retrieve all bookings for the authenticated user.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "message": "Successfully Fetched Bookings",
  "bookings": [
    /* user's bookings */
  ]
}
```

---

### 3. Get All Bookings (Admin)

**GET** `/bookings/bookings`

Retrieve all bookings in the system (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
```

**Response (200):**

```json
{
  "message": "Successfully Fetched Bookings",
  "success": true,
  "bookings": [
    /* all bookings with user details */
  ]
}
```

---

### 4. Update Booking Status (Admin)

**PUT** `/bookings/update-status/:id`

Update the status of a booking (admin only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN> (admin token)
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "Approved"
}
```

**Valid Status Values:**

- `Pending`
- `Approved`
- `Cancelled`

**Response (200):**

```json
{
  "message": "Booking Status Updated",
  "success": true,
  "booking": {
    /* updated booking */
  }
}
```

---

## Project Structure

```
restaurent-backend/
├── src/
│   ├── server.js                 # Main server entry point
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookingControler.js  # Booking logic
│   │   ├── cartController.js    # Cart logic
│   │   ├── categoryController.js# Category logic
│   │   ├── menuControllers.js   # Menu logic
│   │   └── orderController.js   # Order logic
│   ├── middleware/
│   │   ├── authMiddleWare.js    # JWT verification
│   │   └── multer.js            # File upload handling
│   ├── models/
│   │   ├── userModel.js         # User schema
│   │   ├── cartModel.js         # Cart schema
│   │   ├── bookingModel.js      # Booking schema
│   │   ├── categoryModel.js     # Category schema
│   │   ├── menuModel.js         # Menu item schema
│   │   └── orderModel.js        # Order schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── bookingRoutes.js     # Booking endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   ├── categoryRoutes.js    # Category endpoints
│   │   ├── menuRoutes.js        # Menu endpoints
│   │   └── orderRoutes.js       # Order endpoints
│   └── utils/
│       └── responseHandlers.js  # Response formatting utilities
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                      # This file
```

## Key Components

### Models (Database Schemas)

1. **User Model**: Stores user account information with hashed passwords
2. **Category Model**: Represents food categories
3. **Menu Model**: Represents individual menu items linked to categories
4. **Cart Model**: Stores items in user's shopping cart
5. **Order Model**: Stores completed orders with status tracking
6. **Booking Model**: Stores table reservations with status

### Controllers

- **Auth Controller**: Handles user registration, login, and profile management
- **Category Controller**: CRUD operations for food categories
- **Menu Controller**: CRUD operations for menu items
- **Cart Controller**: Add/remove items from cart
- **Order Controller**: Place orders and manage order status
- **Booking Controller**: Create and manage table reservations

### Middleware

- **Auth Middleware**: Protects routes with JWT verification
- **Admin Middleware**: Restricts routes to admin users only
- **Multer Middleware**: Handles file uploads for images

### Response Helpers

Standardized response functions for consistent API responses with proper HTTP status codes.

---

## Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Admin-only routes protected with middleware
- CORS enabled for frontend communication
- Environment variables for sensitive credentials
- MongoDB connection pooling

---

## Common Issues & Solutions

### Issue: "MONGODB_URI is not defined"

**Solution**: Ensure `.env` file contains `MONGODB_URI` variable with your MongoDB connection string

### Issue: "Cloudinary uploads not working"

**Solution**: Verify all Cloudinary credentials in `.env` file are correct

### Issue: "Admin login failing"

**Solution**: Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match login attempt

### Issue: "Cart/Order operations return 401"

**Solution**: Ensure JWT token is being sent in request cookies

---

**Generated Using Copilot**

---
