import Rule, { INode, IRule } from "../models/Rule";

import { Request, Response } from "express";
import {
  ASTNode,
  createRule,
  combineRules,
  evaluateRule,
  validateRuleString,
  astToRuleString,
} from "../services/rules";

const validAttributes = [
  "age",
  "department",
  "income",
  "spend",
  "salary",
  "experience",
];

/**
 * Handles the update of a rule based on the provided rule string.
 *
 * @param req - The request object containing the rule ID in the parameters and the rule string in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response indicating the result of the update operation.
 *
 * @throws Will return a 400 status if the rule string is invalid.
 * @throws Will return a 404 status if the rule with the specified ID is not found.
 * @throws Will return a 500 status if there is an error during the update process.
 */
const updateRuleHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { ruleString, name } = req.body;

    if (!validateRuleString(ruleString)) {
      return res
        .status(400)
        .json({ message: "Invalid rule syntax, operator, or attribute" });
    }

    const updatedAST = createRule(ruleString);

    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      { name, ruleString, ast: updatedAST },
      { new: true, runValidators: true }
    );

    if (!updatedRule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    res.status(200).json({
      message: "Rule updated successfully",
      rule: updatedRule,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating rule", error: error.message });
  }
};

/**
 * Handles the creation of a new rule based on the provided rule name and rule string.
 *
 * @param req - The request object containing the rule name and rule string in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response indicating the result of the creation operation.
 *
 * @throws Will return a 400 status if the rule string is invalid.
 * @throws Will return a 500 status if there is an error during the creation process.
 */

const createRuleHandler = async (req: any, res: any) => {
  try {
    const { name, ruleString } = req.body;

    // Log the rule string to verify
    console.log("Received rule name:", name);
    console.log("Received rule string:", ruleString);

    // Validate the rule string
    if (!validateRuleString(ruleString)) {
      console.error("Validation failed for rule string:", ruleString);
      return res.status(400).json({
        message: "Invalid rule syntax or attribute name",
        details:
          "Ensure correct operators, balanced parentheses, and valid attributes.",
      });
    }

    // Create AST and save the rule
    const ast = createRule(ruleString);

    const newRule = new Rule({ name, ruleString, ast });
    await newRule.save();

    res.status(201).json({
      message: "Rule created successfully",
      rule: newRule,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create rule", error: error.message });
  }
};

/*
 * Combines multiple rules into a single AST node.
 *
 * @param rules - The list of rule strings to combine.
 * @param operator - The operator to use for combining the rules (default is "AND").
 * @returns The combined AST node representing the rules.
 */

const combineRulesHandler = async (req: Request, res: Response) => {
  try {
    const { ruleStrings, name } = req.body;
    const combinedAST = combineRules(ruleStrings);

    const str: string = astToRuleString(combinedAST);

    const newRule = new Rule({ name, ruleString: str, ast: combinedAST });

    await newRule.save();

    res.status(200).json({
      message: "Rules combined successfully",
      rule: newRule,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Evaluates a rule against the provided user data.
 *
 * @param req - The request object containing the rule ID and user data in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response indicating the result of the evaluation operation.
 *
 * @throws Will return a 404 status if the rule with the specified ID is not found.
 * @throws Will return a 500 status if there is an error during the evaluation process.
 */

const evaluateRuleHandler = async (req: any, res: any) => {
  try {
    const { ruleId, userData } = req.body;

    // Fetch rule from the database
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // Evaluate the rule's AST against the user data
    const result = evaluateRule(rule.ast, userData);

    res.status(200).json({
      message: "Rule evaluation completed",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetches all rules from the database and returns them as a JSON response.
 *
 * @param req - The request object.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response containing the list of rules fetched from the database.
 *
 * @throws Will return a 500 status if there is an error during the fetch process.
 */

const getRulesHandler = async (req: Request, res: Response) => {
  try {
    const rules = await Rule.find();
    res.status(200).json({ rules });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createRuleHandler,
  updateRuleHandler,
  combineRulesHandler,
  evaluateRuleHandler,
  getRulesHandler,
};
