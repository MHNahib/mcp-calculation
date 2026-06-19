import { Router } from "express";
import { routes } from "./route";
import { HttpMethod } from "../interfaces";

const router: Router = Router();

routes.forEach((route) => {
  const method = route.method.toLowerCase() as HttpMethod;

  router[method](route.path, route.handler);
});

export default router;
