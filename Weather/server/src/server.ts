import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import alerts from "./routes/alert";
import weather from "./routes/weather";
import cron from "node-cron";
import fetchWeatherData from "./services/fetchData";
import checkAlert from "./services/checkAlert";

const UPDATE_INTERVAL = "*/10 * * * *";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

cron.schedule(UPDATE_INTERVAL, async () => {
  try {
    await fetchWeatherData();
    await checkAlert();
    console.log("Weather data updated");
  } catch (error: any) {
    console.error("Error updating weather data:", error.message);
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/alerts", alerts);
app.use("/api/weather", weather);

fetchWeatherData();
checkAlert();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
