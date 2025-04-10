# College Event Management System

![System Screenshot](https://via.placeholder.com/1200x400?text=Event+Management+Dashboard)  
*A digital platform for streamlining event organization, registration, and attendance tracking in educational institutions.*

---

## 🎯 Project Overview
Automates the entire lifecycle of college events – from announcements and registrations to attendance and analytics – replacing manual processes with a centralized, scalable solution.

---

## 🌟 Key Features

### 🎓 For Students
- Browse upcoming events with filters (date, category, department)
- One-click registration with real-time seat availability
- Personalized dashboard for registered events
- Digital event reminders and calendar sync

### 🖥️ For Administrators
- Create/manage events with capacity limits
- Automated waitlist management
- QR-code based attendance marking
- Exportable reports (participation, attendance trends)

### ⚙️ Core Functionalities
- Role-based access control (Student, Faculty, Admin)
- Real-time notifications (email/in-app)
- Event photo galleries with moderation
- Responsive design for mobile/desktop

---

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Git

### Steps


##  Quick Start
Run these commands in order:

```bash
# 1. Clone the repository
git clone https://github.com/rjeetgupta/EventSphere
cd EventSphere

# 2. Set up environment
echo "MONGO_URI=mongodb://localhost:27017/EventSphere" > .env
echo "JWT_SECRET=your_strong_secret_here" >> .env

# 3. Install and run
npm install
npm run dev
   