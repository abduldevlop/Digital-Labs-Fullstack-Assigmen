declare module "express-jwt" {
  import { RequestHandler } from "express";
  export function expressJwt(options: any): RequestHandler;
  export function UnauthorizedError(message?: string): any;
}
