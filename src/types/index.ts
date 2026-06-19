import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

type BaseToolConfig = McpServer["registerTool"] extends (
  name: string,
  config: infer C,
  ...rest: any[]
) => any
  ? C
  : never;

export type RegisterToolConfigType<T = any> = Omit<
  BaseToolConfig,
  "inputSchema"
> & {
  inputSchema?: T;
};
