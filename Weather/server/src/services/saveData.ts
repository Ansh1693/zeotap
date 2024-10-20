import prisma from "../utils/initializers/prisma";
import WeatherData from "../utils/types/WeatherData";
import updateDailySummary from "./updateDailySummary";

/**
 * Saves weather data to the database.
 *
 * @param {Omit<WeatherData, "id" | "timestamp">} data - The weather data to save.
 * @returns {Promise<void>} - Returns a promise that resolves when the data is saved.
 */
const saveWeatherDataToDB = async (
  data: Omit<WeatherData, "id" | "timestamp">
) => {
  try {
    const timestamp = new Date();
    const startofDay = new Date(timestamp);
    startofDay.setHours(0, 0, 0, 0);
    await prisma.weatherData.create({
      data: {
        ...data,
        timestamp,
        condition: data.condition.toLowerCase().split(" ").join("-"),
      },
    });

    await updateDailySummary(data.city, startofDay);
  } catch (error: any) {
    console.error("Error saving weather data:", error.message);
  }
};

export default saveWeatherDataToDB;
