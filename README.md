# 🌦️ Skycast — Weather Forecast Web App

An elegant, responsive, and production-grade weather dashboard built with **Tailwind CSS v4**, **DaisyUI**, and **Vanilla JavaScript**, featuring 24-hour historical records, future forecast ribbons, smart caching, and a secure serverless backend.

- **Live Application**: [https://weather-app-inky-kappa-22.vercel.app](https://weather-app-inky-kappa-22.vercel.app)
- **Repository**: [https://github.com/amiyshukla1-tech/weather-app](https://github.com/amiyshukla1-tech/weather-app)
- **License**: [ISC License](LICENSE)

---

## 📖 Overview

**Skycast** was designed to solve common issues found in typical weather applications: slow response times, exposed API keys, and cluttered interfaces. Built on a tailored dark-emerald glassmorphism aesthetic, it integrates client-side caching with a zero-leak serverless API proxy to deliver a secure, lightning-fast experience.

---

## ✨ Key Features

- **🌤️ Live Meteorological Conditions**: Real-time temperature, condition descriptions, dynamic weather icons, wind speeds, and precipitation probabilities.
- **🕒 Dual 24-Hour Timeline Ribbons**:
  - **Previous 24 Hours**: Detailed lookback at temperatures and historical trends.
  - **Next 24 Hours**: Continuous forecast strip with smart rain indicators.
- **🔍 Debounced City Autocomplete**: Instant search suggestions powered by the Open-Meteo Geocoding API with 300ms debounce to eliminate unnecessary requests.
- **⚡ Smart LocalStorage Caching**: Re-searching a city within 30 minutes loads instantly (0ms latency) with zero external API calls.
- **🔄 Accidental Refresh Protection**: A modern confirmation popup prevents unintentional clicks from burning daily API quotas.
- **⚠️ Polished Error Dialogs**: Custom modal popups (inspired by modern UX patterns) handling empty inputs, unknown cities, and rate limits gracefully.
- **🛡️ 100% Secure Serverless Proxy**: Protects secret credentials on Vercel's Edge infrastructure — zero API keys exposed in browser DevTools.
- **📱 Fully Responsive**: Glassmorphic layout crafted for mobile, tablet, and widescreen desktop displays.

---

## 🏛️ System Architecture

```
   Client Browser
         │
         │  1. fetch('/api/weather?city=London')  [NO API KEY EXPOSED]
         ▼
┌──────────────────────────────────────────────┐
│       Vercel Serverless Function             │
│   (/api/weather.js - Node.js Edge Proxy)     │
│                                              │
│   • Injects process.env.VISUAL_CROSSING_KEY  │
│   • Sets Cache-Control: s-maxage=1800        │
└──────────────────────┬───────────────────────┘
                       │
                       │  2. Authenticated Backend Call
                       ▼
         Visual Crossing Weather API
```

---

## 📂 Project Structure

```text
weather-app/
├── api/
│   └── weather.js         # Serverless API proxy (hides API keys & enables Edge cache)
├── src/
│   ├── index.html         # Main dashboard markup & modal dialogs
│   ├── input.css          # Tailwind CSS v4 & DaisyUI source directives
│   ├── output.css         # Compiled production stylesheet
│   ├── script.js          # Core application logic, caching, and DOM bindings
│   └── paul-green-...jpg  # Optimized landscape background asset
├── index.html             # Root redirect to ensure smooth Vercel routing
├── vercel.json            # Vercel deployment & redirect configuration
├── package.json           # Dependencies and project metadata
├── .env.example           # Environment variable template
└── README.md              # Project documentation
```

---

## 🛠️ Tech Stack & Tools

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS v4, DaisyUI v5
- **APIs**: Visual Crossing Weather API (Timeline), Open-Meteo (Geocoding Autocomplete)
- **Backend & Hosting**: Node.js Serverless Functions, Vercel Edge Network
- **Version Control**: Git & GitHub

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amiyshukla1-tech/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Tailwind compiler in watch mode**:
   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```

4. **Run the app**:
   - Open `src/index.html` with VS Code Live Server, or run a local server:
   ```bash
   npx serve .
   ```

---

## 👤 Author

**Amiy Shukla**
- GitHub: [@amiyshukla1-tech](https://github.com/amiyshukla1-tech)
- Project Repository: [weather-app](https://github.com/amiyshukla1-tech/weather-app)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
