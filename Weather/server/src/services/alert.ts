import prisma from "../utils/initializers/prisma";
import conditions from "../utils/data/conditions";
import cities from "../utils/data/cities";

/**
 * Verifies if the given condition is valid.
 *
 * @param {string} criteria - The criteria to check (e.g., temperature, pressure).
 * @param {string} operator - The operator to use (e.g., <, >, ==).
 * @param {string} value - The value to compare against.
 * @returns {boolean} - Returns true if the condition is valid, false otherwise.
 */
export const verifyCondition = (
  criteria: string,
  operator: string,
  value: string
): boolean => {
  const validConditions = [
    "temperature",
    "pressure",
    "humidity",
    "visibility",
    "condition",
  ];

  if (!validConditions.includes(criteria)) {
    return false;
  }

  if (
    criteria === "condition" &&
    operator !== "==" &&
    !conditions.includes(value)
  ) {
    return false;
  }

  if (
    criteria !== "condition" &&
    operator !== "<" &&
    operator !== ">" &&
    operator !== "=="
  ) {
    return false;
  }

  return true;
};

/**
 * Creates a new alert.
 *
 * @param {string} city - The city for the alert.
 * @param {string} condition - The condition for the alert.
 * @param {number} times - The number of times the alert should trigger.
 * @param {string} email - The email to notify.
 */
export const createAlert = async (
  city: string,
  condition: string,
  times: number,
  email: string
) => {
  try {
    if (!cities.includes(city)) {
      return new Error("Invalid city");
    }

    if (times <= 0) {
      return new Error("Invalid times");
    }

    let [criteria, operator, ...rest] = condition.split(" ");
    let value = rest.join(" ").toLowerCase();

    criteria = criteria.toLowerCase();

    if (!verifyCondition(criteria, operator, value)) {
      return new Error("Invalid condition");
    }

    if (criteria === "condition") {
      value = value.split(" ").join("-");
    }

    const createdAlert = await prisma.alert.create({
      data: {
        city,
        condition: criteria + " " + operator + " " + value,
        times,
        email,
      },
    });

    return createdAlert;
  } catch (e) {
    return new Error("Error creating alert");
  }
};

/**
 * Deletes an alert by its ID.
 *
 * @param {string} id - The ID of the alert to delete.
 * @returns {Promise<Error | void>} - Returns an error if the alert deletion fails, otherwise void.
 */
export const deleteAlert = async (id: string): Promise<Error | void> => {
  try {
    await prisma.alert.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return new Error("Error deleting alert");
  }
};

/**
 * Retrieves all unresolved alerts.
 *
 * @returns {Promise<Error | Array>} - Returns an error if fetching alerts fails, otherwise an array of alerts.
 */
export const getAlerts = async (): Promise<Error | Array<any>> => {
  try {
    const alerts = await prisma.alert.findMany();
    return alerts;
  } catch (e) {
    return new Error("Error fetching alerts");
  }
};

/**
 * Retrieves all resolved alerts.
 *
 * @returns {Promise<Error | Array>} - Returns an error if fetching alerts fails, otherwise an array of alerts.
 */
export const getResolvedAlerts = async (): Promise<Error | Array<any>> => {
  try {
    const alerts = await prisma.alert.findMany({ where: { resolved: true } });
    return alerts;
  } catch (e) {
    return new Error("Error fetching alerts");
  }
};

/**
 * Marks an alert as resolved by its ID.
 *
 * @param {string} id - The ID of the alert to resolve.
 * @returns {Promise<Error | void>} - Returns an error if resolving the alert fails, otherwise void.
 */
export const resolveAlert = async (id: string): Promise<Error | void> => {
  try {
    await prisma.alert.update({
      where: {
        id,
      },
      data: {
        resolved: true,
      },
    });
  } catch (e) {
    return new Error("Error resolving alert");
  }
};
