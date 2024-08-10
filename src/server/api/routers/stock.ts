import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { stockSheet } from "~/server/db/schema";

export const stockZod = z.object({
  length: z.number(),
  width: z.number(),
  amount: z.number(),
  block: z.boolean(),
  used: z.boolean(),
  heatTreated: z.boolean(),
  inventoryThreshold: z.number(),
  description: z.string(),
});
export const stockRouter = createTRPCRouter({
  create: protectedProcedure
    .input(stockZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(stockSheet).values({
        length: Number(input.length),
        width: Number(input.width),
        amount: Number(input.amount),
        inventoryThreshold: Number(input.inventoryThreshold),
        notes: input.description,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(stockSheet).where(eq(stockSheet.id, input));
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.stockSheet.findMany({
      orderBy: (stockSheet, { desc }) => [desc(stockSheet.dateModified)],
    });
  }),
});
