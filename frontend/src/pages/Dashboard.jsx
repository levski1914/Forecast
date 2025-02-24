import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  WiThermometer,
  WiStrongWind,
  WiRaindrop,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      const res = await axios.get("http://localhost:5000/api/auth/favourites", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setCities(res.data.favourites);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await Promise.all(
        cities.map(async (city) => {
          const res = await axios.get(
            `http://localhost:5000/api/weather/${city}`
          );
          return { city, ...res.data };
        })
      );
      setWeatherData(data);
    };

    if (cities.length > 0) fetchWeather();
  }, [cities]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl mb-4">Welcome, {user?.username}!</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <h3 className="text-2xl mt-6">Your Favorite Cities:</h3>
      {weatherData.map((cityWeather) => (
        <div
          key={cityWeather.city}
          className="bg-gray-800 p-4 rounded-lg shadow-md mt-4"
        >
          <h4 className="text-lg font-bold">{cityWeather.city}</h4>
          <p className="flex items-center">
            <WiThermometer size={24} /> {cityWeather.main.temp}°C
          </p>
          <p className="flex items-center">
            <WiStrongWind size={24} /> Wind: {cityWeather.wind.speed} m/s
          </p>
          <p className="flex items-center">
            <WiRaindrop size={24} /> Humidity: {cityWeather.main.humidity}%
          </p>
          <p className="flex items-center">
            <WiSunrise size={24} /> Sunrise:{" "}
            {new Date(cityWeather.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p className="flex items-center">
            <WiSunset size={24} /> Sunset:{" "}
            {new Date(cityWeather.sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
