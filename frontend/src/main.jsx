import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n"; // Това гарантира, че i18next се инициализира преди App

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
