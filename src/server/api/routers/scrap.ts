import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { scrapMaterial } from "~/server/db/schema";

export const scrapZod = z.object({
  length: z.coerce.number(),
  width: z.coerce.number(),
  amount: z.coerce.number(),
  color: z.enum(["kraft", "white"]),
  flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
  strength: z.coerce.number(),
  scored: z.coerce.boolean(),
  scoredAt: z.array(z.coerce.number()),
  CompanyUsedFor: z.coerce.string().array(),
  description: z.coerce.string(),
});

export const scrapRouter = createTRPCRouter({
  create: protectedProcedure
    .input(scrapZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(scrapMaterial).values({
        amount: input.amount,
        width: input.width,
        length: input.length,
        CompanyUsedFor: input.CompanyUsedFor,
        color: input.color,
        flute: input.flute,
        strength: input.strength,
        scored: input.scored,
        scoredAt: input.scoredAt,
        notes: input.description,
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
  updateAmount: protectedProcedure
    .input(z.object({ id: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(scrapMaterial)
        .set({
          amount: input.amount,
          dateModified: new Date().toISOString(),
        })
        .where(eq(scrapMaterial.id, input.id));
    }),
});
