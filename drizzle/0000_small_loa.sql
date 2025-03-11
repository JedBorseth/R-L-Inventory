CREATE TABLE `finished_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`width` integer NOT NULL,
	`length` integer NOT NULL,
	`depth` integer NOT NULL,
	`amount` integer NOT NULL,
	`prodAmount` integer NOT NULL,
	`amountPerPallet` integer,
	`description` text,
	`itemNum` text,
	`inventoryThreshold` integer NOT NULL,
	`maxInventoryThreshold` integer NOT NULL,
	`companyId` text,
	`sageId` text,
	`color` text,
	`flute` text,
	`strength` integer,
	`dateAdded` text DEFAULT (CURRENT_TIMESTAMP),
	`dateModified` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `pallets` (
	`id` integer PRIMARY KEY NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`width` integer NOT NULL,
	`length` integer NOT NULL,
	`description` text,
	`block` integer,
	`used` integer,
	`heatTreated` integer,
	`sageId` text,
	`inventoryThreshold` integer DEFAULT 100 NOT NULL,
	`dateAdded` text DEFAULT (CURRENT_TIMESTAMP),
	`dateModified` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `scrap_material` (
	`id` integer PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`width` integer NOT NULL,
	`length` integer NOT NULL,
	`CompanyUsedFor` text,
	`color` text,
	`flute` text,
	`strength` integer,
	`scored` integer,
	`scoredAt` text,
	`notes` text,
	`dateAdded` text DEFAULT (CURRENT_TIMESTAMP),
	`dateModified` text DEFAULT (CURRENT_TIMESTAMP),
	`sageId` text
);
--> statement-breakpoint
CREATE TABLE `stock_sheet` (
	`id` integer PRIMARY KEY NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`inventoryThreshold` integer NOT NULL,
	`maxInventoryThreshold` integer NOT NULL,
	`width` integer NOT NULL,
	`length` integer NOT NULL,
	`CompanyUsedFor` text,
	`color` text,
	`flute` text,
	`strength` integer,
	`description` text,
	`descriptionAsTitle` integer DEFAULT 0 NOT NULL,
	`dateAdded` text DEFAULT (CURRENT_TIMESTAMP),
	`dateModified` text DEFAULT (CURRENT_TIMESTAMP),
	`sageId` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finished_items_id_unique` ON `finished_items` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `pallets_id_unique` ON `pallets` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `scrap_material_id_unique` ON `scrap_material` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `stock_sheet_id_unique` ON `stock_sheet` (`id`);