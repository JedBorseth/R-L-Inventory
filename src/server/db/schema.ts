import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// export const countries = sqliteTable(
//   "countries",
//   {
//     id: integer("id").primaryKey(),
//     name: text("name"),
//   },
//   (countries) => ({
//     nameIdx: uniqueIndex("nameIdx").on(countries.name),
//   }),
// );

// export const cities = sqliteTable("cities", {
//   id: integer("id").primaryKey(),
//   name: text(""),
//   countryId: integer("country_id").references(() => countries.id),
// });

export const pallets = sqliteTable("pallets", {
  id: integer("id").primaryKey().notNull().unique(),
  amount: integer("amount").notNull().default(0),
  width: integer("width").notNull(),
  length: integer("length").notNull(),
  description: text("description"),
  block: integer("block", { mode: "boolean" }),
  used: integer("used", { mode: "boolean" }),
  heatTreated: integer("heatTreated", { mode: "boolean" }),
  sageId: text("sageId"),
  inventoryThreshold: integer("inventoryThreshold").notNull().default(100),
  dateAdded: text("dateAdded").default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text("dateModified").default(sql`(CURRENT_TIMESTAMP)`),
});

export const stockSheet = sqliteTable("stock_sheet", {
  id: integer("id").primaryKey().notNull().unique(),
  amount: integer("amount"),
  width: integer("width"),
  length: integer("length"),
  // id
  // count: number
  // width
  // length
  // usedFor: []string (company name)
  // color: kraft or white (default kraft)
  // flute:  B, C, E, F, BC, pt
  // strength: number
  // notes: string (optional)
  // dated added
  // dated modified
  // sageId (optional)
  // inventoryThreshold: number
  // maxInventoryThreshold: number
});

export const scrapMaterial = sqliteTable("scrap_material", {
  id: integer("id").primaryKey().notNull().unique(),
  amount: integer("amount", { mode: "number" }).notNull(),
  width: integer("width").notNull(),
  length: integer("length").notNull(),
  CompanyUsedFor: text("CompanyUsedFor"),
  color: text("color", { enum: ["kraft", "white"] }),
  flute: text("flute", { enum: ["B", "C", "E", "F", "BC", "pt"] }),
  strength: integer("strength"),
  scored: integer("scored", { mode: "boolean" }),
  scoredAt: text("text", { mode: "json" }).$type<number[]>(),
  notes: text("notes"),
  dateAdded: text("dateAdded").default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text("dateModified").default(sql`(CURRENT_TIMESTAMP)`),
  sageId: text("sageId"),
});

export const finishedItems = sqliteTable("finished_items", {
  id: integer("id").primaryKey().notNull().unique(),
  amount: integer("amount"),
  width: integer("width"),
  length: integer("length"),
  // id
  // count
  // width
  // length
  // depth
  // description
  // itemNum: string
  // companyId: string
  // sageId (optional)
  // inventoryThreshold: number
  // amountPerPallet: number (optional)
  // strength: number
  // flute:  B, C, E, F, BC, pt
  // color: kraft or white (default kraft)
  // dated added
  // dated modified
  // inventoryThreshold: number
  // maxInventoryThreshold: number
});

// store sft of every item in db, update every day, and store in db, seperate b c e bc and also stock and scrap
