import { Request, Response } from "express";
import { IRoute } from "../interfaces";
import { handleMcpRequest } from "../controllers/mcp.controller";

export const routes: IRoute[] = [
  {
    path: "/",
    method: "get",
    handler: (req: Request, res: Response) => {
      res.send({
        message: `Welcome to the server 🚀`,
        status: true,
      });
    },
  },
  {
    path: "/mcp",
    method: "post",
    handler: handleMcpRequest,
  },
  {
    path: "/mcp",
    method: "all",
    handler: (req: Request, res: Response) => {
      res.status(405).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      });
    },
  },
];
