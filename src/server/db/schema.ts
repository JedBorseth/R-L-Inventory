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
  amount: integer("amount").notNull().default(0),
  inventoryThreshold: integer("inventoryThreshold").notNull(),
  maxInventoryThreshold: integer("maxInventoryThreshold").notNull(),
  width: integer("width").notNull(),
  length: integer("length").notNull(),
  CompanyUsedFor: text("CompanyUsedFor").$type<string[]>(),
  color: text("color", { enum: ["kraft", "white"] }),
  flute: text("flute", { enum: ["B", "C", "E", "F", "BC", "pt"] }),
  strength: integer("strength"),
  description: text("description"),
  dateAdded: text("dateAdded").default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text("dateModified").default(sql`(CURRENT_TIMESTAMP)`),
  sageId: text("sageId"),
});

export const scrapMaterial = sqliteTable("scrap_material", {
  id: integer("id").primaryKey().notNull().unique(),
  amount: integer("amount", { mode: "number" }).notNull(),
  width: integer("width").notNull(),
  length: integer("length").notNull(),
  CompanyUsedFor: text("CompanyUsedFor").$type<string[]>(),
  color: text("color", { enum: ["kraft", "white"] }),
  flute: text("flute", { enum: ["B", "C", "E", "F", "BC", "pt"] }),
  strength: integer("strength"),
  scored: integer("scored", { mode: "boolean" }),
  scoredAt: text("scoredAt", { mode: "json" }).$type<number[]>(),
  notes: text("notes"),
  dateAdded: text("dateAdded").default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text("dateModified").default(sql`(CURRENT_TIMESTAMP)`),
  sageId: text("sageId"),
});

export const finishedItems = sqliteTable("finished_items", {
  id: integer("id").primaryKey().notNull().unique(),
  width: integer("width").notNull(),
  length: integer("length").notNull(),
  depth: integer("length").notNull(),
  amount: integer("amount", { mode: "number" }).notNull(),
  amountPerPallet: integer("amountPerPallet"),
  description: text("description"),
  itemNum: text("itemNum"),
  inventoryThreshold: integer("inventoryThreshold").notNull(),
  maxInventoryThreshold: integer("maxInventoryThreshold").notNull(),
  companyId: text("companyId"),
  sageId: text("sageId"),
  color: text("color", { enum: ["kraft", "white"] }),
  flute: text("flute", { enum: ["B", "C", "E", "F", "BC", "pt"] }),
  strength: integer("strength"),
  dateAdded: text("dateAdded").default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text("dateModified").default(sql`(CURRENT_TIMESTAMP)`),
});
