import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const createAlert = async (
  city: string,
  condition: string,
  times: number,
  email: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alerts`, {
      city,
      condition,
      times,
      email,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const deleteAlert = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/alerts/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const getAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const getResolvedAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts/resolved`);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};
