import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";
import { db } from "~/server/db";
export async function GET() {
  const records = await db.query.pallets.findMany();
  const client = algoliasearch(
    "MY851Z8XV6",
    "36a8e6e2212a0c8c3300afc18c40486e",
  );
  const palletIndex = client.initIndex("pallets");

  await palletIndex.saveObjects(records);
  return NextResponse.json({ ok: true });
}
