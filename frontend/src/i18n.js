import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 🎯 Добави преводи
const resources = {
  en: {
    translation: {
      weatherApp: "Weather App",
      changeTheme: "Change Theme",
      forecast: "Forecast",
      addFavorite: "Add to Favorites",
      removeFavorite: "Remove",
      fiveDays: "5 Days",
      hourly: "Hourly",
    },
  },
  bg: {
    translation: {
      weatherApp: "Времето",
      changeTheme: "Смени тема",
      forecast: "Прогноза",
      addFavorite: "Добави в любими",
      removeFavorite: "Премахни",
      fiveDays: "5 дни",
      hourly: "Почасово",
    },
  },
  es: {
    translation: {
      weatherApp: "Tiempo",
      changeTheme: "Cambiar tema",
      forecast: "Pronóstico",
      addFavorite: "Agregar a favoritos",
      removeFavorite: "Eliminar",
      fiveDays: "5 días",
      hourly: "Por hora",
    },
  },
};

// 🟢 Инициализация на i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["navigator", "localStorage", "cookie"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
