import express from "express";
const router = express.Router();
import {
  createRuleHandler,
  updateRuleHandler,
  combineRulesHandler,
  evaluateRuleHandler,
  getRulesHandler,
} from "../controllers/rules";
import { Request, Response } from "express";

router.post("/create", createRuleHandler);
router.patch("/:id", updateRuleHandler);
router.post("/combine", combineRulesHandler);
router.post("/evaluate", evaluateRuleHandler);
router.get("/", getRulesHandler);

export default router;
