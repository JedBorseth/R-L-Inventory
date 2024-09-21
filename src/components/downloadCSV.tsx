/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button } from "./ui/button";
import { File } from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { api } from "~/trpc/react";

const DownloadCSV = ({ type }: { type: string }) => {
  const data = api.all.queryEverything.useQuery();
  const generateCSV = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `${type}-export-${new Date().toLocaleDateString()}`,
    });
    const builtArray = () => {
      const filteredArr = data.data
        ?.map((item) => {
          if (item.type === type) {
            return Object.values(item);
          }
        })
        ?.filter(Boolean)[0];
      console.log(filteredArr);

      return filteredArr;
    };

    // THIS FILE HAS NO TYPESCRIPT
    // THIS AINT GOOD CODE

    const csv = generateCsv(csvConfig)(
      builtArray()?.map((item: any) => {
        if (type === "finishedItems")
          return {
            id: item.id,
            width: item.width ?? "",
            length: item.length ?? "",
            depth: item.depth ?? "",
            color: item.color ?? "",
            strength: item.strength ?? "",
            flute: item.flute ?? "",
            amount: item.amount ?? "",
            description: item.description ?? "",
            date: item.dateModified,
          };
        else
          return {
            id: item.id,
            width: item.width ?? "",
            length: item.length ?? "",
            color: item.color ?? "",
            strength: item.strength ?? "",
            flute: item.flute ?? "",
            amount: item.amount ?? "",
            description: item.description ?? "",
            date: item.dateModified,
          };
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
