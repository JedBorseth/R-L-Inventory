import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const SEARCH_RESULT_LIMIT = 12;

type SearchResult = {
  id: number;
  type: "stock" | "scrap" | "pallet";
  label: string;
  description: string;
  href: string;
  dateModified: string | null;
  searchText: string;
};

const normalize = (value: unknown) => {
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "boolean") return value ? "yes true" : "no false";
  return String(value ?? "");
};

const toSearchText = (values: unknown[]) =>
  values.map(normalize).join(" ").toLowerCase();

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
  queryEverything: protectedProcedure.query(async ({ ctx }) => {
    const stock = await ctx.db.query.stockSheet.findMany();
    const scrap = await ctx.db.query.scrapMaterial.findMany();
    const pallets = await ctx.db.query.pallets.findMany();
    const finishedItems = await ctx.db.query.finishedItems.findMany();

    return [
      { type: "stock", ...stock },
      { type: "scrap", ...scrap },
      { type: "pallets", ...pallets },
      { type: "finishedItems", ...finishedItems },
    ];
  }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = input.query.toLowerCase();
      const [stock, scrap, pallets] = await Promise.all([
        ctx.db.query.stockSheet.findMany(),
        ctx.db.query.scrapMaterial.findMany(),
        ctx.db.query.pallets.findMany(),
      ]);

      const stockResults: SearchResult[] = stock.map((item) => {
        const dimensions = `${item.width}x${item.length}`;
        const flute = `${item.strength ?? ""}${item.flute ?? ""}`;

        return {
          id: item.id,
          type: "stock",
          label:
            item.descriptionAsTitle && item.description
              ? item.description
              : `${dimensions} Stock Sheet`,
          description: [flute, item.color, item.CompanyUsedFor?.[0]]
            .filter(Boolean)
            .join(" | "),
          href: `/dashboard/stock/${item.id}`,
          dateModified: item.dateModified,
          searchText: toSearchText([
            "stock",
            "stock sheet",
            dimensions,
            item.width,
            item.length,
            flute,
            item.flute,
            item.color,
            item.CompanyUsedFor,
            item.description,
            item.sageId,
            item.amount,
          ]),
        };
      });

      const scrapResults: SearchResult[] = scrap.map((item) => {
        const dimensions = `${item.width}x${item.length}`;
        const flute = `${item.strength ?? ""}${item.flute ?? ""}`;

        return {
          id: item.id,
          type: "scrap",
          label: `${dimensions} Scrap Material`,
          description: [flute, item.color, item.CompanyUsedFor?.[0]]
            .filter(Boolean)
            .join(" | "),
          href: `/dashboard/scrap/${item.id}`,
          dateModified: item.dateModified,
          searchText: toSearchText([
            "scrap",
            "scrap material",
            dimensions,
            item.width,
            item.length,
            flute,
            item.flute,
            item.color,
            item.CompanyUsedFor,
            item.notes,
            item.sageId,
            item.amount,
            item.scored,
            item.scoredAt,
          ]),
        };
      });

      const palletResults: SearchResult[] = pallets.map((item) => {
        const dimensions = `${item.width}x${item.length}`;

        return {
          id: item.id,
          type: "pallet",
          label: `${dimensions} ${item.block ? "Block " : ""}Pallet`,
          description: [
            item.used ? "Used" : "New",
            item.heatTreated ? "Heat Treated" : null,
          ]
            .filter(Boolean)
            .join(" | "),
          href: "/dashboard/pallets",
          dateModified: item.dateModified,
          searchText: toSearchText([
            "pallet",
            "pallets",
            dimensions,
            item.width,
            item.length,
            item.description,
            item.sageId,
            item.amount,
            item.block ? "block" : "standard",
            item.used ? "used" : "new",
            item.heatTreated ? "heat treated" : "not heat treated",
          ]),
        };
      });

      return [...stockResults, ...scrapResults, ...palletResults]
        .filter((item) => item.searchText.includes(query))
        .sort(
          (a, b) =>
            new Date(b.dateModified ?? 0).getTime() -
            new Date(a.dateModified ?? 0).getTime(),
        )
        .slice(0, SEARCH_RESULT_LIMIT)
        .map(({ searchText: _searchText, ...result }) => result);
    }),
});
