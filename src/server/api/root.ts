import { palletRouter } from "~/server/api/routers/pallets";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { stockRouter } from "./routers/stock";
import { scrapRouter } from "./routers/scrap";
import { allRouter } from "./routers/all";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pallet: palletRouter,
  stock: stockRouter,
  scrap: scrapRouter,
  all: allRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
