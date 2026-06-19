import { RequestHandler } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "all";

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
}
