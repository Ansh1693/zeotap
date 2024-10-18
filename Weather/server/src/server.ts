import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/initializers/prisma";
import saveWeatherDataToDB from "./functions/saveData";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
//provided api key here to test the code without creating one
const API_KEY = process.env.OPENWEATHER_API_KEY || "";

app.use(cors());
app.use(express.json());

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];
const weatherData: any = {};
const dailySummaries: any = {};
const alerts: any = {};

// Thresholds
const TEMPERATURE_THRESHOLD = 35;
const consecutiveTimes = 3; // Number of consecutive days to check for heatwave

// Function to check for temperature thresholds and trigger alerts

// Function to fetch weather data from OpenWeatherMap API
// Modify fetchWeatherData to trigger alerts when temperature exceeds 35°C

// Function to resolve unresolved alerts based on current temperature data
const resolveUnresolvedAlerts = async () => {
  for (const city of cities) {
    const existingAlert = await prisma.alert.findFirst({
      where: {
        city,
        resolved: false, // Only check active alerts
      },
    });

    if (existingAlert) {
      const currentWeather = weatherData[city];
      if (
        currentWeather &&
        currentWeather.temperature < TEMPERATURE_THRESHOLD
      ) {
        // Mark the existing alert as resolved
        await prisma.alert.update({
          where: { id: existingAlert.id },
          data: { resolved: true },
        });
        console.log(
          `Alert resolved for ${city} as temperature dropped below threshold.`
        );
      }
    }
  }
};

// Function to update daily weather summaries
const updateDailySummary = (
  city: string,
  temperature: number,
  condition: string,
  pressure: number,
  humidity: number,
  visibility: number
) => {
  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

  if (!dailySummaries[today]) {
    dailySummaries[today] = {};
  }

  if (!dailySummaries[today][city]) {
    dailySummaries[today][city] = {
      city,
      totalTemp: 0,
      maxTemp: temperature,
      minTemp: temperature,
      totalPressure: 0,
      totalHumidity: 0,
      totalVisibility: 0,
      count: 0,
      conditions: {},
    };
  }

  const citySummary = dailySummaries[today][city];

  citySummary.totalTemp += temperature;
  citySummary.count += 1;
  citySummary.maxTemp = Math.max(citySummary.maxTemp, temperature);
  citySummary.minTemp = Math.min(citySummary.minTemp, temperature);
  citySummary.totalPressure += pressure;
  citySummary.totalHumidity += humidity;
  citySummary.totalVisibility += visibility;

  // Count occurrences of each condition
  if (!citySummary.conditions[condition]) {
    citySummary.conditions[condition] = 0;
  }
  citySummary.conditions[condition] += 1;

  return citySummary; // Return the updated summary for saving
};

// Function to save daily summary to the database
const saveDailySummaryToDB = async (city: string, summary: any) => {
  const dominantCondition = Object.keys(summary.conditions).reduce((a, b) =>
    summary.conditions[a] > summary.conditions[b] ? a : b
  );

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  await prisma.dailySummary.upsert({
    where: {
      city_date: {
        city: summary.city,
        date: new Date(today), // Store by date only
      },
    },
    update: {
      avgTemp: summary.totalTemp / summary.count,
      maxTemp: summary.maxTemp,
      minTemp: summary.minTemp,
      dominantCondition,
    },
    create: {
      date: new Date(today),
      city: summary.city,
      avgTemp: summary.totalTemp / summary.count,
      maxTemp: summary.maxTemp,
      minTemp: summary.minTemp,
      dominantCondition,
    },
  });
};

// API Route to get the latest weather data for all cities
app.get("/api/weather/latest", (req: Request, res: Response) => {
  const latestWeatherData = cities.map((city) => ({
    city,
    data: weatherData[city] || { message: "No data available" },
  }));
  res.json(latestWeatherData);
});

// API route to get alerts (e.g., temperature > 35°C)
app.get("/api/weather/alerts", async (req: Request, res: Response) => {
  try {
    const activeAlerts = await prisma.alert.findMany({
      where: {
        resolved: false, // Only fetch unresolved alerts
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    res.json(activeAlerts);
  } catch (error: any) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Route to get historical weather data for charts
app.get("/api/weather/historical", async (req: Request, res: Response) => {
  try {
    const historicalData = await prisma.weatherData.findMany({
      orderBy: {
        timestamp: "asc",
      },
    });
    res.json(historicalData);
  } catch (error: any) {
    console.error("Error fetching historical weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Route to get daily summaries
app.get("/api/weather/daily-summaries", async (req: Request, res: Response) => {
  try {
    const summaries = await prisma.dailySummary.findMany({
      orderBy: {
        date: "asc",
      },
    });
    const uniqueSummaries = Object.values(
      summaries.reduce((acc: any, summary) => {
        const key = `${summary.city}-${summary.date}`;
        if (!acc[key]) {
          acc[key] = summary;
        }
        return acc;
      }, {})
    );
    res.json(uniqueSummaries);
  } catch (error: any) {
    console.error("Error fetching daily summaries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Automatically fetch weather data every 30 minutes
setInterval(fetchWeatherData, 30 * 60 * 1000); // 30 minutes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initial fetch of weather data
fetchWeatherData();
