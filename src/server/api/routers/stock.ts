import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pallets } from "~/server/db/schema";

const palletZod = z.object({
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
    .input(palletZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(pallets).values({
        length: input.length,
        width: input.width,
        amount: input.amount,
        block: input.block,
        used: input.used,
        heatTreated: input.heatTreated,
        inventoryThreshold: input.inventoryThreshold,
        description: input.description,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(pallets).where(eq(pallets.id, input));
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pallets.findMany({
      orderBy: (pallets, { desc }) => [desc(pallets.dateModified)],
    });
  }),
});
