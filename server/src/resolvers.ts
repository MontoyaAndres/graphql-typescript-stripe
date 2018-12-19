import * as bcrypt from "bcryptjs";

import { User } from "./entity/User";
import { ResolverMap } from "./types/graphql-utils";
import { stripe } from "./stripe";

export const resolvers: ResolverMap = {
  Query: {
    me: (_, __, { session }) => User.findOne({ where: { id: session.userId } })
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
    },
    createSubscription: async (_, { source, ccLast4 }, { session }) => {
      if (!session.userId) {
        throw new Error("not authenticated");
      }

      const user = await User.findOne({ where: { id: session.userId } });

      if (!user) {
        throw new Error();
      }

      const customer = await stripe.customers.create({
        email: user.email,
        source,
        plan: process.env.PLAN
      });

      user.stripeId = customer.id;
      user.type = "premium";
      user.ccLast4 = ccLast4;

      await user.save();

      return user;
    },
    changeCreditCard: async (_, { source, ccLast4 }, { session }) => {
      if (!session.userId) {
        throw new Error("not authenticated");
      }

      const user = await User.findOne({ where: { id: session.userId } });

      if (!user || !user.stripeId || user.type !== "premium") {
        throw new Error();
      }

      await stripe.customers.update(user.stripeId, { source });

      user.ccLast4 = ccLast4;
      await user.save();

      return user;
    }
  }
};
