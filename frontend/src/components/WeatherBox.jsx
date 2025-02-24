import { WiHumidity, WiStrongWind } from "react-icons/wi";

const WeatherBox = ({ weather, addFavorite }) => {
  const getWeatherIcon = (description) => {
    if (!description) return "☀️";
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("snow")) return "❄️";
    return "☀️";
  };

  return (
    <div className="p-6 bg-white text-black rounded-xl shadow-lg w-96 flex flex-col items-center">
      <span className="text-5xl">
        {getWeatherIcon(weather.weather[0].description)}
      </span>
      <h2 className="text-2xl font-semibold mt-2">{weather.name}</h2>
      <p className="text-4xl font-bold">{weather.main.temp}°C</p>
      <p className="text-lg font-semibold capitalize">
        {weather.weather[0].description}
      </p>
      <p className="flex items-center mt-2">
        <WiHumidity size={24} className="mr-2" /> {weather.main.humidity}%
        Humidity
      </p>
      <p className="flex items-center">
        <WiStrongWind size={24} className="mr-2" /> {weather.wind.speed} m/s
        Wind
      </p>

      {/* 🔹 Бутон за запазване в любими */}
      <button
        onClick={() => addFavorite(weather)}
        className="mt-3 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
      >
        ⭐ Добави в любими
      </button>
    </div>
  );
};

export default WeatherBox;
