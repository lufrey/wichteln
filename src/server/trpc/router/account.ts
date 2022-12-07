import { TRPCError } from "@trpc/server";
import { env } from "process";
import { getUserSchema, signUpSchema } from "../../../types/account";

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
  getAccount: publicProcedure
    .input(getUserSchema)
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.participant.findFirst({
        where: {
          email: input.email,
        },
        select: {
          name: true,
          email: true,
        },
      });
      return user ?? null;
    }),
  getBuddy: publicProcedure.query(async ({ ctx }) => {
    console.log(ctx.session?.user, "sessionuser");

    let isAvailable = true;
    let buddy;
    const endTime = parseInt(env.ENDTIME ?? "123");
    if (Date.now() < endTime) {
      isAvailable = false;
      buddy = await ctx.prisma.participant.findFirst({
        where: {
          name: "Lukas",
        },
      });
    }

    return {
      isAvailable,
      buddy,
      endTime,
    };
  }),
  getAllNames: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.participant.findMany({
      select: { name: true },
    });
  }),
});
