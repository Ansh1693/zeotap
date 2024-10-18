import { expect } from "chai";
import {
  ASTNode,
  createRule,
  combineRules,
  evaluateRule,
  astToRuleString,
} from "../services/rules";

describe("AST Rule System Tests", () => {
  // Test 1: Individual Rule Creation and AST Verification
  describe("createRule - Individual Rules", () => {
    it("should create correct AST for simple comparison rule", () => {
      const rule = "age > 30";
      const ast = createRule(rule);

      expect(ast.type).to.equal("operand");
      expect(ast.value).to.equal("age > 30");
    });

    it("should create correct AST for string comparison rule", () => {
      const rule = "department = 'IT'";
      const ast = createRule(rule);

      expect(ast.type).to.equal("operand");
      expect(ast.value).to.equal("department = 'IT'");
    });

    it("should create correct AST for compound AND rule", () => {
      const rule = "(age > 30 AND salary > 50000)";
      const ast = createRule(rule);

      expect(ast.type).to.equal("operator");
      expect(ast.value).to.equal("AND");
      expect(ast.left?.type).to.equal("operand");
      expect(ast.right?.type).to.equal("operand");
    });

    it("should create correct AST for compound OR rule", () => {
      const rule = "(department = 'IT' OR department = 'HR')";
      const ast = createRule(rule);

      expect(ast.type).to.equal("operator");
      expect(ast.value).to.equal("OR");
      expect(ast.left?.type).to.equal("operand");
      expect(ast.right?.type).to.equal("operand");
    });
  });

  // Test 2: Rule Combination and AST Structure
  describe("combineRules - Rule Combination", () => {
    it("should combine two simple rules with AND", () => {
      const rules = ["age > 30", "salary > 50000"];

      const ast = combineRules(rules);
      expect(ast.type).to.equal("operator");
      expect(ast.value).to.equal("AND");
      expect(ast.left?.type).to.equal("operand");
      expect(ast.right?.type).to.equal("operand");
    });

    it("should combine three rules maintaining structure", () => {
      const rules = ["age > 30", "salary > 50000", "department = 'IT'"];

      const ast = combineRules(rules);
      expect(ast.type).to.equal("operator");
      expect(ast.value).to.equal("AND");
      expect(ast.right?.type).to.equal("operand");
      expect(ast.left?.type).to.equal("operator");
    });

    it("should handle mixed AND/OR operations", () => {
      const rules = [
        "(department = 'IT' OR department = 'HR')",
        "salary > 50000",
      ];

      const ast = combineRules(rules);
      expect(ast.type).to.equal("operator");
      expect(ast.left?.type).to.equal("operator");
      expect(ast.left?.value).to.equal("OR");
    });
  });

  // Test 3: Rule Evaluation with Sample Data
  describe("evaluateRule - Rule Evaluation", () => {
    const testData = {
      age: 35,
      salary: 60000,
      department: "IT",
      experience: 5,
      role: "developer",
    };

    it("should evaluate simple comparison correctly", () => {
      const rule = createRule("age > 30");
      expect(evaluateRule(rule, testData)).to.be.true;

      const rule2 = createRule("age > 40");
      expect(evaluateRule(rule2, testData)).to.be.false;
    });

    it("should evaluate string comparison correctly", () => {
      const rule = createRule("department = 'IT'");
      expect(evaluateRule(rule, testData)).to.be.true;

      const rule2 = createRule("department = 'HR'");
      expect(evaluateRule(rule2, testData)).to.be.false;
    });

    it("should evaluate compound AND conditions correctly", () => {
      const rules = ["age > 30", "salary > 50000", "department = 'IT'"];

      const ast = combineRules(rules);
      expect(evaluateRule(ast, testData)).to.be.true;
    });

    it("should evaluate compound OR conditions correctly", () => {
      const rule = createRule("(department = 'IT' OR department = 'HR')");
      expect(evaluateRule(rule, testData)).to.be.true;

      const rule2 = createRule("(department = 'Finance' OR department = 'HR')");
      expect(evaluateRule(rule2, testData)).to.be.false;
    });
  });

  // Test 4: Complex Scenarios and Edge Cases
  describe("Complex Scenarios", () => {
    it("should handle deeply nested rules", () => {
      const rule =
        "(age > 30 AND (department = 'IT' OR department = 'HR') AND (salary > 50000 OR experience > 3))";
      const ast = createRule(rule);

      const testData = {
        age: 35,
        department: "IT",
        salary: 45000,
        experience: 5,
      };

      expect(evaluateRule(ast, testData)).to.be.true;
    });

    it("should handle multiple OR conditions", () => {
      const rules = [
        "(role = 'developer' OR role = 'architect')",
        "(department = 'IT' OR department = 'Engineering')",
        "salary > 50000",
      ];

      const ast = combineRules(rules);

      const testData = {
        role: "developer",
        department: "IT",
        salary: 60000,
      };

      expect(evaluateRule(ast, testData)).to.be.true;
    });

    it("should handle empty or invalid data gracefully", () => {
      const rule = createRule("age > 30");

      expect(evaluateRule(rule, {})).to.be.false;
      expect(evaluateRule(rule, { name: "John" })).to.be.false;
    });

    it("should maintain rule integrity after conversion", () => {
      const originalRule = "(age > 30 AND salary > 50000)";
      const ast = createRule(originalRule);
      const convertedRule = astToRuleString(ast);

      const testData = {
        age: 35,
        salary: 60000,
      };

      expect(evaluateRule(createRule(convertedRule), testData)).to.equal(
        evaluateRule(ast, testData)
      );
    });
  });
});
