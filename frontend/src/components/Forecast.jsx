import { WiDaySunny, WiRain, WiCloudy, WiSnow } from "react-icons/wi";
import { useTranslation } from "react-i18next";
import { CloudSun, CloudRain, CloudSnow, Sun } from "phosphor-react";
const Forecast = ({
  forecast = [],
  hourlyForecast = [],
  setShowHourly,
  showHourly,
  setSelectedDay,
}) => {
  const { t } = useTranslation();
  const getWeatherIcon = (description) => {
    if (!description) return <Sun size={36} color="#FFD700" />;
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return <CloudRain size={36} color="#1E90FF" />;
    if (desc.includes("cloud")) return <CloudSun size={36} color="#808080" />;
    if (desc.includes("snow")) return <CloudSnow size={36} color="#B0E0E6" />;
    return <Sun size={36} color="#FFD700" />;
  };

  return (
    <div className="p-3 forecast h-full   rounded-xl shadow-lg w-full">
      <div className="flex justify-between mb-3">
        <h3 className="text-xl font-bold">{t("forecast")}</h3>
        <div>
          <button
            className={`px-3 py-1 rounded-md mr-2 ${
              !showHourly ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
            }`}
            onClick={() => setShowHourly(false)}
          >
            5 дни
          </button>
        </div>
      </div>

      {/* Прогноза за 5 дни */}

      <div className="flex w-full   gap-1">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-blue-400 justify-between p-3 border rounded-lg shadow-md w-full bg-gray-100"
            onClick={() => {
              setSelectedDay(day.day); // 🟢 При клик, избира деня
              setShowHourly(true); // 🟢 Автоматично превключва на почасова прогноза
            }}
          >
            <span className="text-sm gap-1 flex flex-col align-middle items-center text-gray-700">
              {getWeatherIcon(day.weather)}
              🌡️ {day.temp_min}° / {day.temp_max}°
            </span>
            <span className="text-center font-semibold">{day.day}</span>
            <span className="text-sm text-blue-500">💧 {day.rain_chance}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
