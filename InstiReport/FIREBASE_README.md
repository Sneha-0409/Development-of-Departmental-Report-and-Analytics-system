# Firebase Integration & Analytics Migration

This project has been successfully migrated to use **Firebase Firestore** as the central database instead of statically defining mock data.

## What was added:
1. **Firebase Project Connection**
   - The application connects to the `instireport` Firebase project.
   - Credentials are automatically loaded from securely defined `.env` files.
   
2. **Dynamic Analytics Charts**
   - The dashboards in `AnalyticsPage.jsx` now load data asynchronously from Firestore.
   - Using the `firebase/firestore` queries, graphs correctly map achievements, placements, faculty datasets, and activity metrics. 
   - A robust fallback mechanism exists within `src/data/analytics.js` in case fetch requests fail.

3. **Analytics Newsletter Subscriptions**
   - A subscription widget was added at the bottom of the Analytics page.
   - When users enter their email addresses, they are automatically stored into a `users` collection in Firestore using the `saveEmailToDatabase()` helper configured in `src/firebase.js`.

4. **One-Time Database Migration Tool (`scripts/migrateToFirebase.js`)**
   - We utilized a Node.js-based migration script to upload the predefined `JSON` mock data into the production Firestore collections, cleanly structuring datasets by department identifiers.
   
## Installation & Setup
Ensure dependencies are up-to-date:
```bash
npm install 
# Installs all necessary React tools, Recharts, and Firebase SDK 
```

### Environment Variables
For security reasons, your `.env` containing your custom Firebase keys is configured to be ignored by Git. If deploying, be sure to pass the `VITE_FIREBASE_*` variables into your CI/CD provider or hosting platform (Vercel, Firebase Hosting, Netlify).
