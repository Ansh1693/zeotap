class ASTNode {
  type: string;
  left: ASTNode | null;
  right: ASTNode | null;
  value: string | null;
  /**
   * Constructs an instance of the ASTNode class.
   *
   * @param type - The type of the AST node.
   * @param left - The left child node, or null if there is no left child.
   * @param right - The right child node, or null if there is no right child.
   * @param value - The value of the AST node, or null if there is no value.
   */
  constructor(
    type: string,
    left: ASTNode | null = null,
    right: ASTNode | null = null,
    value: string | null = null
  ) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

const validOperators = [">", "<", ">=", "<=", "=", "!="];
const validAttributes = [
  "age",
  "department",
  "income",
  "spend",
  "salary",
  "experience",
];

const attributeType = {
  age: "number",
  department: "string",
  income: "number",
  spend: "number",
  salary: "number",
  experience: "number",
};

/**
 * Creates an AST node from a rule string.
 *
 * @param ruleString - The rule string to convert to an AST node.
 * @returns The AST node representing the rule string.
 */
const createRule = (ruleString: string): ASTNode => {
  ruleString = ruleString.trim();
  if (ruleString.startsWith("(") && ruleString.endsWith(")")) {
    ruleString = ruleString.slice(1, -1).trim();
  }

  let mainOperator = "";
  let operatorIndex = -1;
  let parenthesesCount = 0;

  for (let i = 0; i < ruleString.length; i++) {
    if (ruleString[i] === "(") {
      parenthesesCount++;
    } else if (ruleString[i] === ")") {
      parenthesesCount--;
    } else if (parenthesesCount === 0) {
      if (ruleString.substring(i, i + 5) === " AND ") {
        mainOperator = "AND";
        operatorIndex = i;
        break;
      } else if (ruleString.substring(i, i + 4) === " OR ") {
        mainOperator = "OR";
        operatorIndex = i;
        break;
      }
    }
  }

  if (mainOperator) {
    const left = ruleString.substring(0, operatorIndex).trim();
    const right = ruleString
      .substring(operatorIndex + mainOperator.length + 2)
      .trim();
    return new ASTNode(
      "operator",
      createRule(left),
      createRule(right),
      mainOperator
    );
  }

  const [attribute, operator, value] = ruleString.split(" ");

  if (!validAttributes.includes(attribute)) {
    throw new Error(`Invalid attribute: ${attribute}`);
  }

  if (!validOperators.includes(operator)) {
    throw new Error(`Invalid operator: ${operator}`);
  }

  if (isNaN(Number(value)) && !value.startsWith("'") && !value.endsWith("'")) {
    throw new Error(`Invalid value: ${value}`);
  }

  if (
    attributeType[attribute as keyof typeof attributeType] === "number" &&
    isNaN(Number(value))
  ) {
    throw new Error(`Value for attribute ${attribute} must be a number`);
  }

  if (
    attributeType[attribute as keyof typeof attributeType] === "string" &&
    !value.startsWith("'") &&
    !value.endsWith("'")
  ) {
    throw new Error(`Value for attribute ${attribute} must be a string`);
  }

  return new ASTNode("operand", null, null, ruleString);
};

/**
 * Combines multiple rules into a single AST node.
 *
 * @param rules - The list of rule strings to combine.
 * @returns The combined AST node representing the rules.
 */
const combineRules = (rules: string[]): ASTNode => {
  const astNodes = rules.map(createRule);

  const operatorFrequency: { [key: string]: number } = {};
  operatorFrequency["AND"] = 0;
  countOperators(astNodes, operatorFrequency);

  const mostFrequentOperator = Object.entries(operatorFrequency).reduce(
    (a, b) => (a[1] > b[1] ? a : b)
  )[0];

  // Combine ASTs using the most frequent operator
  return combineASTsWithOperator(astNodes, mostFrequentOperator);
};

/**
 * Counts the frequency of operators in the given AST nodes.
 *
 * @param nodes - The array of AST nodes to count operators in.
 * @param frequency - An object to store the frequency of each operator.
 */
const countOperators = (
  nodes: ASTNode[],
  frequency: { [key: string]: number }
): void => {
  nodes.forEach((node) => {
    if (node.type === "operator") {
      frequency[node.value as string] =
        (frequency[node.value as string] || 0) + 1;
      countOperators([node.left as ASTNode, node.right as ASTNode], frequency);
    }
  });
};

/**
 * Combines multiple AST nodes using the specified operator.
 *
 * @param nodes - The array of AST nodes to combine.
 * @param operator - The operator to use for combining the AST nodes.
 * @returns The combined AST node.
 */
const combineASTsWithOperator = (
  nodes: ASTNode[],
  operator: string
): ASTNode => {
  if (nodes.length === 1) return nodes[0];

  const combinedNode = new ASTNode("operator", null, null, operator);
  let currentNode = combinedNode;

  for (let i = 0; i < nodes.length; i++) {
    if (i === nodes.length - 2) {
      currentNode.left = nodes[i];
      currentNode.right = nodes[i + 1];
      break;
    } else {
      currentNode.left = nodes[i];
      const newNode = new ASTNode("operator", null, null, operator);
      currentNode.right = newNode;
      currentNode = newNode;
    }
  }

  return optimizeAST(combinedNode);
};

/**
 * Optimizes an AST node by combining nodes with the same operator.
 *
 * @param node - The AST node to optimize.
 * @returns The optimized AST node.
 */
const optimizeAST = (node: ASTNode): ASTNode => {
  if (node.type !== "operator") return node;

  node.left = optimizeAST(node.left as ASTNode);
  node.right = optimizeAST(node.right as ASTNode);

  // Combine nodes with the same operator
  if (node.left?.type === "operator" && node.left.value === node.value) {
    const leftRight = node.left.right as ASTNode;
    node.left = node.left.left;
    const newNode = new ASTNode("operator", leftRight, node.right, node.value);
    node.right = optimizeAST(newNode);
  }

  if (node.right?.type === "operator" && node.right.value === node.value) {
    const rightLeft = node.right.left as ASTNode;
    const newNode = new ASTNode("operator", node.left, rightLeft, node.value);
    node.left = optimizeAST(newNode);
    node.right = node.right.right;
  }

  return node;
};

/**
 * Evaluates an AST node with the given data.
 *
 * @param ast - The AST node to evaluate.
 * @param data - The data object to use for evaluation.
 * @returns True if the AST node evaluates to true, false otherwise.
 */
const evaluateRule = (ast: ASTNode, data: { [key: string]: any }): boolean => {
  if (ast.type === "operator") {
    if (ast.value === "AND") {
      return (
        (ast.left ? evaluateRule(ast.left, data) : false) &&
        (ast.right ? evaluateRule(ast.right, data) : false)
      );
    } else if (ast.value === "OR") {
      return (
        (ast.left ? evaluateRule(ast.left, data) : false) ||
        (ast.right ? evaluateRule(ast.right, data) : false)
      );
    }
  } else if (ast.type === "operand" && ast.value) {
    // Split condition, e.g., "age > 30"
    const [attribute, operator, value] = ast.value.split(" ");
    const userValue = data[attribute];
    switch (operator) {
      case ">":
        return userValue > parseInt(value);
      case "<":
        return userValue < parseInt(value);
      case "=":
        return userValue === value.replace(/'/g, "");
      default:
        return false;
    }
  }
  return false;
};

/**
 * Validates the syntax of the provided rule string.
 *
 * @param ruleString - The rule string to validate.
 *
 * @returns True if the rule string is valid, false otherwise.
 */
const validateRuleString = (ruleString: String) => {
  const cleanString = ruleString.replace(/\s/g, "");

  // Check for balanced parentheses
  let parenthesesCount = 0;
  for (const char of cleanString) {
    if (char === "(") parenthesesCount++;
    if (char === ")") parenthesesCount--;
    if (parenthesesCount < 0) return false; // Closing parenthesis without opening
  }
  if (parenthesesCount !== 0) return false; // Unbalanced parentheses

  // Split into individual conditions and operators
  const elements = cleanString.split(/(\(|\)|\bAND\b|\bOR\b)/).filter(Boolean);

  // Stack to keep track of nested expressions
  const stack: string[] = [];
  const logicalOperators = ["AND", "OR"];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element === "(") {
      stack.push(element);
    } else if (element === ")") {
      if (stack.pop() !== "(") return false; // Mismatched parentheses
    } else if (logicalOperators.includes(element)) {
      if (i === 0 || i === elements.length - 1) return false; // Operator at start or end
      if (
        logicalOperators.includes(elements[i - 1]) ||
        logicalOperators.includes(elements[i + 1])
      )
        return false; // Consecutive operators
    } else {
      // This should be a condition
      const conditionOperator = validOperators.find(
        (op) => element.includes(op) && op !== "AND" && op !== "OR"
      );
      if (!conditionOperator) return false; // No valid comparison operator
      const [left, right] = element.split(conditionOperator);
      if (!left || !right) return false; // Missing left or right operand
      if (!validAttributes.includes(left)) return false; // Invalid attribute
    }
  }

  return stack.length === 0;
};

/**
 * Converts an AST node back into a rule string.
 *
 * @param node - The AST node to convert.
 * @returns The rule string representation of the AST node.
 */
const astToRuleString = (node: ASTNode): string => {
  if (node.type === "operator") {
    const left = astToRuleString(node.left as ASTNode);
    const right = astToRuleString(node.right as ASTNode);

    // For AND and OR operators, we wrap the entire expression in parentheses
    if (node.value === "AND" || node.value === "OR") {
      return `(${left} ${node.value} ${right})`;
    } else {
      // For other operators (comparison operators), we don't need extra parentheses
      return `${left} ${node.value} ${right}`;
    }
  } else if (node.type === "operand") {
    // If the operand is a string (like department names), we wrap it in quotes
    return typeof node.value === "string" && isNaN(Number(node.value))
      ? `${node.value}`
      : (node.value as string);
  } else {
    throw new Error(`Unknown node type: ${node.type}`);
  }
};
/**
 * Validates the attributes in the provided rule string.
 *
 * @param ruleString - The rule string to validate.
 * @returns True if all attributes in the rule string are valid, false otherwise.
 */
const validateAttributes = (ruleString: string): boolean => {
  const attributePattern =
    /\b(age|department|income|spend|salary|experience)\b/g;
  const matches = ruleString.match(attributePattern);
  if (!matches) return false;
  return matches.every((attr) => validAttributes.includes(attr));
};

export {
  ASTNode,
  createRule,
  combineRules,
  evaluateRule,
  validateRuleString,
  astToRuleString,
  validateAttributes,
};
