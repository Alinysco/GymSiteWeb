# FitTrack — Gym Membership Management System

A full-stack web application for managing gym memberships. Members can register, track their membership status, and manage their accounts. Admins have full control over users and membership assignments — all through a clean, role-based interface.

---

## Features

### Member Features

- Register and log in securely
- View personal dashboard with membership status, start date, and expiry date
- See a clear notice when membership is inactive (pending in-person activation)
- Update profile information (name, email, password)
- Browse available gym courses and classes (active membership required)
- View course details including instructor, date, time, and description

### Admin Features

- Overview dashboard with total members, active memberships, and inactive counts
- View and manage all registered members in a table
- Activate or deactivate a member's membership (auto-sets start/end dates)
- Edit member information (name, email) via an inline modal
- Delete member accounts
- Assign and update memberships manually (status, start date, end date)
- View all courses in a management table
- Create new courses (name, instructor, description, date, start time)
- Delete existing courses

---

## Tech Stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | React (SPA), React Router, Fetch API |
| Backend  | Laravel 13 (REST API)                |
| Auth     | Laravel Sanctum (token-based)        |
| Database | MySQL                                |
| Sessions | Database-backed sessions             |

---

## Project Structure

```
fittrack/
├── gym-api/                        # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php        # register, login, logout, me
│   │   │   │   ├── AdminController.php       # user CRUD, activate/deactivate
│   │   │   │   ├── MembershipController.php  # assign & update memberships
│   │   │   │   ├── CourseController.php      # index, store, destroy
│   │   │   │   └── UserController.php        # profile view & update
│   │   │   ├── Middleware/
│   │   │   │   └── RoleMiddleware.php        # role:admin guard
│   │   │   ├── Requests/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   ├── StoreCourseRequest.php
│   │   │   │   ├── UpdateProfileRequest.php
│   │   │   │   └── UpdateUserRequest.php
│   │   │   └── Resources/
│   │   │       ├── UserResource.php
│   │   │       ├── CourseResource.php
│   │   │       └── MembershipResource.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Course.php
│   │       └── Membership.php
│   ├── config/
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cache.php
│   │   ├── sanctum.php
│   │   └── session.php
│   ├── routes/
│   │   └── api.php
│   └── .env
│
└── react-front-end-gym/                       # React SPA
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminUsers.jsx
    │   │   ├── SettingsPage.jsx
    │   │   ├── Coursespage.jsx       # User-facing courses page (active membership required)
    │   │   └── Coursesadmin.jsx      # Admin courses management page
    │   ├── components/
    │   │   ├── AppLayout.jsx
    │   │   ├── Navbar.jsx            # Updated: Courses link for logged-in users
    │   │   ├── Sidebar.jsx           # Updated: Courses link for admin and user menus
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Footer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── services/
    │       └── api.js                # Updated: getCourses, addCourse, deleteCourse
    └── public/
        └── images/
            └── logop.png
```

---

## Prerequisites

Before installing, make sure the following are set up on your machine:

- **XAMPP** (or any local server stack with Apache + MySQL)
- **PHP >= 8.2** (included with XAMPP)
- **Composer**
- **Node.js >= 18 & npm**
- **Git**

---

## Installation

### 1. Start XAMPP

1. Open the **XAMPP Control Panel**
2. Start the **Apache** module
3. Start the **MySQL** module

### 2. Create the Database

1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click **New** in the left sidebar
3. Enter a database name (e.g., `fittrack`)
4. Click **Create**

### 3. Clone the Repository

```bash
git clone https://github.com/Alinysco/GymSiteWeb.git
cd GymSiteWeb
```

---

### 4. Backend Setup (Laravel)

```bash
# Navigate to the backend directory
cd gym-api

# Install PHP dependencies
composer install

# Copy and configure environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`.

---

### 5. Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd react-front-end-gym

# Install dependencies
npm install

# Start the server
npm start
```

The frontend will be available at `http://localhost:3000` (or as shown in your terminal).

---

## Environment Variables

Copy `.env.example` to `.env` in the `gym-api/` directory and fill in your values:

```dotenv
APP_NAME=FitTrack
APP_ENV=local
APP_KEY=                          # Generated via: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en

LOG_CHANNEL=stack
LOG_LEVEL=debug

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fittrack              # The database name you created in phpMyAdmin
DB_USERNAME=root                  # Default XAMPP username
DB_PASSWORD=                      # Default XAMPP password is empty

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache
CACHE_STORE=database

# Queue
QUEUE_CONNECTION=database

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000
```

> **Note:** Never commit your real `.env` file to version control. Add it to `.gitignore`.

---

## Running the Project

1. Ensure **Apache** and **MySQL** are running in the XAMPP Control Panel
2. In the `gym-api/` directory, run `php artisan serve` — API at `http://localhost:8000`
3. In the `react-front-end-gym/` directory, run `npm start` — app at `http://localhost:3000`
4. Open your browser and navigate to `http://localhost:3000`

---

## Creating an Admin Account

To create an admin, use Laravel Tinker after running migrations:

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name'              => 'Admin',
    'email'             => 'admin@fittrack.com',
    'password'          => bcrypt('password'),
    'role'              => 'admin',
    'membership_status' => 'active',
]);
```

Alternatively, manually set `role = 'admin'` on any user row via phpMyAdmin.

---

## API Overview

All routes are prefixed with `/api`. Authentication uses **Bearer tokens** via Laravel Sanctum.

### Public Routes

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/api/register` | Register a new user      |
| POST   | `/api/login`    | Log in and receive token |

### Protected Routes — All Users (`auth:sanctum`)

| Method | Endpoint       | Description                  |
|--------|----------------|------------------------------|
| GET    | `/api/me`      | Get authenticated user data  |
| POST   | `/api/logout`  | Logout and revoke token      |
| GET    | `/api/profile` | Get current user profile     |
| PUT    | `/api/profile` | Update name, email, password |
| GET    | `/api/cours`   | Get all courses              |

### Protected Routes — Admin Only (`auth:sanctum` + `role:admin`)

#### User Management

| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| GET    | `/api/admin/users`                    | List all users (with membership) |
| PUT    | `/api/admin/users/{id}`               | Edit a user's name/email         |
| DELETE | `/api/admin/users/{id}`               | Delete a user account            |
| POST   | `/api/admin/users/{id}/activate`      | Activate membership (sets dates) |
| POST   | `/api/admin/users/{id}/deactivate`    | Deactivate membership            |

#### Membership Management

| Method | Endpoint                           | Description                  |
|--------|------------------------------------|------------------------------|
| POST   | `/api/admin/memberships/{userId}`  | Assign membership to a user  |
| PUT    | `/api/admin/memberships/{userId}`  | Update an existing membership|

#### Course Management

| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| POST   | `/api/admin/cours`      | Create a new course |
| DELETE | `/api/admin/cours/{id}` | Delete a course     |

### Example: Login Response

```json
{
  "message": "Login successful",
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "membership_status": "active",
    "membership": {
      "id": 1,
      "status": "active",
      "start_date": "2025-05-01",
      "end_date": "2025-06-01"
    }
  }
}
```

### Example: Course Object

```json
{
  "id": 1,
  "name": "Morning Yoga",
  "instructor": "Jane Smith",
  "description": "A relaxing morning yoga session.",
  "date": "2025-06-10",
  "start_time": "08:00:00"
}
```

---

## Future Improvements

- **Email notifications** — notify members when their membership is activated, deactivated, or about to expire
- **Membership plans** — allow admins to create plans (monthly, quarterly, annual) and let members choose and subscribe online
- **Online payment integration** — Stripe or PayPal for self-service membership purchase
- **Member check-in tracking** — log gym visits and display attendance history on the dashboard
- **Membership renewal reminders** — automatic alerts before expiry
- **Course editing** — allow admins to edit existing course details
- **Course enrollment** — allow members to enroll in courses and track attendance
- **Export reports** — admin ability to export member data as CSV/PDF
- **Dark/light theme toggle** — user preference stored in profile settings
- **Refresh token support** — automatic silent token renewal for longer sessions

---

## License

This project is for educational/personal use. No license is currently applied.