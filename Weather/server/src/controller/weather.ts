import { getWeatherDetails, getForecastDetails } from "../services/weather";

/**
 * Gets the weather data for a specific city and date.
 *
 * @param req - The request object.
 * @param res - The response object.
 */
export const getWeather = async (req: any, res: any) => {
  try {
    const { city, date } = req.query;
    const weatherDetails = await getWeatherDetails({ city, date });
    return res.json(weatherDetails);
  } catch (e) {
    return res.status(500).json({ error: "Error getting weather data" });
  }
};

export const getForecast = async (req: any, res: any): Promise<any> => {
  try {
    const { city, times } = req.query;
    const forecast = await getForecastDetails({ city, times });
    return res.json(forecast);
  } catch (e) {
    return res.status(500).json({ error: "Error getting forecast data" });
  }
};
