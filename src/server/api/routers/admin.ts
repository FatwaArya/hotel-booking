import { z } from "zod";

import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: adminProcedure.query(() => {
    return "you can now see this secret admin message!";
  }),
});
