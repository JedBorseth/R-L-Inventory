import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { scrapMaterial } from "~/server/db/schema";

const scrapZod = z.object({
  length: z.number(),
  width: z.number(),
  amount: z.number(),
  color: z.string(),
  flute: z.string(),
  strength: z.number(),
  scored: z.boolean(),
  CompanyUsedFor: z.string().array(),
  description: z.string(),
});

export const scrapRouter = createTRPCRouter({
  create: protectedProcedure
    .input(scrapZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(scrapMaterial).values({
        length: input.length,
        width: input.width,
        amount: input.amount,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(scrapMaterial).where(eq(scrapMaterial.id, input));
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.scrapMaterial.findMany({
      orderBy: (pallets, { desc }) => [desc(pallets.dateModified)],
    });
  }),
});
