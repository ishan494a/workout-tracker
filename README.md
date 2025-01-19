# Workout Tracker App

This is a mobile app for **iOS** and **Android** built to provide users with the ability to manage their personal workout data. The app allows users to register, log in, and track their workouts efficiently through a seamless frontend interface and a robust backend. The application uses modern mobile development frameworks, backend services, and a distributed database system to ensure scalability and performance.

## Technologies Used

### Frontend (Mobile):
- **React Native**
- **TypeScript**
- **Expo** (for development)

### Backend:
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **MongoDB**
- **bcrypt** (for password hashing)

## Features Implemented

### 1. **User Registration and Authentication**
- Implemented user registration functionality with input validation for fields such as `username`, `email`, and `password`.
- Passwords are securely hashed using `bcrypt` to ensure sensitive data is protected.
- Utilized Express.js to handle API requests and manage user data.

### 2. **Backend API Integration**
- The app sends user registration and login data to a PostgreSQL database, ensuring that user credentials are stored securely after bcrypt hashing.

### 3. **Navigation**
- Integrated **React Navigation** for smooth navigation between different screens (e.g., Login, Register).
- Conditional navigation is used based on the result of user actions (e.g., successful registration leads to login screen).

### 4. **Mobile Application Development**
- Developed using **Expo** and **React Native**, with **TypeScript** for type safety and scalability.
- Focused on ensuring the app is optimized for both iOS and Android platforms.

### 5. **Responsive Design**
- Designed to work across mobile devices, with a focus on providing a smooth and responsive user experience.
