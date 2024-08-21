/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button } from "./ui/button";
import { File } from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { customCSVOrder } from "~/lib/utils";
import { api } from "~/trpc/react";

const DownloadCSV = () => {
  // I am making a new db call here and I don't like it
  // react query should be caching this data so it should be fine but its yucky
  const data = api.scrap.getLatest.useQuery();
  const generateCSV = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `scrap-export-${new Date().toLocaleDateString()}`,
    });
    const csv = generateCsv(csvConfig)(
      data.data?.map((item) => {
        return customCSVOrder({
          color: item.color ?? "",
          ect: item.strength?.toString() ?? "",
          flute: item.flute ?? "",
          length: item.length,
          type: "Stock",
          width: item.width,
          date: item.dateModified ?? "",
        });
      }) ?? [],
    );
    return { csv, csvConfig };
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7 gap-1"
      onClick={() => {
        const { csv, csvConfig } = generateCSV();
        download(csvConfig)(csv);
      }}
    >
      <File className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Export
      </span>
    </Button>
  );
};

export default DownloadCSV;
