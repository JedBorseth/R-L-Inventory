import algoliasearch from "algoliasearch";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const allRouter = createTRPCRouter({
  getTotals: protectedProcedure.query(async ({ ctx }) => {
    const stock = await ctx.db.query.stockSheet.findMany();
    const scrap = await ctx.db.query.scrapMaterial.findMany();
    const pallets = await ctx.db.query.pallets.findMany();
    return {
      stock: stock.length,
      scrap: scrap.length,
      pallets: pallets.length,
    };
  }),
  queryEverything: publicProcedure.query(async ({ ctx }) => {
    const stock = await ctx.db.query.stockSheet.findMany();
    const scrap = await ctx.db.query.scrapMaterial.findMany();
    const pallets = await ctx.db.query.pallets.findMany();
    return {
      ...stock,
      ...scrap,
      ...pallets,
    };
  }),
});
