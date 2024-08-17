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
  inventoryThreshold: z.number(),
  maxInventoryThreshold: z.number(),
  description: z.string().optional(),
  CompanyUsedFor: z.string().array().optional(),
  color: z.enum(["kraft", "white"]),
  flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
  strength: z.number(),
});
export const stockRouter = createTRPCRouter({
  create: protectedProcedure
    .input(stockZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(stockSheet).values({
        amount: input.amount,
        inventoryThreshold: input.inventoryThreshold,
        maxInventoryThreshold: input.maxInventoryThreshold,
        width: input.width,
        length: input.length,
        CompanyUsedFor: input.CompanyUsedFor,
        color: input.color,
        flute: input.flute,
        strength: input.strength,
        description: input.description,
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
  updateAmount: protectedProcedure
    .input(z.object({ id: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(stockSheet)
        .set({
          amount: input.amount,
          dateModified: new Date().toISOString(),
        })
        .where(eq(stockSheet.id, input.id));
    }),
});
