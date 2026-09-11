# Contact App

A simple full-stack contact management application built as a technical assignment.

The application provides:

* User login with JWT authentication
* Create, read, update, and delete (CRUD) contacts
* Protected contact management pages
* Form validation
* React-based frontend
* REST API backend
* MySQL database

## Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA / Hibernate
* MySQL
* Maven

### Frontend

* React
* Vite
* React Router
* JavaScript
* CSS

## Project Structure

```text
contact-app/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── .env.example
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Features

### Authentication

* Login using username and password
* Passwords are stored using BCrypt hashing
* JWT is generated after successful login
* Protected API endpoints require a valid JWT
* Invalid or expired tokens return `401 Unauthorized`

### Contact Management

* View all contacts
* View contact details
* Create a new contact
* Edit an existing contact
* Delete a contact
* Form validation for required fields and input length

## Backend API

| Method | Endpoint             | Description           | Authentication |
| ------ | -------------------- | --------------------- | -------------- |
| POST   | `/api/auth/login`    | Login and receive JWT | Public         |
| GET    | `/api/contacts`      | Get all contacts      | Required       |
| GET    | `/api/contacts/{id}` | Get contact by ID     | Required       |
| POST   | `/api/contacts`      | Create contact        | Required       |
| PUT    | `/api/contacts/{id}` | Update contact        | Required       |
| DELETE | `/api/contacts/{id}` | Delete contact        | Required       |

## Prerequisites

Make sure the following are installed:

* Java 21
* MySQL 8.x
* Node.js and npm

## Database Setup

Create the MySQL database:

```sql
CREATE DATABASE contact_app_db;
```

The application uses the following environment variables:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

For local development, these variables must be configured in your environment before starting the backend.

Example for PowerShell:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_database_password"
$env:JWT_SECRET="your_jwt_secret"
```

An example configuration is provided in:

```text
backend/.env.example
```

> The `.env` file is intentionally excluded from Git to prevent credentials and secrets from being committed.

## Running the Backend

Open a terminal in the `backend` directory:

```powershell
cd backend
```

Configure the required environment variables, then run:

```powershell
.\mvnw spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

## Running the Frontend

Open another terminal in the `frontend` directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Validation

### Backend

Run the test suite:

```powershell
.\mvnw clean test
```

Current test result:

```text
Tests run: 13
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

### Frontend

Run ESLint:

```powershell
npm run lint
```

Create a production build:

```powershell
npm run build
```

## Authentication Flow

```text
User
  |
  v
Login Page
  |
  | POST /api/auth/login
  v
Spring Security
  |
  | Validate credentials
  v
JWT Token
  |
  v
Frontend stores token
  |
  v
Protected Contact Pages
  |
  | Authorization: Bearer <token>
  v
Contact REST API
  |
  v
MySQL Database
```

## Notes

This project was developed as a technical assignment and is intended to demonstrate full-stack development, REST API design, authentication, database integration, frontend interaction, and basic testing.

The application is not intended to be production-ready. Configuration, security, deployment, and infrastructure would require additional hardening for a production environment.