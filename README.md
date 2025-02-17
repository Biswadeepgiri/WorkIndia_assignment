RAILWAY MANAGEMENT SYSTEM ----------------------->


MySql Database setup

CREATE DATABASE railway_db;
USE railway_db;


CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE trains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    train_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (train_id) REFERENCES trains(id)
);




1) User Registration (POST /api/auth/register)

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}

Response:
{
  "message": "User registered successfully"
}


2)  User Login (POST /api/auth/login)

Request:
{
  "email": "john@example.com",
  "password": "password123"
}


Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}


3) Add a Train (Admin Only) (POST /api/train/add)

Headers:

{
  "x-api-key": "YOUR_ADMIN_API_KEY"
}

Request:

{
  "name": "Rajdhani Express",
  "source": "Delhi",
  "destination": "Mumbai",
  "total_seats": 200
}

Response:
{
  "message": "Train added successfully"
}


4) Get Available Trains (GET /api/train/availability?source=Delhi&destination=Mumbai)

Response:
[
  {
    "id": 1,
    "name": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "total_seats": 200,
    "available_seats": 200
  }
]


5) Book a Seat (POST /api/booking/book)

Headers: 
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}


Request:
{
  "train_id": 1
}

Response(Success):
{
  "message": "Booking successful"
}

Response(Faliure):
{
  "error": "No seats available"
}


6) Get Booking Details (GET /api/booking/details)

Headers:
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

Response:
[
  {
    "id": 1,
    "user_id": 2,
    "train_id": 1
  }
]


