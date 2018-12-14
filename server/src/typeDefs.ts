export const typeDefs = `
  type User {
    id: ID!
    email: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): User
  }
`;
