![Dash Board](image-2.png)
![AI Suggestions](image-3.png)
![Register Page](image.png)
![Login Page](image-1.png)

The Habit Tracker is a web application designed to help users build and maintain habits. It allows users to create habits, track their progress, and receive AI-powered suggestions for new habits

Setup Instructions

# Habit Tracker Project

## Overview
The Habit Tracker is a web application designed to help users build and maintain habits. It allows users to create habits, track their progress, and receive AI-powered suggestions for new habits.

---

## Features
- Add, update, and delete habits.
- Track daily, weekly, or custom frequencies for habits.
- AI-powered habit suggestions.
- API integration with backend services.

---

## Setup Instructions


### Backend Setup
1. Navigate to the backend folder:
   
   cd Backend
  
2. Install dependencies:
   
   npm install
  
3. Start the backend server:
   
   node server.js
  
   The backend will run on `http://localhost:5000` by default.

### AI Service Setup
1. Navigate to the AI-Service folder:
   
   cd AI-Service
  
2. Create a virtual environment:
   
   python -m venv .venv
  
3. Activate the virtual environment:
   - **Windows**:
     
     .venv\Scripts\activate
    
    
4. Install dependencies:
   
   pip install -r requirements.txt
  
5. Start the AI service:
   
   python app.py
   The AI service will run on `http://127.0.0.1:5000` by default.

### Frontend Setup
1. Navigate to the frontend folder:
   
   cd Frontend
2. Install dependencies:
   
   npm install
3. Start the frontend application:
   
   npm run dev
   The frontend will run on `http://localhost:5173` by default.

---

## API Documentation

### Base URL
- `http://localhost:5000/api`

### Endpoints

#### 1. **Create a Habit**
- **URL**: `/habits`
- **Method**: `POST`
- **Body Parameters**:
 json
  {
    "habit_title": "Drink Water",
    "frequency": "daily",
    "status": "Active"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "habit_title": "Drink Water",
    "frequency": "daily",
    "status": "Active"
  }
  ```

#### 2. **Get All Habits**
- **URL**: `/habits`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "habit_title": "Drink Water",
      "frequency": "daily",
      "status": "Active"
    }
  ]
  ```

#### 3. **Update Habit Status**
- **URL**: `/habits/:id`
- **Method**: `PUT`
- **Body Parameters**:
  ```json
  {
    "status": "Completed"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Habit updated successfully."
  }
  ```

#### 4. **Delete a Habit**
- **URL**: `/habits/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "message": "Habit deleted successfully."
  }
  ```

### AI Service API

#### 1. **Get Habit Suggestions**
- **URL**: `/generate-habit-suggestions`
- **Method**: `POST`
- **Body Parameters**:
  ```json
  {
    "user_habits": ["Drink Water", "Morning Walk"]
  }
  ```
- **Response**:
  ```json
  {
    "suggestions": [
      "Practice Mindful Meditation",
      "Stretching Exercises",
      "Healthy Snacking"
    ]
  }
  ```

---



