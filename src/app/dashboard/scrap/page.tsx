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
import { Suspense } from "react";
import AddScrap from "~/components/addScrap";
import DeleteItem from "~/components/deleteItem";
import SkeletonTableRow from "~/components/skeletonTableRow";
import EditAmount from "~/components/editAmount";
import DownloadCSV from "~/components/downloadCSV";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="max-md:hidden">
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
            <DownloadCSV />
            <AddScrap />
          </div>
        </div>
        <TabsContent value="all">
          <Suspense fallback={<ScrapSkeleton />}>
            <ScrapResults />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}

const ScrapResults = async () => {
  const results = await api.scrap.getLatest();
  return (
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
            <>
              {results
                ? results.map((result) => (
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
                        {result.width}x{result.length} |{" "}
                        {result.CompanyUsedFor
                          ? String(result.CompanyUsedFor).split(",")[0]
                          : `${result.strength}${result.flute}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {result.color === "white" ? "White" : "Kraft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
          Showing <strong>all</strong> scrap material of <strong>all</strong>{" "}
          types.
        </div>
      </CardFooter>
    </Card>
  );
};

const ScrapSkeleton = () => {
  return (
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
  );
};
