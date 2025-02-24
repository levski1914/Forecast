import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import SearchBox from "../components/SearchBox";
import WeatherBox from "../components/WeatherBox";
import Forecast from "../components/Forecast";
import FavouriteCities from "../components/FavouriteCities";

const Home = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [showHourly, setShowHourly] = useState(false);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `http://localhost:5000/api/weather/geo?lat=${latitude}&lon=${longitude}`
          );
          fetchWeather(res.data);
        } catch (error) {
          console.log("error fetching location : ", error);
        }
      });
    }
  }, []);
  // Търсене на градове
  const fetchCities = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/search/${input}`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // Зареждане на прогноза за избран град
  const fetchWeather = async (city) => {
    setSuggestions([]);
    try {
      const weatherRes = await axios.get(
        `http://localhost:5000/api/weather/${city.name}`
      );
      const forecastRes = await axios.get(
        `http://localhost:5000/api/weather/forecast/${city.name}`
      );
      setWeather(weatherRes.data);
      setForecast(processForecastData(forecastRes.data));
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  const addFavorite = (city) => {
    if (!favoriteCities.find((fav) => fav.name === city.name)) {
      setFavoriteCities([...favoriteCities, city]);
    }
  };
  const debouncedSearch = useCallback(debounce(fetchCities, 500), []);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  const processForecastData = (forecast) => {
    if (!forecast.list) return [];

    const dailyData = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!dailyData[date]) {
        dailyData[date] = {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          rain_chance: (item.pop * 100).toFixed(0),
          weather: item.weather[0].main,
        };
      } else {
        dailyData[date].temp_min = Math.min(
          dailyData[date].temp_min,
          item.main.temp_min
        );
        dailyData[date].temp_max = Math.max(
          dailyData[date].temp_max,
          item.main.temp_max
        );
        dailyData[date].rain_chance = Math.max(
          dailyData[date].rain_chance,
          (item.pop * 100).toFixed(0)
        );
      }
    });

    return Object.entries(dailyData).map(([day, data]) => ({
      day,
      temp_min: data.temp_min.toFixed(1),
      temp_max: data.temp_max.toFixed(1),
      rain_chance: data.rain_chance,
      weather: data.weather,
    }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 text-white">
      <h1 className="text-5xl font-bold mb-6">🌤️ Weather Forecast</h1>

      <SearchBox
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
        fetchWeather={fetchWeather}
      />

      <div className="flex flex-row items-start justify-center gap-6">
        {weather && <WeatherBox weather={weather} addFavorite={addFavorite} />}
        {forecast.length > 0 && (
          <Forecast
            forecast={forecast}
            showHourly={showHourly}
            setShowHourly={setShowHourly}
          />
        )}
      </div>

      <div className="mt-6">
        <FavouriteCities
          favoriteCities={favoriteCities}
          fetchWeather={fetchWeather}
        />
      </div>
    </div>
  );
};

export default Home;
