// Serverless API Proxy for Visual Crossing Weather API
// Keeps the secret API Key hidden securely on the server (Vercel)

module.exports = async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { city } = req.query;

    if (!city || typeof city !== 'string' || !city.trim()) {
        return res.status(400).json({ error: 'City query parameter is required.' });
    }

    // Secret API Key loaded from Vercel Environment Variables
    const API_KEY = process.env.VISUAL_CROSSING_KEY || '6NYKACSJPRC8NCA5BKRVU2B2T';
    const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

    const url = `${BASE_URL}/${encodeURIComponent(city.trim())}/yesterday/tomorrow?unitGroup=metric&include=hours,current,days&key=${API_KEY}&contentType=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Cache response on Vercel Edge CDN for 30 minutes to supercharge performance and save API quota
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Serverless Weather Proxy Error:', error);
        return res.status(500).json({ error: 'Internal server error while fetching weather data.' });
    }
};
