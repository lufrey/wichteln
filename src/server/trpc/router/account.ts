import { TRPCError } from "@trpc/server";
import { signUpSchema } from "../../../types/account";

import { router, publicProcedure } from "../trpc";

export const accountRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      // skip if participant exists
      if (
        await ctx.prisma.participant.findFirst({
          where: {
            email: input.email,
          },
        })
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Diese E-Mail Adresse wird bereits genutzt.",
        });
      }

      // create new user
      await ctx.prisma.participant.create({
        data: input,
      });

      return {
        result: `Nutzer "${input.name}" angelegt!`,
      };
    }),
  getBuddy: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.participant.findFirst({
      where: {
        name: "Lukas",
      },
    });
  }),
  getAllNames: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.participant.findMany({
      select: { name: true },
    });
  }),
});
