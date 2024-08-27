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
import { api } from "~/trpc/server";
import { Suspense, useState } from "react";
import AddScrap, { Edit } from "~/components/addScrap";
import DeleteItem from "~/components/deleteItem";
import SkeletonTableRow from "~/components/skeletonTableRow";
import EditAmount from "~/components/editAmount";
import DownloadCSV from "~/components/downloadCSV";
import ViewDetailed from "~/components/viewDetailed";
import { capsFirst } from "~/lib/utils";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="max-md:hidden">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bc">DW</TabsTrigger>
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
            <DownloadCSV />
            <AddScrap />
          </div>
        </div>
        <Suspense fallback={<ScrapSkeleton />}>
          <ScrapResults />
        </Suspense>
      </Tabs>
    </main>
  );
}

const ScrapResults = async () => {
  const all = await api.scrap.getLatest();

  const TabData = ({ tab }: { tab: string }) => {
    const getTabItems = () => {
      const bc = all.filter((item) => item.flute === "BC");
      const c = all.filter((item) => item.flute === "C");
      const b = all.filter((item) => item.flute === "B");
      if (tab === "all") return all;
      if (tab === "bc") return bc;
      if (tab === "c") return c;
      if (tab === "b") return b;
      else return all;
    };

    return (
      <TabsContent value={tab}>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Scrap Material</CardTitle>
            <CardDescription>
              Manage scrap material inventory and track usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Scored</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Modified
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <>
                  {all
                    ? getTabItems().map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className={`aspect-square rounded-md object-cover`}
                              height="50"
                              src={`https://dummyimage.com/50x50&text=${result.width}x${result.length}`}
                              width="50"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <ViewDetailed
                              title={`${result.width}x${result.length} |${" "}
                    ${
                      result.CompanyUsedFor
                        ? String(result.CompanyUsedFor).split(",")[0]
                        : `${result.strength}${result.flute}`
                    }`}
                            >
                              <>
                                <p className="space-y-2">
                                  {result.width}x{result.length} |{" "}
                                  {result.strength}
                                  {result.flute} {result.CompanyUsedFor}
                                </p>
                                <p className="space-y-2">
                                  {capsFirst(result.color ?? "")}
                                </p>
                                <p className="space-y-2">
                                  Scored: {result.scored ? "Yes" : "No"}
                                </p>

                                <p className="space-y-2">
                                  Amount :{result.amount}
                                </p>
                                <p className="space-y-2">
                                  Addded:{" "}
                                  {new Date(
                                    result.dateAdded ?? "",
                                  ).toDateString()}
                                </p>
                                <p className="space-y-2">
                                  Modified Last:{" "}
                                  {new Date(
                                    result.dateModified ?? "",
                                  ).toDateString()}
                                </p>
                                <p className="space-y-2">
                                  Description: {result.notes}
                                </p>
                              </>
                            </ViewDetailed>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-center text-sm"
                            >
                              {result.strength}
                              {result.flute} - {capsFirst(result.color ?? "")}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-0 md:px-4">
                            <EditAmount
                              result={{ ...result, block: null }}
                              type="scrap"
                            />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {result.scored ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(result.dateModified ?? "").toDateString()}{" "}
                          </TableCell>
                          <TableCell className="px-0 md:px-4">
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
                                <Edit id={result.id} />
                                <DeleteItem id={result.id} type="scrap" />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{getTabItems().length}</strong> scrap material(s)
              of <strong>{tab.toUpperCase()}</strong> types.
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    );
  };
  return (
    <>
      <TabData tab="all" />
      <TabData tab="bc" />
      <TabData tab="c" />
      <TabData tab="b" />
    </>
  );
};

const ScrapSkeleton = () => {
  return (
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Scrap Material</CardTitle>
          <CardDescription>
            Manage scrap material inventory and track usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Flute</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Scored</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Modified
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SkeletonTableRow rows={3} cols={4} />
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>all</strong> scrap material of <strong>all</strong>{" "}
            types.
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
