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
    const builtArray = data.data?.map((item) => {
      item.type = type;
      return item;
    });
    console.log(builtArray);

    const csv = generateCsv(csvConfig)([{ test: "test" }]);
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
