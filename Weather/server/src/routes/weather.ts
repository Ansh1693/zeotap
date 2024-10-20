import { Router } from "express";
import { getForecast, getWeather } from "../controller/weather";

const weather = Router();

weather.get("/", getWeather);
weather.get("/forecast", getForecast);

export default weather;
