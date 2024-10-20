import WeatherData from "../utils/types/WeatherData";
import sendAlert from "./sendAlert";
import prisma from "../utils/initializers/prisma";
import { resolveAlert } from "./alert";

/**
 * Checks for unresolved alerts and sends notifications if conditions are met.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the check is complete.
 */
const checkAlert = async (): Promise<void> => {
  try {
    const alerts = await prisma.alert.findMany({
      where: {
        resolved: false,
      },
    });

    console.log(alerts);

    alerts.forEach(async (alert) => {
      const [condition, operator, value] = alert.condition.split(" ");
      const times = alert.times;
      const data = await prisma.weatherData.findMany({
        where: {
          city: alert.city,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: times,
      });

      if (
        condition === "temperature" ||
        condition === "pressure" ||
        condition === "humidity" ||
        condition === "visibility"
      ) {
        const threshold = parseFloat(value);

        if (data.length < times) {
          return;
        }

        const isAboveThreshold = data.every((d) => {
          if (operator === ">") {
            return d[condition] > threshold;
          } else if (operator === "<") {
            return d[condition] < threshold;
          } else if (operator === ">=") {
            return d[condition] >= threshold;
          } else if (operator === "<=") {
            return d[condition] <= threshold;
          } else {
            return false;
          }
        });

        if (isAboveThreshold) {
          await sendAlert(alert.city, alert.condition, times, alert.email);
          await resolveAlert(alert.id);
        }
      } else if (condition === "condition") {
        if (data.length < times) {
          return;
        }

        const isSameCondition = data.every((d) => d.condition === value);

        if (isSameCondition) {
          await sendAlert(alert.city, alert.condition, times, alert.email);
          await resolveAlert(alert.id);
        }
      }
    });
  } catch (error: any) {}
};

export default checkAlert;
