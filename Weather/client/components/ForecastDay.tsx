import { Card, CardContent } from "@/components/ui/card";
import { Sun, Wind, Droplets, Eye } from "lucide-react";

type ForecastDayProps = {
  data: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    visibility: number;
    dt_txt: string;
  };
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ForecastDay({ data }: ForecastDayProps) {
  const temp = data.main.temp.toFixed(1);
  const feelsLike = data.main.feels_like.toFixed(1);
  const minTemp = data.main.temp_min.toFixed(1);
  const maxTemp = data.main.temp_max.toFixed(1);
  const date = new Date(data.dt * 1000);
  const formattedDate = date.toLocaleDateString();
  const time = formatTime(data.dt_txt);
  const weather = data.weather[0];

  return (
    <Card className="w-full h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="mb-2">
          <p className="font-semibold">{formattedDate}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <Sun className="w-8 h-8 text-yellow-500" />
          <div className="text-right">
            <p className="text-2xl font-bold">{temp}°C</p>
            <p className="text-sm">
              ({minTemp}°C - {maxTemp}°C)
            </p>
          </div>
        </div>
        <p className="text-sm mb-2">Feels like: {feelsLike}°C</p>
        <p className="text-sm mb-2">
          {weather.main} - {weather.description}
        </p>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm">
            <Wind className="w-4 h-4 mr-1" />
            <span>{data.wind.speed} m/s</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Droplets className="w-4 h-4 mr-1" />
            <span>{data.main.humidity}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Eye className="w-4 h-4 mr-1" />
            <span>{data.visibility / 1000} km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
