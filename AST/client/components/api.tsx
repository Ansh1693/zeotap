import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API URL

export interface CardItem {
  _id: string;
  name: string;
  ruleString: string | null;
  ruleStrings: string[] | null;
  ast: any;
}

export async function fetchCards(): Promise<CardItem[]> {
  const response = await axios.get(`${API_URL}`);
  return response.data.rules;
}

export async function addCard(
  card: Omit<CardItem, "_id" | "ast" | "ruleStrings">
): Promise<CardItem> {
  const response = await axios.post(`${API_URL}/create`, card);
  return response.data;
}

export async function editCard(card: CardItem): Promise<CardItem> {
  const response = await axios.patch(`${API_URL}/${card._id}`, card);
  return response.data.rule;
}

export async function combineRules(
  card: Omit<CardItem, "_id" | "ast" | "ruleString">
): Promise<CardItem> {
  const response = await axios.post(`${API_URL}/combine`, card);
  return response.data.rule;
}

export async function evaluateCard(data: {
  ruleId: string;
  userData: any;
}): Promise<any> {
  const response = await axios.post(`${API_URL}/evaluate`, {
    ruleId: data.ruleId,
    userData: data.userData,
  });

  console.log(response.data);
  return response.data;
}
