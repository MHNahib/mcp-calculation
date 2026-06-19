import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { numberPairInput } from "../../schemas/math.js";
import { RegisterToolConfigType } from "../../types/index.js";
import {
  addTwoNumbersConfig,
  subtractTwoNumbersConfig,
  multiplyTwoNumbersConfig,
  divideTwoNumbersConfig,
} from "./config/index.js";
import { McpTools } from "./enum.js";
import {
  addTwoNumbesTool,
  divideTwoNumbersTool,
  multiplyTwoNumbersTool,
  subtractTwoNumbersTool,
} from "./math.tools.js";

export const mcpRegistry: Map<
  string,
  {
    name: string;
    config: RegisterToolConfigType<typeof numberPairInput>;
    cb: ToolCallback<typeof numberPairInput>;
  }
> = new Map([
  [
    McpTools.add_two_numbers,
    {
      name: McpTools.add_two_numbers,
      config: addTwoNumbersConfig,
      cb: addTwoNumbesTool,
    },
  ],
  [
    McpTools.subtract_two_numbers,
    {
      name: McpTools.subtract_two_numbers,
      config: subtractTwoNumbersConfig,
      cb: subtractTwoNumbersTool,
    },
  ],
  [
    McpTools.multiply_two_numbers,
    {
      name: McpTools.multiply_two_numbers,
      config: multiplyTwoNumbersConfig,
      cb: multiplyTwoNumbersTool,
    },
  ],
  [
    McpTools.divide_two_numbers,
    {
      name: McpTools.divide_two_numbers,
      config: divideTwoNumbersConfig,
      cb: divideTwoNumbersTool,
    },
  ],
]);
