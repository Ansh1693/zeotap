"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ForecastDay from "@/components/ForecastDay";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getWeather, getForecast } from "@/api/weather";
import cities from "@/lib/data/cities";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type WeatherData = {
  id: string;
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  pressure: number;
  humidity: number;
  visibility: number;
  timestamp: string;
};

type DailySummary = {
  id: string;
  date: string;
  city: string;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  avgPressure: number;
  avgHumidity: number;
  avgVisibility: number;
  dominantCondition: string;
};

export default function Home() {
  const [city, setCity] = useState("Delhi");
  const [dataType, setDataType] = useState("temperature");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<any[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const weatherData = await getWeather(city);
      const forecastData = await getForecast(city, 7);
      setWeatherData(weatherData.weatherDetails);
      setDailySummaries(weatherData.citySummary);
      setCurrentWeather(weatherData.weatherDetails[0]);
      setForecast(forecastData);
    };
    if (city) {
      fetchData();
    }
  }, [city]);

  const chartData = {
    labels: weatherData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        data: weatherData.map(
          (d) => d[dataType as keyof WeatherData] as number
        ),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = weatherData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setCity(value)} defaultValue={city}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setDataType(value)}
          defaultValue={dataType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="pressure">Pressure</SelectItem>
            <SelectItem value="humidity">Humidity</SelectItem>
            <SelectItem value="visibility">Visibility</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {currentWeather && (
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Weather in {city}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold">
                  {currentWeather.temperature.toFixed(2)}°C
                </p>
                <p className="text-xl">
                  Feels like: {currentWeather.feelsLike.toFixed(2)}°C
                </p>
                <p className="text-lg">{currentWeather.condition}</p>
              </div>
              <div>
                <p>Humidity: {currentWeather.humidity}%</p>
                <p>Pressure: {currentWeather.pressure} hPa</p>
                <p>Visibility: {currentWeather.visibility} m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {forecast.length > 0 &&
              forecast.map((day, index) => (
                <ForecastDay key={index} data={day} />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Data Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Weather Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Feels Like</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Pressure</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    {new Date(data.timestamp).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{data.temperature.toFixed(2)}°C</TableCell>
                  <TableCell>{data.feelsLike.toFixed(2)}°C</TableCell>
                  <TableCell>{data.condition}</TableCell>
                  <TableCell>{data.pressure} hPa</TableCell>
                  <TableCell>{data.humidity}%</TableCell>
                  <TableCell>{data.visibility} m</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(weatherData.length / itemsPerPage) },
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className="mx-1"
                >
                  {i + 1}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Weather Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailySummaries.map((summary) => (
              <Card
                key={summary.id}
                className="bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-800">
                    {new Date(summary.date).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-700">
                      Average Temp:{" "}
                      <span className="font-bold">
                        {summary.avgTemp.toFixed(2)}°C
                      </span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Max Temp:{" "}
                      <span className="font-bold">{summary.maxTemp}°C</span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Min Temp:{" "}
                      <span className="font-bold">{summary.minTemp}°C</span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Average Pressure:{" "}
                      <span className="font-bold">
                        {summary.avgPressure.toFixed(2)} hPa
                      </span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Average Humidity:{" "}
                      <span className="font-bold">
                        {summary.avgHumidity.toFixed(2)}%
                      </span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Average Visibility:{" "}
                      <span className="font-bold">
                        {summary.avgVisibility.toFixed(2)} km
                      </span>
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Dominant Condition:{" "}
                      <span className="font-bold">
                        {summary.dominantCondition}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
