import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import SearchBox from "../components/SearchBox";
import WeatherBox from "../components/WeatherBox";
import Forecast from "../components/Forecast";
import FavouriteCities from "../components/FavouriteCities";
import WeatherChart from "../components/WeatherChart";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale"; //
import WeatherMap from "../components/WeatherMap";
import { useTranslation } from "react-i18next";
// import LanguageSelector from "../components/LanguageSelector";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="mt-4">
      <select
        onChange={handleLanguageChange}
        value={i18n.language}
        className="px-3 py-2 bg-gray-700 text-white rounded cursor-pointer"
      >
        <option value="bg">🇧🇬 </option>
        <option value="en">🇬🇧 </option>
        <option value="es">🇪🇸 </option>
      </select>
    </div>
  );
};
const Home = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const { t } = useTranslation();
  const [favoriteCities, setFavoriteCities] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });
  const [showHourly, setShowHourly] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkmode")) || false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Функция за превключване на тъмен/светъл режим
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await axios.get(
              `http://localhost:5000/api/weather/geo?lat=${latitude}&lon=${longitude}`
            );

            const detectedCity = res.data.name || "Unknown City";

            if (detectedCity !== "Unknown City") {
              fetchWeather({ name: detectedCity });
            }
          } catch (error) {
            console.log("❌ Error fetching location:", error);
          }
        },
        (error) => {
          console.error("❌ Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
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

      // Сортираме по популярност (ако има такава метрика)
      const sortedCities = res.data.sort((a, b) =>
        a.population > b.population ? -1 : 1
      );

      setSuggestions(sortedCities);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };
  // Зареждане на прогноза за избран град
  const fetchWeather = async (city) => {
    if (!city || !city.name || city.name === "Unknown Location") {
      console.error("❌ Invalid city:", city);
      return;
    }

    setSuggestions([]);
    try {
      const weatherRes = await axios.get(
        `http://localhost:5000/api/weather/${city.name}`
      );
      const forecastRes = await axios.get(
        `http://localhost:5000/api/weather/forecast/${city.name}`
      );

      if (!forecastRes.data || !forecastRes.data.length) {
        console.error(
          "🚨 Forecast data is missing or incorrect:",
          forecastRes.data
        );
        return;
      }

      setWeather(weatherRes.data);
      setForecast(processForecastData(forecastRes.data));
      setHourlyForecast(processHourlyForecast(forecastRes.data));
    } catch (err) {
      console.error("❌ Error fetching weather:", err);
    }
  };
  const processForecastData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    const daily = {};
    data.forEach((item) => {
      const dateStr =
        item.date && !isNaN(Date.parse(item.date))
          ? item.date
          : new Date(item.date * 1000).toISOString().split("T")[0];
      const date = item.date;
      if (!daily[date]) {
        daily[date] = {
          day: format(parseISO(dateStr), "dd EEE", { locale: enUS }),
          temp_min: item.temp,
          temp_max: item.temp,
          rain_chance: item.rain_chance,
          weather: item.weather,
        };
      } else {
        daily[date].temp_min = Math.min(daily[date].temp_min, item.temp);
        daily[date].temp_max = Math.max(daily[date].temp_max, item.temp);
      }
    });

    return Object.values(daily);
  };

  const processHourlyForecast = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => {
      const dateStr =
        item.date && !isNaN(Date.parse(item.date))
          ? item.date
          : new Date(item.date * 1000).toISOString().split("T")[0];

      return {
        date: format(parseISO(dateStr), "dd EEE", { locale: enUS }), // ✅ Форматираме датата така, че да съвпада
        time: item.time,
        temp: item.temp,
        rain_chance: item.rain_chance,
        weather: item.weather,
        icon: item.icon,
      };
    });
  };

  const addFavorite = (city) => {
    if (!favoriteCities.find((fav) => fav.name === city.name)) {
      const updatedFavorite = [...favoriteCities, city];

      setFavoriteCities(updatedFavorite);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
    }
  };

  const debouncedSearch = useCallback(debounce(fetchCities, 500), []);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  const getBackgroundClass = () => {
    if (darkMode) {
      return "bg-gray-900 text-[#FF7300]";
    }
    return "bg-blue-500 text-white";
  };
  return (
    <div
      className={`flex p-10 gap-4 flex-col items-start @container min-h-screen bg-["#3D6CAA"] transition-all duration-500 ${getBackgroundClass()}`}
    >
      <div className="flex justify-between w-full items-center mb-4 gap-2">
        <h1 className="text-4xl font-bold">SkyCast</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀" : "🌙 "}
          </button>
          <LanguageSelector />
        </div>
      </div>

      <div className="flex flex-row shrink flex-wrap items-start justify-center">
        <SearchBox
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          fetchWeather={fetchWeather}
        />
      </div>
      <div className="flex flex-row shrink flex-wrap justify-center gap-6">
        {weather && <WeatherBox weather={weather} addFavorite={addFavorite} />}
        <div className=" w-140 ">
          <WeatherMap darkMode={darkMode} weather={weather} />
        </div>
        <div className="mt-0">
          <FavouriteCities
            favoriteCities={favoriteCities}
            setFavoriteCities={setFavoriteCities}
            fetchWeather={fetchWeather}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-start gap-6">
        {/* Прогнозата за 5 дни */}
        {forecast.length > 0 && (
          <Forecast
            forecast={forecast}
            showHourly={showHourly}
            setShowHourly={setShowHourly}
            setSelectedDay={setSelectedDay}
          />
        )}

        {/* 📊 Графиката - фиксираме я в дясната част */}
        {forecast.length > 0 && (
          <div className="ml-auto h-full w-full">
            <WeatherChart
              darkMode={darkMode}
              forecast={forecast}
              selectedDay={selectedDay}
              hourlyForecast={hourlyForecast}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
