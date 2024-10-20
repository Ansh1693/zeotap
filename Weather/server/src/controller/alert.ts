import { Request, Response } from "express";
import {
  createAlert,
  deleteAlert,
  getAlerts,
  getResolvedAlerts,
  resolveAlert,
} from "../services/alert";

/**
 * Controller to handle the creation of an alert.
 *
 * @param req - The request object containing the alert details in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response indicating the success or failure of the alert creation.
 */

export const createAlertController = async (req: any, res: any) => {
  const { city, condition, times, email } = req.body;
  try {
    const result = await createAlert(city, condition, times, email);
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    res
      .status(201)
      .json({ message: "Alert created successfully", alert: result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/**
 * Controller to handle the deletion of an alert.
 *
 * @param req - The request object containing the alert ID in the parameters.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response indicating the success or failure of the alert deletion.
 */
export const deleteAlertController = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const result = await deleteAlert(id);
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to retrieve all alerts.
 *
 * @param req - The request object.
 * @param res - The response object used to send back the list of alerts.
 *
 * @returns A JSON response containing the list of alerts or an error message.
 */

export const getAlertsController = async (req: any, res: any) => {
  try {
    const alerts = await getAlerts();
    if (alerts instanceof Error) {
      return res.status(400).json({ error: alerts.message });
    }
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to retrieve all resolved alerts.
 *
 * @param req - The request object.
 * @param res - The response object used to send back the list of resolved alerts.
 *
 * @returns A JSON response containing the list of resolved alerts or an error message.
 */

export const getResolvedAlertsController = async (req: any, res: any) => {
  try {
    const alerts = await getResolvedAlerts();
    if (alerts instanceof Error) {
      return res.status(400).json({ error: alerts.message });
    }
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
