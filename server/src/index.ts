import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";

const RedisStore = connectRedis(session);

async function startServer() {
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ request, response }) => ({
      request,
      response,
      session: request ? request.session : undefined
    })
  });

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "sadasdasda",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only works with https
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  await createTypeormConn();

  const app = server.start(
    {
      port: 4000,
      cors: { origin: "http://localhost:3000", credentials: true }
    },
    () => console.log(`let's go boy! http://localhost:4000/`)
  );

  return app;
}

startServer();
