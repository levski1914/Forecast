import {
  fetchCityByCoords,
  fetchForecast,
  fetchWeeklyForecast,
  searchCity,
} from "../controllers/weatherController.js";
import express from "express";

const router = express.Router();

router.get("/geo", fetchCityByCoords);
router.get("/:city", fetchForecast);
router.get("/search/:city", searchCity);
router.get("/forecast/:city", fetchWeeklyForecast);

export default router;
