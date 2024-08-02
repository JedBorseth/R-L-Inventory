import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";

export const getScrapMaterial = async () => {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  const results = await db.query.scrapMaterial.findMany({ limit: 10 });
  return results;
};

export const getPallets = async () => {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  const results = await db.query.pallets.findMany({ limit: 10 });
  return results;
};
