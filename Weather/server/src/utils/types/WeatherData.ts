interface WeatherData {
  id: string | null;
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  pressure: number;
  humidity: number;
  visibility: number;
  timestamp: number;
}

export default WeatherData;
