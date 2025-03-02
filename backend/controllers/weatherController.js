import axios from "axios";
import dotenv from "dotenv";
import { setCache, getCache } from "../utils/cache.js";
dotenv.config();

export const fetchCityByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      console.log("❌ Missing API key");
      return res.status(500).json({ message: "Missing API key" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );

    if (response.data.length === 0) {
      console.log("❌ No city found");
      return res.status(404).json({ message: "City not found" });
    }

    const cityData = response.data[0];
    const cityName =
      cityData.local_names?.en ||
      cityData.name ||
      cityData.state ||
      "Unknown Location";

    res.json({ name: cityName });
  } catch (error) {
    console.error("❌ Error fetching city from coordinates:", error);
    res.status(500).json({ message: "Server error fetching city" });
  }
};

export const fetchForecast = async (req, res) => {
  try {
    const { city } = req.params;

    const cachedData = getCache(city);

    if (cachedData) {
      return res.json(cachedData);
    }
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    setCache(city, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
};

export const searchCity = async (req, res) => {
  try {
    const city = req.params.city;
    const apiKEY = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching city data:", error);
    res.status(500).json({ message: "Server error fetching city data" });
  }
};

export const fetchWeeklyForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ message: "Missing API key" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.data || !response.data.list) {
      console.log("❌ No forecast data received");
      return res.status(500).json({ message: "No forecast data available" });
    }

    const hourlyData = response.data.list
      .filter(
        (entry) => entry.main && entry.weather && entry.weather.length > 0
      ) // Филтрира лоши записи
      .map((entry) => ({
        date: new Date(entry.dt * 1000).toISOString().split("T")[0], // YYYY-MM-DD
        time: new Date(entry.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: entry.main.temp.toFixed(1),
        rain_chance: (entry.pop * 100).toFixed(0),
        weather: entry.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`,
      }));

    res.json(hourlyData);
  } catch (error) {
    console.error(
      "❌ Error fetching forecast:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Server error fetching forecast" });
  }
};
