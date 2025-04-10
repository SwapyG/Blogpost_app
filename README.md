## Blog Application - Full Stack Project
## Introduction
This is a full stack blog application built with the MERN stack (MongoDB, Express, React, Node.js). 
It features user authentication, post management, comments, categories, and tags. 
The application is designed to be production-ready with Docker containerization for easy deployment.

## ✨ Features

- **User Authentication and Authorization**
  - Register, login, and profile management

- **Role-Based Access Control**
  - Admin, editor, and user roles with different permissions

- **Blog Post Management**
  - Create, read, update, and delete (CRUD) blog posts
  - Rich text editor for post creation

- **Content Organization**
  - Categories and tags for organizing blog posts

- **Comment System**
  - Support for comments, replies, and likes

- **Responsive Design**
  - Fully optimized for all devices (mobile, tablet, desktop)

- **Search Functionality**
  - Search through blog posts and content

- **Admin Dashboard**
  - Tools for managing content, users, and settings

- **SEO Optimization**
  - Meta tags, clean URLs, and performance-focused design

## Technology Stack

### Backend

- **Node.js with Express**
- **MongoDB and Mongoose**
- **JWT for authentication**
- **Multer for file uploads**
- **Cloudinary for image storage**
- **Express Validator for input validation**

### Frontend

- **React.js**
- **Redux Toolkit for state management**
- **React Router for navigation**
- **Tailwind CSS for styling**
- **React Quill for rich text editing**
- **Axios for API requests**

## 📋 Project Structure
```{bash}
blog-app/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── redux/        # Redux state management
│       └── ...
├── server/               # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── ...
├── docker-compose.yml    # Docker Compose configuration
└── .env                  # Environment variables
```

## Installation

### Prerequisites

- **Node.js (v14+)**
- **MongoDB**
- **npm or yarn**

### Backend Setup
```{bash}
// Navigate to the server directory:
cd blog-app/server

// Install dependencies:
npm install
```

```{bash}
// Create a .env file in the server directory with the following variables:
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```
```{bash}
Start the server:
npm run dev
```

### Frontend Setup
```{bash}
// Navigate to the client directory:
cd blog-app/client

// Install dependencies:
npm install
```

- **Make sure Tailwind CSS is properly configured:**
```{bash}
// Ensure you have tailwind.config.js:
npx tailwindcss init -p
```

- *Add Tailwind directives to your CSS in src/index.css:**
```{bash}
css@tailwind base;
@tailwind components;
@tailwind utilities;
```

```{bash}
// Start the development server:
npm start
```
