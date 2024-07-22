import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "~/server/db";
import AddPallet from "~/components/addPallet";

export default async function Dashboard() {
  const results = await db.query.pallets.findMany();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dw">DW</TabsTrigger>
            <TabsTrigger value="c">C Flute</TabsTrigger>
            <TabsTrigger value="b">B Flute</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Kraft
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>White</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Other Filters
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export csv
              </span>
            </Button>
            <AddPallet />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Pallet Tracker</CardTitle>
              <CardDescription>
                Manage pallet inventory and track pallet usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Heat Treated
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Modified
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className={`aspect-square rounded-md object-cover ${result.inventoryThreshold > result.amount ? "border border-destructive" : ""}`}
                          height="50"
                          src={`https://dummyimage.com/50x50&text=${result.width}x${result.length}`}
                          width="50"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.width}x{result.length}{" "}
                        {result.block ? "Block" : ""}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {result.used ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.amount}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {result.heatTreated ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(
                          result.dateModified ?? "",
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of{" "}
                <strong>{results.length}</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
