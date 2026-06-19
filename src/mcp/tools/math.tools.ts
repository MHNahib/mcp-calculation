import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { numberPairInput } from "../../schemas/math";

export const addTwoNumbesTool: ToolCallback<typeof numberPairInput> = async ({
  a,
  b,
}) => {
  const output = a + b;
  return {
    content: [{ type: "text", text: `The sum of ${a} and ${b} is ${output}` }],
    structuredContent: { result: output },
  };
};

export const subtractTwoNumbersTool: ToolCallback<
  typeof numberPairInput
> = async ({ a, b }) => {
  const output = a - b;
  return {
    content: [{ type: "text", text: `${a} minus ${b} is ${output}` }],
    structuredContent: { result: output },
  };
};

export const multiplyTwoNumbersTool: ToolCallback<
  typeof numberPairInput
> = async ({ a, b }) => {
  const output = a * b;
  return {
    content: [{ type: "text", text: `${a} times ${b} is ${output}` }],
    structuredContent: { result: output },
  };
};

export const divideTwoNumbersTool: ToolCallback<
  typeof numberPairInput
> = async ({ a, b }) => {
  if (b === 0) {
    return {
      content: [{ type: "text", text: "Cannot divide by zero." }],
      isError: true,
    };
  }
  const output = a / b;
  return {
    content: [{ type: "text", text: `${a} divided by ${b} is ${output}` }],
    structuredContent: { result: output },
  };
};
