import { router } from "../trpc";
import { accountRouter } from "./account";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
