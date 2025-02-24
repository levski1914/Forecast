import {
  fetchCityByCoords,
  fetchForecast,
  fetchWeeklyForecast,
  searchCity,
} from "../controllers/weatherController.js";
import express from "express";

const router = express.Router();

router.get("/:city", fetchForecast);
router.get("/search/:city", searchCity);
router.get("/forecast/:city", fetchWeeklyForecast);

router.get("/geo", fetchCityByCoords);
export default router;
