# BIKRAM JIMI — Phase 1 Foundation

This repository is the first tested-development phase of the BIKRAM JIMI platform. It replaces the original Todo List demo with a responsive platform landing page and Firebase account foundation.

## Included in Phase 1
- Responsive dark/light interface
- Nepali/English hero text toggle
- Firebase email/password registration and sign-in
- Google sign-in
- Email verification and password reset
- Signed-in account dashboard
- Reads role from Firebase Authentication custom claims
- Firebase Realtime Database and Storage client initialization
- Restrictive starter Realtime Database and Storage rules
- PWA manifest and service worker
- Cloudflare Pages static build configuration

## Not yet implemented
Social feeds, messaging, calls, streaming, movies, music, marketplace, payments, creator earnings, education, gaming, jobs, AI, and the separate role dashboards are not active in this phase. They must not be treated as working features until implemented and tested in their own phases.

## Requirements
- Node.js 20.19+ or 22.12+
- npm
- Firebase project access
- GitHub repository
- Cloudflare account

## Run locally (Android Termux or desktop)
```bash
pkg update
pkg install nodejs-lts git
unzip BIKRAM-JIMI-Phase1.zip
cd BIKRAM-JIMI-Phase1
npm install
npm run dev -- --host 0.0.0.0
```
Open the local URL printed by Vite. On Termux, use the localhost URL shown in the terminal.

## Firebase setup
1. Open Firebase Console and select `itsbikramjimi`.
2. Enable Authentication > Email/Password and Google providers.
3. Add your deployed Cloudflare Pages hostname and local development hostname under Authentication > Settings > Authorized domains.
4. Confirm Realtime Database region and Storage bucket.
5. Review `firebase/database.rules.json` and `firebase/storage.rules` before deploying rules.
6. Deploy rules from Firebase Console or Firebase CLI.

The Firebase Web App configuration in `src/firebase.js` is a client configuration. Firebase Web API keys identify the project; they are not authorization. Protect data with Security Rules and trusted server-side verification. Never place a Firebase service-account JSON, payment secret, or AI provider secret in this repository.

## Deploy to Cloudflare Pages
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Connect the GitHub repository and deploy.

The `_redirects` file enables SPA fallback. `_headers` supplies baseline browser security headers. Review the Content Security Policy separately before adding one because Firebase and media integrations require deliberate allowlists.

## Role security
The UI reads the `role` custom claim only to decide what to display. It is not an authorization boundary. Firebase Rules must enforce access. Only a trusted Admin SDK environment may assign or revoke custom claims. Never let a client write its own role.

## Production checklist
- Enable Firebase App Check and configure appropriate providers.
- Configure authorized domains and OAuth consent settings.
- Deploy and test the database/storage rules in the Firebase Emulator Suite.
- Add server-side account provisioning and role administration before creating admin users.
- Configure monitoring, backup, retention and abuse controls.
- Complete accessibility, browser and mobile testing.
- Add payment integrations only with verified provider callbacks.

## Known limitations
- The initial Storage rule permits only authenticated user-owned image uploads under 10 MB. It is intentionally narrow.
- User profile data is not yet written to Realtime Database by the client.
- No administrator bootstrap endpoint is included; this prevents unsafe client-side privilege escalation.
- PWA caching is a minimal shell cache, not offline access to authenticated data.
