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
import { Suspense } from "react";
import { api } from "~/trpc/server";
import DeleteItem from "~/components/deleteItem";
import EditAmount from "~/components/editAmount";
import SkeletonTableRow from "~/components/skeletonTableRow";
import { formatNum, capsFirst } from "~/lib/utils";
import ViewDetailed from "~/components/viewDetailed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddFinishedItem, Edit } from "~/components/addFinishedItem";
import Link from "next/link";
import DownloadCSV from "~/components/downloadCSV";
import SendEmail from "~/components/sendEmail";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="max-md:hidden">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="awpl">AWPL</TabsTrigger>
            <TabsTrigger value="ck">CK</TabsTrigger>
            <TabsTrigger value="fvd">FVD</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
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
            {/* <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button> */}
            <DownloadCSV type="finishedItems" />
            <Dialog>
              <DialogTrigger className="inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-auto max-md:min-w-full">
                <DialogHeader>
                  <DialogTitle>Add New Finished Item</DialogTitle>
                </DialogHeader>
                <AddFinishedItem />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Suspense fallback={<SkeletonTableRow rows={3} cols={4} />}>
          <FinishedItemResults />
        </Suspense>
      </Tabs>
    </main>
  );
}

const FinishedItemResults = async () => {
  const all = await api.finishedItems.getLatest();
  const TabData = ({ tab }: { tab: string }) => {
    const getTabItems = () => {
      const awpl = all.filter((item) =>
        item.itemNum?.toUpperCase().includes("AWPL"),
      );
      const ck = all.filter((item) =>
        item.itemNum?.toUpperCase().includes("CK"),
      );
      const fvd = all.filter((item) =>
        item.itemNum?.toUpperCase().includes("FVD"),
      );
      const other = all.filter(
        (item) =>
          !item.itemNum?.toUpperCase().includes("AWPL") &&
          !item.itemNum?.toUpperCase().includes("CK") &&
          !item.itemNum?.toUpperCase().includes("FVD"),
      );
      if (tab === "all") return all;
      if (tab === "awpl") return awpl;
      if (tab === "ck") return ck;
      if (tab === "fvd") return fvd;
      if (tab === "other") return other;
      else return all;
    };
    return (
      <TabsContent value={tab}>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Finished Materials</CardTitle>
            <CardDescription>
              Manage your finished product from an easy to use interface.
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
                  <TableHead>Item No.</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Amount in use
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
                {all
                  ? getTabItems().map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Link href={`/dashboard/finishedItems/${result.id}`}>
                            <Image
                              alt="Product image"
                              className={`aspect-square rounded-md object-cover`}
                              height="50"
                              src={`https://dummyimage.com/50x50&text=${result.width}x${result.length}x${result.depth}`}
                              width="50"
                            />
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          <ViewDetailed
                            title={`${result.width}x${result.length}x${result.depth} | ${
                              result.companyId
                                ? String(result.companyId).split(",")[0]
                                : `${result.strength}${result.flute}`
                            }`}
                          >
                            <>
                              <p className="space-y-2">
                                {result.width}x{result.length}x{result.depth} |{" "}
                                {result.strength}
                                {result.flute} {result.companyId}
                              </p>
                              <p className="space-y-2">
                                Item Number:{result.itemNum}
                              </p>
                              <p className="space-y-2">
                                {result.amountPerPallet} per pallet
                              </p>

                              <p className="space-y-2">
                                {capsFirst(result.color ?? "")}
                              </p>
                              <p className="space-y-2">
                                Min:{result.inventoryThreshold}
                              </p>
                              <p className="space-y-2">
                                Max:{result.maxInventoryThreshold}
                              </p>

                              <p className="space-y-2">
                                Current:{result.amount}
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
                              <p className="space-y-2">{result.description}</p>
                            </>
                          </ViewDetailed>
                          {result.inventoryThreshold >= result.amount ? (
                            <SendEmail item={result} />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{result.itemNum}</Badge>
                        </TableCell>
                        <TableCell>
                          <EditAmount
                            result={{ ...result, block: null }}
                            type="finishedItem"
                          />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">
                            <EditAmount
                              result={{ ...result, block: null }}
                              type="prodFinishedItem"
                            />
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(result.dateModified ?? "").toDateString()}
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
                              <Edit id={result.id} />
                              <DeleteItem id={result.id} type="finishedItem" />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{getTabItems().length}</strong> finished products.
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    );
  };
  return (
    <>
      <TabData tab="all" />
      <TabData tab="awpl" />
      <TabData tab="ck" />
      <TabData tab="fvd" />
      <TabData tab="other" />
    </>
  );
};
