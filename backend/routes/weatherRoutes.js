const {
  fetchCityByCoords,
  fetchForecast,
  fetchWeeklyForecast,
  searchCity,
} = require("../controllers/weatherController.js");
const express = require("express");

const router = express.Router();

router.get("/geo", fetchCityByCoords);
router.get("/:city", fetchForecast);
router.get("/search/:city", searchCity);
router.get("/forecast/:city", fetchWeeklyForecast);

export default router;
