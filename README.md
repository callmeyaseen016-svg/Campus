# Campus Cart - AI Campus Marketplace

An online student-to-student marketplace web application tailored for college campuses (specifically configured for **VIT students** with domain verification `@vitstudent.ac.in`). Students can list, search, filter, and buy second-hand textbooks, hostel bicycles, calculators, and electronics with real-time sync across sessions.

---

## 🎨 Theme & Aesthetic

Designed using a **notebook & graph-paper aesthetic**:
- **Paper White Canvas**: `#FAFBFC`
- **Checked Graph Grid**: `#C9E2F5` graph paper grid lines
- **Ink Navy Typography**: `#1B3A5C` high-contrast text
- **Notebook Red Accents**: `#E63946` for CTAs and marker underlines
- **Sticky Note Yellow**: `#FFD93D` for category tags, badges, and highlights

---

## ✨ Features

1. **Real-time Firestore Sync**: Real-time listing updates across open tabs without refreshing via Firebase Firestore `onSnapshot`.
2. **Student Email Authentication**: Google Auth restriction requiring `@vitstudent.ac.in` email addresses (with an interactive sticky note domain warning and instant demo mode fallback).
3. **Item Search & Live Filtering**: Search bar with live filtering by name, description, or category, alongside pill category filter chips (*All*, *Books*, *Cycles*, *Electronics*, *Other*).
4. **Interactive Listing Cards**: Index-card pinned aesthetic with category tags, condition badges, seller contact details, and a hand-drawn doodle heart favourite toggle.
5. **Client-side Image Compression**: Upload photos with automatic canvas compression (<150KB base64) to optimize Firestore document storage.
6. **Native Share Sheet & Clipboard**: Share button on every listing card that invokes `navigator.share` on mobile or copies link details on desktop.
7. **Favourites Persistence**: Saved items stored in `localStorage` across page reloads under the *Favourites* tab.

---

## 🚀 Deployment Guide (Vercel)

Deploying **Campus Cart** to Vercel takes less than 2 minutes:

### 1. Push Code to GitHub
Ensure all your project code is pushed to your GitHub repository.

### 2. Import Project in Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Select your GitHub repository (`Campus-Cart`) and click **Import**.
3. Vercel will automatically detect **Vite** as the framework preset.

### 3. Add Environment Variables
In the **Environment Variables** section on Vercel, add the following variables from your Firebase Console:

| Key | Example Value | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `campus-cart.firebaseapp.com` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `campus-cart-1234` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `campus-cart-1234.appspot.com` | Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1234567890` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:1234567890:web:abc123` | Firebase App ID |

### 4. Configure Firebase Auth Authorized Domains
In your [Firebase Console](https://console.firebase.google.com/):
1. Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
2. Add your Vercel deployment domain (e.g. `campus-cart.vercel.app`).

### 5. Deploy
Click **Deploy**. Vercel will build and publish your app.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript Linter
npm run lint

# Build for production
npm run build
```

---

## 📜 License
Built live at the **VinnovateIT Vibe Coding Workshop**.
