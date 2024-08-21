import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const allRouter = createTRPCRouter({
  getEverything: protectedProcedure.query(async ({ ctx }) => {
    const stock = await ctx.db.query.stockSheet.findMany();
    const scrap = await ctx.db.query.scrapMaterial.findMany();
    const pallets = await ctx.db.query.pallets.findMany();

    return {
      stats: {
        stock: stock.length,
        scrap: scrap.length,
        pallets: pallets.length,
      },
      stock,
      scrap,
      pallets,
    };
  }),
});
