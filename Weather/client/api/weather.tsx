import axios from "axios";

const getWeather = async (city: string, date?: string) => {
  try {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL +
      "/weather" +
      (date ? `?city=${city}&date=${date}` : `?city=${city}`);

    const response = await axios.get(url);

    console.log(response.data);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getForecast = async (city: string, times: number) => {
  try {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL +
      "/weather/forecast" +
      `?city=${city}&times=${times}`;

    const response = await axios.get(url);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getWeather, getForecast };
