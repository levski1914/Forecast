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
