import { TRPCError } from "@trpc/server";
import { env } from "process";
import { z } from "zod";
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
  getBuddy: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input, ctx }) => {
      // const endTime = parseInt(env.ENDTIME ?? "10000000000");

      const endTime = 10000;
      const user = await ctx.prisma.participant.findFirst({
        where: {
          email: input.email,
        },
        include: {
          sendGiftTo: true,
        },
      });

      if (Date.now() < endTime || !input.email || !user) {
        return {
          buddy: null,
          endTime,
        };
      }
      let buddy;
      // no buddy found
      if (user && !user?.sendGiftTo) {
        const possibleUsers = await ctx.prisma.participant.findMany({
          where: {
            email: {
              not: input.email,
            },
            receiveGiftFrom: null,
          },
        });

        // get random person that is does not have a buddy yet
        const randomIndex = Math.floor(Math.random() * possibleUsers.length);
        const randomUser = possibleUsers[randomIndex];

        // set random person as buddy
        const updatedUser = await ctx.prisma.participant.update({
          where: {
            id: user.id,
          },
          data: {
            sendGiftTo: {
              connect: {
                id: randomUser?.id,
              },
            },
          },
          include: {
            sendGiftTo: true,
          },
        });
        buddy = updatedUser?.sendGiftTo;
      } else {
        buddy = user.sendGiftTo;
      }

      return {
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
