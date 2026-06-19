import { numberPairInput, numberResultOutput } from "../../../schemas/math.js";
import { RegisterToolConfigType } from "../../../types/index.js";

export const addTwoNumbersConfig: RegisterToolConfigType<typeof numberPairInput> = {
  title: "Add Two Numbers",
  description: "Add two numbers",
  inputSchema: numberPairInput,
  outputSchema: numberResultOutput,
};

export const subtractTwoNumbersConfig: RegisterToolConfigType<typeof numberPairInput> = {
  title: "Subtract Two Numbers",
  description: "Subtract the second number from the first",
  inputSchema: numberPairInput,
  outputSchema: numberResultOutput,
};

export const multiplyTwoNumbersConfig: RegisterToolConfigType<typeof numberPairInput> = {
  title: "Multiply Two Numbers",
  description: "Multiply two numbers",
  inputSchema: numberPairInput,
  outputSchema: numberResultOutput,
};

export const divideTwoNumbersConfig: RegisterToolConfigType<typeof numberPairInput> = {
  title: "Divide Two Numbers",
  description: "Divide the first number by the second",
  inputSchema: numberPairInput,
  outputSchema: numberResultOutput,
};
