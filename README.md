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
- **bcrypt** (for password hashing)

## Features Implemented

### 1. **User Registration and Authentication**
- Implemented user registration functionality with input validation for fields such as `username`, `email`, and `password`.
- Passwords are securely hashed using `bcrypt` to ensure sensitive data is protected.
- Utilized Express.js to handle API requests and manage user data.
<img src="https://github.com/user-attachments/assets/c29b0198-a7e3-4f43-9d40-0663448e9780" width="300" />
<img src="https://github.com/user-attachments/assets/99374436-c793-4985-9954-48cc3b030a57" width="300" />
<img src="https://github.com/user-attachments/assets/a909f46b-ed8f-4a94-92d0-2f3698297836" width="300" />

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
