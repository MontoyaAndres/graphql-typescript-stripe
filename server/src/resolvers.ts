import * as bcrypt from "bcryptjs";

import { User } from "./entity/User";
import { ResolverMap } from "./types/graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    me: (_, __, { session }) => User.findOne(session.userId)
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword
      }).save();

      return true;
    },
    login: async (_, { email, password }, { session }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      session.userId = user.id;

      return user;
    }
  }
};
