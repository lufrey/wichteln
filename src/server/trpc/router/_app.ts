import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
