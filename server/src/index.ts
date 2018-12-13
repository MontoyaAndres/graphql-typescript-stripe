import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as session from "express-session";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { createTypeormConn } from "./utils/createTypeormConn";

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => req
  });

  await createTypeormConn();

  const app = express();

  app.use(
    session({
      secret: "sadasdasda",
      resave: false,
      saveUninitialized: false
    })
  );

  server.applyMiddleware({ app }); // App is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`let's go boy! http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
