import { success, error, MappingFunction } from "./util/maybe";
import { pop, push } from "./util/stack";

const UNARY_OPERATORS = ["NEGATE"] as const;

type UnaryOperator = typeof UNARY_OPERATORS[number];

const BINARY_OPERATORS = ["+", "-", "*", "/"] as const;

type BinaryOperator = typeof BINARY_OPERATORS[number];

type Operator = UnaryOperator | BinaryOperator;

type Operand = number;

type OperandOfUnaryOperation = Operand;

type OperandsOfBinaryOperation = { left: Operand; right: Operand };

type Input = Operand | Operator;

type UnaryOperatorAndInput = [UnaryOperator, ...Input[]];

type BinaryOperatorAndInput = [BinaryOperator, ...Input[]];

type OperandAndInput = [Operand, ...Input[]];

type Stack = Operand[];

const isUnaryOperator = (input: Input): input is UnaryOperator => {
  return UNARY_OPERATORS.includes(input as UnaryOperator);
};

const isBinaryOperator = (input: Input): input is BinaryOperator => {
  return BINARY_OPERATORS.includes(input as BinaryOperator);
};

export const rpn: MappingFunction<Input[], Operand> = (input) => {
  return success(input)
    .bind(computeWithStack([]))
    .bind((result) => success(result[0]));
};

const computeWithStack = (stack: Stack): MappingFunction<Input[], Stack> => (input) => {
  const [next, ...rest] = input;

  if (isUnaryOperator(next)) {
    return success([next, ...rest]).bind(handleUnaryOperation(stack));
  }

  if (isBinaryOperator(next)) {
    return success([next, ...rest]).bind(handleBinaryOperation(stack));
  }

  return success([next, ...rest]).bind(handleOperand(stack));
};

const handleUnaryOperation = (stack: Stack): MappingFunction<UnaryOperatorAndInput, Stack> => ([operator, ...rest]) => {
  if (stack.length < 1) {
    return error("Error: insufficient number of operands");
  }

  const { stack: s, value: operand } = pop(stack);

  return success(operand)
    .bind(evaluateUnaryOperation(operator))
    .bind((result) => {
      const nextStack = push(s)(result);
      if (rest.length > 0) {
        return success(rest).bind(computeWithStack(nextStack));
      }
      return success(nextStack);
    });
};

const handleBinaryOperation = (stack: Stack): MappingFunction<BinaryOperatorAndInput, Stack> => ([
  operator,
  ...rest
]) => {
  if (stack.length < 2) {
    return error("Error: insufficient number of operands");
  }

  const { stack: s1, value: right } = pop(stack);

  const { stack: s2, value: left } = pop(s1);

  return success({ left, right })
    .bind(evaluateBinaryOperation(operator))
    .bind((result) => {
      const nextStack = push(s2)(result);
      if (rest.length > 0) {
        return success(rest).bind(computeWithStack(nextStack));
      }
      return success(nextStack);
    });
};

const handleOperand = (stack: Stack): MappingFunction<OperandAndInput, Stack> => ([operand, ...rest]) => {
  const nextStack = push(stack)(operand);
  return success(rest).bind(computeWithStack(nextStack));
};

const evaluateUnaryOperation = (operator: UnaryOperator): MappingFunction<OperandOfUnaryOperation, Operand> => (
  operand
) => {
  switch (operator) {
    case "NEGATE":
      return success(-operand);
  }
};

const evaluateBinaryOperation = (operator: BinaryOperator): MappingFunction<OperandsOfBinaryOperation, Operand> => ({
  left,
  right,
}) => {
  switch (operator) {
    case "+":
      return success(left + right);
    case "-":
      return success(left - right);
    case "*":
      return success(left * right);
    case "/":
      if (right === 0) {
        return error("Error: division by 0");
      }
      return success(left / right);
  }
};
