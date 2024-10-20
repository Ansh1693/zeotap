import { Router } from "express";
import {
  createAlertController,
  deleteAlertController,
  getAlertsController,
  getResolvedAlertsController,
} from "../controller/alert";

const alerts = Router();

alerts.post("/", createAlertController);
alerts.delete("/:id", deleteAlertController);
alerts.get("/", getAlertsController);
alerts.get("/resolved", getResolvedAlertsController);

export default alerts;
