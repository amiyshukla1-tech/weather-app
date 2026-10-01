# 🌦️ Skycast — Weather Forecast Web App

A modern, responsive, and secure weather dashboard built with **HTML5**, **Tailwind CSS v4**, **DaisyUI**, and **Vanilla JavaScript**. Skycast delivers real-time meteorological conditions, 24-hour historical records, future forecasts, smart autocomplete, and client-side caching protected by a serverless security proxy.

---

## ✨ Features

- **🌤️ Live Weather Dashboard**: Displays current temperature, real-time weather conditions, dynamic weather icons, wind speed, and rain probability.
- **🕒 24-Hour Timeline Ribbons**:
  - **Previous 24 Hours**: Review past temperatures, conditions, and precipitation.
  - **Next 24 Hours**: Plan ahead with hourly forecasts and smart rain indicators.
- **🔍 Intelligent City Autocomplete**: Powered by Open-Meteo Geocoding API with debounced queries to suggest cities as you type without extra cost.
- **⚡ Smart LocalStorage Caching**: Caches search results locally for 30 minutes, delivering instant 0ms responses and eliminating redundant API calls.
- **🔄 Protected Live Refresh**: Includes a confirmation modal to prevent accidental clicks from burning daily API quotas.
- **⚠️ User-Friendly Error Modal**: Clean modal dialogs (inspired by modern UX design) providing helpful messages for unknown cities, rate limits, and network issues.
- **🛡️ Secure Serverless Proxy**: Protects the Visual Crossing API key on the backend using Vercel Serverless Functions, keeping secrets 100% hidden from client-side DevTools.
- **💎 Glassmorphic Aesthetic**: Tailored emerald glass design with backdrop blurs, smooth micro-animations, and full mobile-first responsiveness.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure and accessibility |
| **Tailwind CSS v4** | Utility-first responsive styling and typography |
| **DaisyUI v5** | Modern modal dialogs and UI components |
| **Vanilla JavaScript (ES6+)** | State management, caching logic, and DOM rendering |
| **Visual Crossing Weather API** | Primary timeline & meteorological forecast data |
| **Open-Meteo Geocoding API** | Instant global city autocomplete suggestions |
| **Vercel Serverless Functions** | Secure API key proxy and Edge caching |

---

## 🔒 Security & Architecture

In typical frontend apps, API keys stored in client-side JavaScript can be intercepted via browser DevTools. Skycast solves this using a **Serverless Proxy Pattern**:

```
Browser (User)
      │
      ▼  /api/weather?city=London  (No API Key Exposed)
Vercel Serverless Function
      │
      ▼  process.env.VISUAL_CROSSING_KEY  (Secure Backend Request)
Visual Crossing API
```

- **Zero Key Leaks**: The browser only communicates with `/api/weather`.
- **Edge Cache**: Responses are cached on Vercel's Edge CDN (`s-maxage=1800`), ensuring lightning-fast load times globally.

---

## 🚀 Deployment to Vercel (Step-by-Step)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: configure serverless proxy and deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel](https://vercel.com) and log in with your GitHub account.
   - Click **"Add New..."** → **"Project"**.
   - Select your repository: `weather-app`.

3. **Configure Environment Variables**:
   - In the Vercel project configuration, expand **Environment Variables**.
   - Add:
     - **Key**: `VISUAL_CROSSING_KEY`
     - **Value**: `YOUR_VISUAL_CROSSING_API_KEY`
   - Click **Add**.

4. **Deploy**:
   - Click **Deploy**. Vercel will build and launch your live application with a public HTTPS URL!

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amiyshukla1-tech/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Tailwind CSS watcher**:
   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```

4. **Launch the app**:
   - Open `src/index.html` with VS Code Live Server or any static local server.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
