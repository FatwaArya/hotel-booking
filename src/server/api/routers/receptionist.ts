import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  receptionistProcedure,
} from "../trpc";

export const receptionistRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {}),

  getSecretMessage: receptionistProcedure.query(() => {
    return "you can now see this secret receptionist message!";
  }),
});
