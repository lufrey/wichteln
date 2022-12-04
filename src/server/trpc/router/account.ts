import { signUpSchema } from "../../../types/account";

import { router, publicProcedure } from "../trpc";

export const accountRouter = router({
  signUp: publicProcedure.input(signUpSchema).mutation(({ input }) => {
    return {
      greeting: `Hello ${input?.name ?? "world"}`,
    };
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
