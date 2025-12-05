# Taiwan Radio

Minimalist Taiwan AM Radio Player.

## Features

- Clean, minimalist UI
- HLS Stream playback using `hls.js`
- Master and Variant stream selection
- Responsive design

## Tech Stack

- Next.js 15
- React
- Tailwind CSS
- hls.js

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run development server (runs on port 3023):
   ```bash
   yarn dev
   ```
   Or use the start script:
   ```bash
   ./start.sh
   ```
   The app will be available at http://localhost:3023

3. Build for production:
   ```bash
   yarn build
   yarn start  # Production server also runs on port 3023
   ```

## Deployment

### GitHub

1. Create a new repository on GitHub.
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/taiwan-radio.git
   git branch -M main
   git push -u origin main
   ```

### Vercel

The easiest way to deploy is to use the Vercel CLI or import your GitHub repository in the Vercel Dashboard.

**Using CLI:**
```bash
npx vercel
```
