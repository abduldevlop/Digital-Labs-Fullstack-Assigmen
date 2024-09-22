declare module "express-jwt" {
  import { RequestHandler } from "express";

  interface Options {
    secret:
      | string
      | ((
          req: any,
          payload: any,
          done: (err: any, user?: any) => void
        ) => void);
    algorithms?: string[];
    issuer?: string;
    audience?: string;
    credentialsRequired?: boolean;
  }

  export function expressJwt(options: Options): RequestHandler;
}
