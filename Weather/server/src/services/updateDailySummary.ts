import prisma from "../utils/initializers/prisma";

/**
 * Updates the daily summary for a city and date.
 *
 * @param {string} city - The city to update the summary for.
 * @param {Date} date - The date to update the summary for.
 * @returns {Promise<void>} - Returns a promise that resolves when the summary is updated.
 */
const updateDailySummary = async (city: string, date: Date) => {
  try {
    const endofDay = new Date(date);
    endofDay.setHours(23, 59, 59, 999);
    const weatherData = await prisma.weatherData.findMany({
      where: {
        city,
        timestamp: {
          gte: date,
          lte: endofDay,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (weatherData.length === 0) {
      return;
    }

    const temperatures = weatherData.map((data) => data.temperature);
    const avgTemp =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const avgPressure =
      weatherData.reduce((a, b) => a + b.pressure, 0) / weatherData.length;
    const avgHumidity =
      weatherData.reduce((a, b) => a + b.humidity, 0) / weatherData.length;
    const avgVisibility =
      weatherData.reduce((a, b) => a + b.visibility, 0) / weatherData.length;

    const weatherConditions = weatherData.map((data) => data.condition);
    const dominantCondition = weatherConditions.reduce(
      (a, b, i, arr) =>
        arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
          ? a
          : b,
      weatherConditions[0]
    );

    await prisma.dailySummary.upsert({
      where: {
        city_date: {
          city,
          date,
        },
      },
      update: {
        avgTemp,
        maxTemp,
        minTemp,
        avgPressure,
        avgHumidity,
        avgVisibility,
        dominantCondition,
      },
      create: {
        city,
        date,
        avgTemp,
        maxTemp,
        minTemp,
        avgPressure,
        avgHumidity,
        avgVisibility,
        dominantCondition,
      },
    });
  } catch (error: any) {
    console.error("Error updating daily summary:", error.message);
  }
};

export default updateDailySummary;
