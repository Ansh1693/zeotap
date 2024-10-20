import axios from "axios";
import cities from "../utils/data/cities";
import saveWeatherDataToDB from "./saveData";

/**
 * Converts a temperature from Kelvin to Celsius.
 *
 * @param {number} kelvin - The temperature in Kelvin.
 * @returns {number} - The temperature converted to Celsius.
 */
const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;

/**
 * Fetches weather data for the cities in the `cities` array
 * and saves the data to the database.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the data fetching and saving is complete.
 */
const fetchWeatherData = async (): Promise<void> => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY || "";
    for (const city of cities) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      const { main, visibility, weather } = response.data;

      const temperature = kelvinToCelsius(main.temp);
      const feelsLike = kelvinToCelsius(main.feels_like);
      const condition = weather[0].main;
      const pressure = main.pressure;
      const humidity = main.humidity;

      await saveWeatherDataToDB({
        city,
        temperature: parseFloat(temperature.toFixed(2)),
        feelsLike: parseFloat(feelsLike.toFixed(2)),
        condition,
        pressure,
        humidity,
        visibility,
      });
    }
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
  }
};

export default fetchWeatherData;
