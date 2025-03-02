import { useState } from "react";

const WeatherBox = ({ weather, addFavorite }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  // Ако weather не е зареден, показваме "Зареждане..."
  if (!weather || !weather.main || !weather.weather || !weather.wind) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-500 gap-y-1 to-blue-700 text-white rounded-xl shadow-xl w-80 flex flex-col items-center">
        <h2 className="text-2xl font-bold">🔄 Зареждане...</h2>
      </div>
    );
  }

  const temp = isCelsius ? weather.main.temp : (weather.main.temp * 9) / 5 + 32;
  const weatherCondition = weather.weather[0]?.main.toLowerCase();

  const getWeatherIcon = (description) => {
    if (!description) return "☀️";
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("snow")) return "❄️";
    return "☀️";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-500 gap-y-1 to-blue-700 text-white rounded-xl shadow-xl w-80 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-2">{weather.name}</h2>
      <span className="text-center font-semibold">{weather.day}</span>
      <span className="text-6xl flex justify-between">
        {getWeatherIcon(weather.weather[0].description)}
        <p className="text-5xl font-bold">
          {temp.toFixed(1)}°{isCelsius ? "C" : "F"}
          <span className="text-sm block font-semibold capitalize">
            {weather.weather[0].description}
          </span>
        </p>
      </span>
      <span className="flex items-center gap-2">
        <p className="flex text-lg">💧 {weather.main.humidity}%</p>
        <p className="flex text-lg">🌬 {weather.wind.speed} m/s</p>
      </span>

      <button
        onClick={() => setIsCelsius(!isCelsius)}
        className="mt-2 px-4 py-1 cursor-pointer bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
      >
        {isCelsius ? "Промени на °F" : "Промени на °C"}
      </button>

      <button
        onClick={() => addFavorite(weather)}
        className="mt-3 ml-4 cursor-pointer px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
      >
        ⭐ Добави в любими
      </button>
    </div>
  );
};

export default WeatherBox;
