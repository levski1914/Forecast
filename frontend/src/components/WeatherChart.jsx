import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useTranslation } from "react-i18next";

const WeatherChart = ({ forecast, hourlyForecast, selectedDay }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [showHourly, setShowHourly] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (!chartRef.current || (!forecast?.length && !hourlyForecast?.length))
      return;

    if (chartInstance.current && !chartInstance.current.isDisposed()) {
      chartInstance.current.dispose(); // Изчистване на старата графика
    }

    chartInstance.current = echarts.init(chartRef.current);

    const activeDay =
      selectedDay || (forecast.length > 0 ? forecast[0].day : "");

    let chartData = [];

    if (!showHourly) {
      // 🔹 5-дневна прогноза
      chartData = forecast.map((day) => ({
        date: day?.day || "Unknown",
        temp_max: parseFloat(day?.temp_max) || 0,
        temp_min: parseFloat(day?.temp_min) || 0,
        weather: day?.weather || "Sunny",
      }));
    } else {
      // 🔹 Почасова прогноза
      chartData = hourlyForecast
        ?.filter((hour) => hour?.date === activeDay)
        .map((hour) => ({
          date: hour?.time || "Unknown",
          temp: parseFloat(hour?.temp) || 0,
          icon: hour?.icon || "",
        }));
    }

    // 🔹 Функция за получаване на иконка според времето
    const getWeatherIcon = (description) => {
      if (!description) return "☀️";
      const desc = description.toLowerCase();
      if (desc.includes("rain")) return "🌧️";
      if (desc.includes("cloud")) return "☁️";
      if (desc.includes("snow")) return "❄️";
      return "☀️";
    };

    const option = {
      backgroundColor: "rgba(255, 255, 255, 0)", // Без фон
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        textStyle: { color: "#fff" },
      },
      xAxis: {
        type: "category",
        data: chartData.map((d) => d.date),
        axisLabel: { color: "#fff", fontSize: 14 },
        axisLine: { lineStyle: { color: "#aaa" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#fff", fontSize: 14 },
        splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
      },
      series: showHourly
        ? [
            {
              name: "Температура",
              type: "line",
              data: chartData.map((d) => d.temp),
              smooth: true,
              symbol: "circle",
              symbolSize: 12,
              lineStyle: { color: "#ff7300", width: 4 },
              label: {
                show: true,
                position: "top",
                color: "#ff7300",
                fontSize: 14,
                fontWeight: "bold",
                formatter: (param) =>
                  `${getWeatherIcon(chartData[param.dataIndex].icon)} ${
                    param.value
                  }°C`,
              },
              areaStyle: { color: "rgba(255, 115, 0, 0.3)" },
            },
          ]
        : [
            {
              name: "Макс Темп",
              type: "line",
              data: chartData.map((d) => d.temp_max),
              smooth: true,
              lineStyle: { color: "#ff7300", width: 4 },
              label: {
                show: true,
                position: "top",
                color: "#ff7300",
                fontSize: 14,
                fontWeight: "bold",
                formatter: "{c}°C",
              },
              areaStyle: { color: "rgba(255, 115, 0, 0.3)" },
            },
            {
              name: "Мин Темп",
              type: "line",
              data: chartData.map((d) => d.temp_min),
              smooth: true,
              lineStyle: { color: "#007bff", width: 4 },
              label: {
                show: true,
                position: "bottom",
                color: "#007bff",
                fontSize: 14,
                fontWeight: "bold",
                formatter: "{c}°C",
              },
              areaStyle: { color: "rgba(0, 123, 255, 0.3)" },
            },
          ],
    };

    chartInstance.current.setOption(option);
  }, [forecast, hourlyForecast, showHourly, selectedDay]);

  return (
    <div className="p-6 backdrop-blur-lg rounded-2xl shadow-lg w-full  forecast transition-all duration-200 forecast">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">📊 Графика на прогнозата</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md font-semibold transition ${
              !showHourly ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
            }`}
            onClick={() => setShowHourly(false)}
          >
            {t("fiveDays")}
          </button>
          <button
            className={`px-3 py-1 rounded-md font-semibold transition ${
              showHourly ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
            }`}
            onClick={() => setShowHourly(true)}
          >
            {t("hourly")}
          </button>
        </div>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: "300px" }} />
    </div>
  );
};

export default WeatherChart;
