# Workout Tracker App

**DEMO**: https://youtube.com/shorts/fvI57J8qrq8?feature=shared

**Workout Tracker** is a cross-platform mobile app built for **iOS** and **Android** that enables users to manage and track their personal workout data efficiently. The app offers a user-friendly frontend built with **React Native** and **Expo**, paired with a robust backend powered by **Node.js**, **Express.js**, and a combination of **PostgreSQL** and **MongoDB** for data storage. To ensure optimal performance, API requests are cached using **Redis**, and the app is deployed on **Google Cloud Platform (GCP)**.

## Technologies Used

### Frontend (Mobile):
- **React Native**: For building the mobile app, providing a responsive and native-like experience.
- **TypeScript**: For type safety and enhanced developer experience.
- **Expo**: Streamlined development and deployment of the React Native app.
- **React Navigation**: For managing smooth and intuitive navigation between app screens.

### Backend:
- **Node.js**: As the runtime environment for the backend API.
- **Express.js**: Framework to handle HTTP requests and build RESTful APIs.
- **PostgreSQL**: Relational database used for storing user credentials and core workout data.
- **MongoDB**: NoSQL database to store user-specific workout templates and history.
- **Redis**: Caching layer to optimize API request performance and reduce load on the database.
- **bcrypt**: For securely hashing and storing user passwords.

### Deployment:
- **Google Cloud Platform (GCP)**: For scalable cloud hosting and backend services.

## Features

### 1. **User Authentication**
- **Sign Up & Login**: Secure user registration and login functionality with input validation (username, email, password).
- **Password Security**: Passwords are hashed using **bcrypt** to ensure security.
- **Session Management**: Authentication tokens are used to manage user sessions.

### 2. **Workout Management**
- **Workout Templates**: Users can create, update, and delete custom workout templates.
- **Workout Selection**: A list of exercises is provided by the **ExerciseDB API**, allowing users to choose exercises to add to their templates.
- **Workout History**: Completed workouts are saved to the user's workout history, allowing users to track progress over time.
- **Sets Tracking**: Users can log sets with **reps** and **lbs**, tracking performance for each exercise.

### 3. **Performance Optimization**
- **API Caching**: API responses are cached using **Redis** to reduce load on the server and improve response times.
- **Scalable Backend**: Deployed on **GCP**, ensuring the app scales efficiently to handle growing user traffic.

### 4. **Interactive Stats & Graphs** 
- **Workout Frequency**: Users can see statistics on their workout frequency and track progress over time.
- **Interactive Graphs**: Data visualizations for sets, reps, and weights over time, giving users insights into their fitness journey.

### 5. **User Profile Management**
- **Profile Management**: Users will soon be able to view and manage their profile, including personal details, workout preferences, and progress.

