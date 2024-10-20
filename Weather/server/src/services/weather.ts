import prisma from "../utils/initializers/prisma";
import axios from "axios";
import { citiesLatLon } from "../utils/data/cities";

interface WeatherFilter {
  city: string;
  date?: string;
}

/**
 * Gets weather details for a city and date.
 *
 * @param {WeatherFilter} filter - The filter to apply.
 * @returns {Promise<{ weatherDetails: any; citySummary: any; }>} - Returns the weather details and city summary.
 */

export const getWeatherDetails = async (filter: WeatherFilter) => {
  try {
    const { city, date } = filter;

    const weatherDetails = await prisma.weatherData.findMany({
      where: {
        city: city,
        ...(date && { date: new Date(date) }),
      },
    });

    const citySummary = await prisma.dailySummary.findMany({
      where: {
        city,
      },
    });

    return {
      weatherDetails,
      citySummary,
    };
  } catch (e: any) {
    console.error(e.message);
  }
};

export const getForecastDetails = async ({
  city,
  times,
}: {
  city: string;
  times: number;
}) => {
  try {
    const { lat, lon } = citiesLatLon[city];

    const response: any = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    return response.data.list.slice(0, times);
  } catch (e: any) {
    console.error(e.message);
  }
};
