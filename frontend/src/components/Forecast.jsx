import { WiDaySunny, WiRain, WiCloudy, WiSnow } from "react-icons/wi";
import { useTranslation } from "react-i18next";
const Forecast = ({
  forecast = [],
  hourlyForecast = [],
  setShowHourly,
  showHourly,
  setSelectedDay,
}) => {
  const { t } = useTranslation();
  const getWeatherIcon = (description) => {
    if (!description) return <WiDaySunny size={36} />;
    const desc = description.toLowerCase();
    if (desc.includes("rain"))
      return <WiRain size={36} className="text-blue-500" />;
    if (desc.includes("cloud"))
      return <WiCloudy size={36} className="text-gray-500" />;
    if (desc.includes("snow"))
      return <WiSnow size={36} className="text-white" />;
    return <WiDaySunny size={36} className="text-yellow-500" />;
  };

  return (
    <div className="p-6 forecast   rounded-xl shadow-lg w-80">
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

      <div className="flex flex-col gap-1">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex  items-center text-blue-400 justify-between p-3 border rounded-lg shadow-md w-70 bg-gray-100"
            onClick={() => {
              setSelectedDay(day.day); // 🟢 При клик, избира деня
              setShowHourly(true); // 🟢 Автоматично превключва на почасова прогноза
            }}
          >
            <span className="text-sm gap-1 flex align-middle items-center text-gray-700">
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
