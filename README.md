# 📅 Appointment Booking System

A complete, full-stack appointment booking and management system with **React Admin Panel**, **Flutter Mobile/Web App**, and **Node.js Backend** with email-based OTP verification.

---

## 🎯 Project Overview

This is a professional appointment scheduling system that allows users to book appointments with consultants, verify bookings via OTP, and enables administrators to manage all appointments efficiently.

### 🏗️ Architecture

```
┌─────────────────┐
│  Flutter App    │ ← User Interface (Mobile/Web)
│  (User Side)    │
└────────┬────────┘
         │
         │ REST API
         ↓
┌─────────────────┐
│  Node.js API    │ ← Backend Server
│  (Express.js)   │ ← MongoDB Database
│                 │ ← Nodemailer (Email/OTP)
└────────┬────────┘
         │
         │ REST API
         ↓
┌─────────────────┐
│  React Admin    │ ← Admin Dashboard
│  (Admin Side)   │
└─────────────────┘
```

---

## ✨ Key Features

### 👤 **User Features (Flutter App)**

#### 🔐 Authentication & Authorization
- ✅ User Registration with email validation
- ✅ Secure Login with JWT tokens
- ✅ Token-based session management
- ✅ Persistent login (auto-login on app restart)
- ✅ Secure logout functionality

#### 📋 Consultant Management
- ✅ View all available consultants
- ✅ Browse consultant specializations
- ✅ Search and filter consultants
- ✅ Consultant profile display

#### 📅 Appointment Booking
- ✅ Book appointments with preferred consultants
- ✅ Interactive date picker (weekdays only)
- ✅ Time slot selection (10:00 AM - 5:30 PM)
- ✅ 30-minute appointment slots
- ✅ Visual time slot grid
- ✅ Booking confirmation with details

#### 📧 OTP Verification (NEW!)
- ✅ Email-based OTP verification
- ✅ 6-digit OTP system
- ✅ Secure appointment confirmation
- ✅ OTP expiry mechanism
- ✅ User-friendly OTP input dialog
- ✅ Real-time email notifications

#### 📱 My Appointments
- ✅ View all booked appointments
- ✅ Color-coded status badges
  - 🟡 **PENDING** - Awaiting confirmation
  - 🔵 **CONFIRMED** - Approved by admin
  - 🔴 **CANCELLED** - Cancelled by user/admin
  - 🟢 **COMPLETED** - Appointment finished
- ✅ Cancel appointments (if not completed/cancelled)
- ✅ Pull-to-refresh functionality
- ✅ Detailed appointment information
- ✅ Consultant details display

#### 👨‍💼 User Profile
- ✅ View user information
- ✅ App version display
- ✅ Logout functionality
- ✅ Profile customization

#### 🎨 UI/UX Features
- ✅ Material Design 3
- ✅ Gradient backgrounds
- ✅ Smooth animations
- ✅ Loading indicators
- ✅ Toast notifications
- ✅ Error handling with user-friendly messages
- ✅ Bottom navigation bar
- ✅ Responsive design (mobile & web)

---

### 🔧 **Admin Features (React Panel)**

#### 🔐 Admin Authentication
- ✅ Secure admin login
- ✅ Role-based access control (ADMIN only)
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Auto-redirect on unauthorized access
- ✅ Session persistence

#### 👥 Consultant Management
- ✅ Add new consultants
- ✅ View all consultants
- ✅ Real-time consultant list
- ✅ Consultant specialization tracking
- ✅ Success/error notifications

#### 📊 Appointment Dashboard
- ✅ View all appointments in tabular format
- ✅ Advanced filtering system:
  - 📅 Filter by date
  - 📊 Filter by status
  - 👤 Filter by consultant
- ✅ Clear filters option
- ✅ Appointment status management
- ✅ Real-time status updates
- ✅ User and consultant information display
- ✅ Appointment time details

#### 📧 OTP Management (NEW!)
- ✅ View OTP verification status
- ✅ "Unverified" badge for pending verifications
- ✅ Manual OTP verification by admin
- ✅ Resend OTP to users
- ✅ Visual verification indicators
- ✅ Bulk verification support

#### 📈 Status Management
- ✅ Update appointment status via dropdown
- ✅ Status options:
  - **PENDING** - Initial status
  - **CONFIRMED** - Admin approved
  - **CANCELLED** - Cancelled by admin/user
  - **COMPLETED** - Appointment finished
- ✅ Instant status reflection
- ✅ Confirmation dialogs

#### 🎨 Admin UI Features
- ✅ Clean, modern interface
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Dark/Light mode ready
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Hover effects
- ✅ Smooth transitions
- ✅ Navigation with active states

---

## 🛠️ Technology Stack

### **Frontend - React Admin Panel**
```javascript
- React 18.2.0
- React Router DOM 6.20.0
- Lucide React (Icons)
- Tailwind CSS (via CDN)
- Fetch API
- LocalStorage
```

### **Frontend - Flutter App**
```dart
- Flutter 3.16.0+
- Dart 3.0+
- Material Design 3
- Packages:
  - http: ^1.1.0
  - shared_preferences: ^2.2.2
  - intl: ^0.18.1
```

### **Backend - Node.js API**
```javascript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- dotenv
- cors
```

### **Database**
```
- MongoDB (NoSQL)
- Collections:
  - users
  - consultants
  - appointments
```

### **Email Service**
```
- Nodemailer
- SMTP Configuration
- OTP Generation
- Email Templates
```

---

## 📂 Project Structure

### **React Admin Panel**
```
appointment-admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   └── Toast.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── layouts/
│   │   └── DashboardLayout.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── ConsultantsPage.js
│   │   └── AppointmentsPage.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

### **Flutter User App**
```
appointment_app/
├── lib/
│   ├── api/
│   │   └── api_service.dart
│   ├── models/
│   │   ├── consultant.dart
│   │   └── appointment.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   ├── home_screen.dart
│   │   ├── consultants_screen.dart
│   │   ├── book_appointment_screen.dart
│   │   ├── my_appointments_screen.dart
│   │   └── profile_screen.dart
│   └── main.dart
├── android/
├── ios/
├── web/
└── pubspec.yaml
```

### **Backend API**
```
backend/
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Consultant.js
│   └── Appointment.js
├── routes/
│   ├── auth.js
│   ├── consultants.js
│   └── appointments.js
├── utils/
│   ├── mailer.js
│   └── otp.js
├── cron/
│   └── reminderJob.js
├── .env
├── server.js
└── package.json
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Flutter SDK (3.16.0+)
- npm or yarn
- Git

---

### **1. Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env file
PORT=4000
MONGODB_URI=mongodb://localhost:27017/appointment-system
JWT_SECRET=your-secret-key
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
OTP_EXPIRY_MINUTES=10

# Start server
npm start
```

**Backend runs on:** `http://localhost:4000`

---

### **2. React Admin Panel Setup**

```bash
# Navigate to admin folder
cd appointment-admin

# Install dependencies
npm install

# Start development server
npm start
```

**Admin panel opens at:** `http://localhost:3000`

**Default Admin Credentials:**
- Email: admin@example.com
- Password: admin123

---

### **3. Flutter App Setup**

```bash
# Navigate to Flutter project
cd appointment_app

# Install dependencies
flutter pub get

# Run on Chrome (Web)
flutter run -d chrome

# Run on Android Emulator
flutter run

# Run on iOS Simulator
flutter run -d ios
```

**App opens in browser/emulator**

---

## 📡 API Endpoints

### **Authentication**
```http
POST /api/auth/register
POST /api/auth/login
```

### **Consultants**
```http
GET  /api/consultants          # Public
POST /api/consultants          # Admin only
```

### **Appointments**
```http
POST /api/appointments                    # Create (sends OTP)
GET  /api/appointments/me                 # User's appointments
POST /api/appointments/:id/cancel         # Cancel appointment
GET  /api/appointments                    # All (Admin only)
POST /api/appointments/:id/status         # Update status (Admin)
POST /api/appointments/verify-otp         # Verify OTP (NEW!)
POST /api/appointments/resend-otp         # Resend OTP (NEW!)
```

---


## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Flutter Documentation](https://flutter.dev)
- [Node.js Documentation](https://nodejs.org)
- [MongoDB Documentation](https://mongodb.com)
- [Express.js Documentation](https://expressjs.com)

---

