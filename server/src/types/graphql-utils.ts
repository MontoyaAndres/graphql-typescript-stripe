import * as express from "express";

export interface Session extends Express.Session {
  userId?: number;
}

export interface Context {
  session: Session;
  req: Express.Request;
  res: express.Response;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver | { [key: string]: Resolver };
  };
}
