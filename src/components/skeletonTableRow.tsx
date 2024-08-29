import React from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

const SkeletonTableRow = ({ rows, cols }: { rows: number; cols: number }) => {
  const rowArr = Array.from({ length: rows }, (_, i) => i);
  const colArr = Array.from({ length: cols }, (_, i) => i);

  return (
    <Table>
      <TableBody>
        {rowArr.map((_, index) => (
          <TableRow key={index}>
            <TableCell></TableCell>
            {colArr.map((_, index) => (
              <TableCell key={index}>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTableRow;
