# InstiReport: Departmental Report and Analytics System

A centralized web-based portal that enables all departments to create, submit, and track annual reports in a standardized format. It integrates smart analytics, multi-year archives, and performance dashboards, reducing manual work and enabling data-driven insights for institutional growth.

The platform also integrates an Automated Timetable Generator that dynamically organizes classes, events, and tasks based on user input and constraints.

---

## ✨ Features

* **📝 Centralized Report Management:** Enables departments to create, submit, and track annual reports in a standardized digital format.
* **📊 Smart Analytics:** Integrates performance dashboards and analytics to provide data-driven insights.
* **🗄️ Multi-Year Archiving:** Securely archives reports from previous years for easy access and comparison.
* **📅 Automated Timetable Generation:** A dynamic tool to organize classes, events, and tasks based on custom constraints.
* **🔒 User Dashboards:** Provides a personalized dashboard for users to manage their tasks and reports.

---

## 🛠️ Technology Stack

* **Frontend:** React.js
* **Backend / Database:** Firebase Firestore
* **Build Tool:** Vite
* **Styling:** CSS Modules
* **Data Visualization:** Recharts
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have Node.js and npm installed on your machine.

### Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Sneha-0409/Development-of-Departmental-Report-and-Analytics-system.git
   cd Development-of-Departmental-Report-and-Analytics-system/InstiReport
   npm install
   ```

2. **Set up Firebase Configuration:**
   Create a `.env` file in the root of the `InstiReport` directory and add your Firebase project keys:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
   ```

3. **Migrate Mock Data to Firebase:**
   If this is a fresh database, you must run the migration script to populate your Firestore with the initial mock analytics data:
   ```bash
   node --env-file=.env scripts/migrateToFirebase.js
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```