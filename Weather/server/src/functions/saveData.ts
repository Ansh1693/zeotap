import prisma from "../utils/initializers/prisma";
/**
 * Saves weather data to the database.
 *
 * @param {string} city - The name of the city.
 * @param {number} temperature - The temperature in the city.
 * @param {number} feelsLike - The "feels like" temperature in the city.
 * @param {string} condition - The weather condition (e.g., sunny, rainy).
 * @param {number} timestamp - The Unix timestamp of the weather data.
 * @param {number} humidity - The humidity level in the city.
 * @param {number} pressure - The atmospheric pressure in the city.
 * @param {number} visibility - The visibility level in the city.
 * @returns {Promise<void>} A promise that resolves when the data is saved.
 *
 * @throws Will throw an error if saving the data fails.
 */
const saveWeatherDataToDB = async (
  city: string,
  temperature: number,
  feelsLike: number,
  condition: string,
  timestamp: number,
  humidity: number,
  pressure: number,
  visibility: number
) => {
  try {
    await prisma.weatherData.create({
      data: {
        city,
        temperature,
        feelsLike,
        condition,
        humidity,
        pressure,
        visibility,
        timestamp: new Date(timestamp * 1000), // Convert Unix timestamp to Date
      },
    });
  } catch (error: any) {
    console.error("Error saving weather data:", error.message);
  }
};

export default saveWeatherDataToDB;
