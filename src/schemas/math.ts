import z from "zod";

export const numberPairInput = {
  a: z.number().describe("The first number"),
  b: z.number().describe("The second number"),
};

export const numberResultOutput = {
  result: z.number().describe("The result of the operation"),
};
