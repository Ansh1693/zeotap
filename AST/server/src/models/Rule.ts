// models/Rule.js
import mongoose from "mongoose";
const NodeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "operator" or "operand"
  left: { type: mongoose.Schema.Types.Mixed, default: null }, // reference to left child node
  right: { type: mongoose.Schema.Types.Mixed, default: null }, // reference to right child node
  value: { type: mongoose.Schema.Types.Mixed, default: null }, // value for operand nodes
});

const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ruleString: { type: String, required: true },
  ast: { type: NodeSchema, required: true }, // AST root node
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

interface INode {
  type: string;
  left?: INode | null;
  right?: INode | null;
  value?: any;
}

interface IRule {
  ast: INode;
  createdAt?: Date;
  deleted?: boolean;
  name: string;
  ruleString: string;
}

export default mongoose.model("Rule", RuleSchema);

export { INode, IRule };
