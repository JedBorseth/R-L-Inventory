import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const palletRouter = createTRPCRouter({
  getAllPallets: protectedProcedure.query(() => {
    return db.query.pallets.findMany();
  }),
});
