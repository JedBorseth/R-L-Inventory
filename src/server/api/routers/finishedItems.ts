import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { finishedItems } from "~/server/db/schema";

export const finishedItemsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        length: z.number(),
        width: z.number(),
        depth: z.number(),
        amount: z.number(),
        prodAmount: z.number(),
        itemNum: z.string(),
        amountPerPallet: z.number(),
        description: z.string().nullable().optional(),
        flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
        color: z.enum(["kraft", "white"]),
        strength: z.number(),
        inventoryThreshold: z.number(),
        maxInventoryThreshold: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(finishedItems).values({
        ...input,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(finishedItems).where(eq(finishedItems.id, input));
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.finishedItems.findMany({
      orderBy: (pallets, { desc }) => [desc(pallets.dateModified)],
    });
  }),
  updateAmount: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        amount: z.number(),
        prodAmount: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(finishedItems)
        .set({
          amount: input.amount,
          prodAmount: input.prodAmount,
          dateModified: new Date().toISOString(),
        })
        .where(eq(finishedItems.id, input.id));
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.finishedItems.findFirst({
        where: eq(finishedItems.id, input.id),
      });
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          length: z.number(),
          width: z.number(),
          depth: z.number(),
          amount: z.number(),
          prodAmount: z.number(),
          itemNum: z.string(),
          amountPerPallet: z.number(),
          description: z.string().nullable().optional(),
          flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
          color: z.enum(["kraft", "white"]),
          strength: z.number(),
          inventoryThreshold: z.number(),
          maxInventoryThreshold: z.number(),
        })
        .extend({ id: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(finishedItems)
        .set({
          ...input,
          dateModified: new Date().toISOString(),
        })
        .where(eq(finishedItems.id, input.id));
    }),
});
