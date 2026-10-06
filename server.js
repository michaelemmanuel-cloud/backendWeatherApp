require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors")
// const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(cors)
// app.use(express.static(frontendPath));
app.use(express.json());

if (!process.env.OPEN_WEATHER_API_KEY) {
    console.warn(`[WARNING] OPEN_WEATHER_API_KEY is not defined in .env! Backend will return error for /api/weather, but frontend will use built-in mock telemetry fallbacks.`);
}

app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ message: "Please provide a city name" });
    }

    const apiKey = process.env.OPEN_WEATHER_API_KEY;

    if (!apiKey) {
        return res.status(400).json({ message: "API_KEY not configured on server" });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const weatherRes = await fetch(url);
        const data = await weatherRes.json();
        console.log("Weather API response:", data);

        if (weatherRes.status === 404 || weatherRes.status === 400) {
            return res.status(weatherRes.status).json({ message: data.message || "City not found" });
        }
        if (weatherRes.status >= 500) {
            return res.status(500).json({ message: "Weather service server error" });
        }

        return res.json(data);

        res.json({
            city: date_name,
            country:data.sys.country,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind:data.wind.speed,
            description:data.weather[0].description,
            icon:data.weather[0].icon,
            id:data.id,
            visibility:data.visibility,

        })
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
