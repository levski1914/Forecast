const Forecast = ({ forecast, hourlyForecast, setShowHourly }) => {
  return (
    <div className="p-6 bg-white text-black rounded-xl shadow-lg w-auto">
      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-bold">Прогноза</h3>
        <div>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
            onClick={() => setShowHourly(false)}
          >
            5 дни
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
            onClick={() => setShowHourly(true)}
          >
            По часове
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between p-3 border-b border-gray-300"
          >
            <span className="w-1/4 text-center font-semibold">{day.day}</span>
            <span className="text-2xl">
              {day.weather.includes("rain") ? "🌧️" : "☀️"}
            </span>
            <span>
              🌡️ {day.temp_min}° / {day.temp_max}°
            </span>
            <span>💧 {day.rain_chance}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
