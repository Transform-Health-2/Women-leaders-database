Client (React + Vite + Tailwind) — quick start

1) Install deps

```bash
cd client
npm install
```

2) Local dev

```bash
npm run dev
```

3) Build for GH-Pages

```bash
npm run build
# publish `dist/` to GitHub Pages (via action or gh-pages) and embed using an iframe
```

4) Configure Apps Script URL

Copy `.env.example` to `.env` and set `VITE_APPS_SCRIPT_URL` to your deployed Apps Script web app URL (see `apps-script/README_DEPLOY.md`).

5) Firebase Storage (profile photos)

Profile photos are uploaded to Firebase Storage. Before running the app, set up a Firebase project:

a) **Create a Firebase project**
   - Go to [firebase.google.com](https://firebase.google.com) → **Go to Console** → **Add project**
   - Name it (e.g. `transform-health-db`) and continue through setup (you can disable Analytics)

b) **Register a web app**
   - Click the **</>** (web) icon in the project overview
   - Give it a name (e.g. `transform-health-client`)
   - Copy the config object values

c) **Enable Storage**
   - Go to **Storage** in the left sidebar → **Get Started**
   - Start in **test mode** (you can lock down rules later for production)

d) **Add Firebase config to `.env`**
   - Add these variables to your `.env` file (values come from the Firebase web app config):
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

**Photo handling:**
- Images are compressed client-side before upload (max 600px longest edge, ~80% JPEG quality)
- Typical file size stays under 200KB without visible quality loss
- Photos are stored in Firebase Storage under `/profile-photos/<timestamp>-<name>.jpg`
- The download URL returned by Firebase is saved in the Sheets database alongside the profile
