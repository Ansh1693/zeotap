import axios from "axios";
import prisma from "../utils/initializers/prisma";
import cities from "../utils/initializers/cities";
import saveWeatherDataToDB from "./saveData";

/**
 * Converts a temperature from Kelvin to Celsius.
 *
 * @param kelvin - The temperature in Kelvin.
 * @returns The temperature converted to Celsius.
 */
const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

const fetchWeatherData = async () => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY || "";
    for (const city of cities) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      console.log(response.data);
      const { main, visibility, weather, dt } = response.data;

      const temperature = kelvinToCelsius(main.temp);
      const feelsLike = kelvinToCelsius(main.feels_like);
      const condition = weather[0].main;
      const pressure = main.pressure;
      const humidity = main.humidity;

      await saveWeatherDataToDB(
        city,
        temperature,
        feelsLike,
        condition,
        dt,
        pressure,
        humidity,
        visibility
      );

      //   await checkAlertThresholds(city, temperature, condition, dt); // Call the checkAlertThresholds function

      // Update daily summaries
      const summary = updateDailySummary(
        city,
        temperature,
        condition,
        pressure,
        humidity,
        visibility
      );
      await saveDailySummaryToDB(city, summary); // Save summary to the database
    }

    // Check for existing unresolved alerts after fetching weather data
    await resolveUnresolvedAlerts();
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
  }
};
