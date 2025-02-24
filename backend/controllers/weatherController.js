import axios from "axios";
import dotenv from "dotenv";
import { setCache, getCache } from "../utils/cache.js";
dotenv.config();

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

    // Взимаме прогнозата за 5 дни (на всеки 3 часа)
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching forecast:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Server error fetching forecast" });
  }
};

export const fetchCityByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query; // Взимаме latitude и longitude от заявката
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Missing latitude or longitude" });
    }

    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );

    if (response.data.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(response.data[0]); // Връщаме информацията за града
  } catch (error) {
    console.error("Error fetching city from coordinates:", error);
    res.status(500).json({ message: "Server error fetching city" });
  }
};
