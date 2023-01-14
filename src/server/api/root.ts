import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { receptionistRouter } from "./routers/receptionist";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  admin: adminRouter,
  receptionist: receptionistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
