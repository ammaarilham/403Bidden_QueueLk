# Queue.lk - Digital Queue Management System

**Team:** 403bidden  
**Repository:** https://github.com/ammaarilham/403Bidden_QueueLk.git

## 🎯 Project Overview

Queue.lk is a comprehensive digital queue management system designed to eliminate physical queues in Sri Lankan government services. Our platform transforms the traditional waiting experience by allowing citizens to book appointments online, manage their documents digitally, and receive real-time updates about their service requests.

### Problem Statement

Government offices across Sri Lanka face chronic issues with long physical queues, inefficient service delivery, and poor customer experience. Citizens often waste entire days waiting in lines, leading to productivity loss and frustration. Our system addresses these challenges by digitizing the entire appointment booking and queue management process.

## ✨ Key Features

### **For Citizens (Customers)**

- 🔐 **Secure Authentication** - Login/signup with profile management
- 📋 **Service Booking** - Book appointments for government services
- 🎪 **Event Registration** - Register for government events and programs
- 📱 **Digital Documents** - Upload and manage official documents (NIC, Birth Certificate, etc.)
- 📊 **QR Code Access** - Generate QR codes for quick document verification
- 📈 **Booking History** - Track all past appointments and bookings
- 🔔 **Real-time Updates** - Get notifications about booking status

### **For Government Administrators**

- 👥 **User Management** - Manage citizen accounts and admin access
- 🏢 **Institution Management** - Add and configure government offices
- 🛠️ **Service Management** - Create and manage available services
- 📅 **Event Management** - Organize government events and programs
- 📊 **Analytics Dashboard** - Monitor booking trends and service usage
- 📋 **Booking Oversight** - View and manage all citizen bookings

### **System Features**

- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🎨 **Modern UI** - Clean, intuitive interface using Shadcn UI components
- ⚡ **Fast Performance** - Optimized with Next.js and server-side rendering
- 🔒 **Data Security** - Secure file uploads and user data protection
- 🌐 **Multi-language Support** - Ready for Sinhala/Tamil localization

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Modern component library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQL Database** - Relational data storage
- **Multer** - File upload handling
- **Cookie-based Authentication** - Session management

### **Development Tools**

- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (SQL)         │
│   Port: 3000    │    │   Port: 5000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Project Structure**

```
PROJECT-QUEUE/
├── backend/                   # Express.js backend server
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin-dashboard/   # Admin interface
│   │   │   ├── customer-list/ # Customer management
│   │   │   ├── events/        # Event management
│   │   │   ├── institutions/  # Institution management
│   │   │   ├── services/      # Service management
│   │   │   └── users/         # User management
│   │   ├── customer-dashboard/ # Customer interface
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── documents/     # Document viewer
│   │   │   ├── inquiries/     # Inquiry submission
│   │   │   └── profile/       # Profile management
│   │   ├── login/             # Authentication
│   │   └── signup/            # User registration
│   ├── components/            # Reusable components
│   │   ├── custom/            # Custom components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # Shadcn UI components
│   └── lib/                   # Utility functions
├── public/
│   └── assets/
│       ├── branding/          # Logo and branding assets
│       └── images/            # Uploaded documents and images
│           ├── profile_pictures/
│           └── other_documents/
└── package.json
```

## 🚀 Installation & Setup

### **Prerequisites**

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **SQL Database** (MySQL/PostgreSQL)
- **Git** for cloning the repository

### **Step 1: Clone Repository**

```bash
git clone https://github.com/ammaarilham/403Bidden_QueueLk.git
cd 403Bidden_QueueLk
```

### **Step 2: Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Set up database
# Create your SQL database and run migrations/setup scripts
# Update database connection settings in your backend configuration

# Start backend server
node server.js
# Backend will run on http://localhost:5000
```

### **Step 3: Frontend Setup**

```bash
# Open new terminal and navigate to project root
cd ../

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
# Frontend will run on http://localhost:3000
```

### **Step 4: Database Configuration**

```sql
-- Create database
CREATE DATABASE queue_lk;

-- Set up tables (example structure)
-- Add your actual SQL schema here
-- Tables: users, institutions, services, events, bookings, documents, etc.
```

### **Step 5: Access the Application**

- **Frontend (Citizens & Admins):** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📱 Usage Guide

### **For Citizens**

1. **Sign Up** - Navigate to http://localhost:3000/signup
2. **Complete Profile** - Upload required documents (NIC, certificates)
3. **Book Services** - Select government service and preferred date
4. **Track Bookings** - Monitor appointment status in dashboard
5. **Generate QR** - Create QR code for document verification

### **For Administrators**

1. **Admin Access** - Login with administrative privileges
2. **Manage Institutions** - Add government offices and departments
3. **Configure Services** - Set up available services and capacity
4. **Monitor Bookings** - Oversee citizen appointments and requests
5. **User Management** - Handle citizen accounts and access levels

## 🔧 Additional Implementations

### Enhanced User Experience

- **Custom Select Components** - Built custom dropdown components when Shadcn select had compatibility issues
- **Advanced Form Validation** - Implemented comprehensive Zod schemas with real-time validation
- **Responsive File Upload** - Created intuitive file upload system with preview capabilities
- **Smart Navigation** - Context-aware navigation based on user roles

### **Performance Optimizations**

- **Image Optimization** - Used Next.js Image component for optimal loading
- **Component Optimization** - Implemented proper loading states and error boundaries
- **Form State Management** - Efficient form handling with React Hook Form
- **Toast Notifications** - Replaced heavy modal systems with lightweight Sonner toasts

### **Security Features**

- **File Type Validation** - Strict file upload restrictions (images/PDFs only)
- **Session Management** - Secure cookie-based authentication
- **Data Validation** - Server-side and client-side validation layers
- **Role-based Access** - Separate interfaces for citizens and administrators

### **UI/UX Innovations**

- **Consistent Design System** - Unified styling across all components
- **Accessibility Features** - ARIA labels and keyboard navigation support
- **Mobile-first Design** - Responsive layouts optimized for mobile devices
- **Interactive Elements** - Hover effects and smooth transitions

### **Technical Achievements**

- **Modern React Patterns** - Used React Hook Form with Zod validation across all forms
- **Type Safety** - Full TypeScript implementation with proper interfaces
- **Component Architecture** - Modular component design with Shadcn UI
- **File Management** - Robust file upload system with preview and validation
- **State Management** - Efficient state handling without external libraries

## ⚠️ Limitations & Assumptions

### **Current Limitations**

- **Single Language** - Currently supports English only *(ready for localization)*
- **Basic Analytics** - Simple booking counts (can be expanded to detailed analytics)
- **Manual Admin Creation** - Admin accounts require manual setup
- **Limited Payment Integration** - No payment gateway integration yet
- **Manual Database Setup** - Requires manual database configuration and schema setup
- **Development Environment** - Optimized for local development setup

## 🚀 Future Improvements

### **Short-term Enhancements**

- **SMS/Email Notifications** - **Automated** appointment reminders
- **Multi-language Support** - Sinhala and Tamil localization
- **Advanced Search** - Filter services by location, type, availability
- **Appointment Rescheduling** - Allow users to modify booking dates
- **Bulk Operations** - Admin tools for batch processing

### **Long-term Roadmap**

- **Mobile Applications** - Native iOS and Android apps
- **AI Chat Support** - Intelligent chatbot for user assistance
- **Analytics Dashboard** - Comprehensive reporting and insights
- **API Integration** - Connect with existing government systems
- **Blockchain Verification** - Secure document authentication
- **IoT Integration** - Physical queue monitoring sensors
- **Machine Learning** - Predictive analytics for service demand

### **Scalability Improvements**

- **Microservices Architecture** - Break system into smaller services
- **Cloud Migration** - Deploy on AWS/Google Cloud for scalability
- **CDN Integration** - Global content delivery for faster loading
- **Database Optimization** - Implement caching and indexing strategies
- **Load Balancing** - Handle high traffic volumes efficiently

## 🐛 Troubleshooting

### **Common Issues**

- **Port Conflicts** - Ensure ports **3000** and **5000** are available
- **Database Connection** - Verify database is running and connection settings are correct
- **File Upload Issues** - Check file permissions for `public/assets/images/` directories
- **Module Not Found** - Run `npm install` in both root and backend directories

### **Development Tips**

- Run backend first (`cd backend && node server.js`), then frontend (`npm run dev`)
- Check browser console for frontend errors
- Monitor backend logs for API issues
- Ensure database is properly initialized with required tables
- File uploads are stored in `public/assets/images/` - ensure these directories exist

## 👥 Team Information

**Team Name:** 403bidden

**Team Members:**
- **Ammaar Ilham** - [www.ammaarilham.dev](https://www.ammaarilham.dev/)
- **Thilina Rathnayaka** - [thilina.dev](https://thilina.dev/)

**Repository:** https://github.com/ammaarilham/403Bidden_QueueLk.git

---

## 📞 Support & Contact

For questions, issues, or contributions, please contact the development team or create an issue in the project repository.


---

_This project is part of Tech-Triathlon 2025, focusing on eliminating physical queues in government services through innovative digital solutions._
