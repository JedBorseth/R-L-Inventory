"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { type SetStateAction, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Image from "next/image";
import ViewDetailed from "~/components/viewDetailed";
import { capsFirst } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import EditAmount from "~/components/editAmount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Undo2 } from "lucide-react";
import { Edit } from "~/components/addScrap";
import DeleteItem from "~/components/deleteItem";

const FormSchema = z.object({
  flute: z.enum(["B", "C", "E", "F", "BC", "pt"]).nullable().optional(),
  strength: z.coerce
    .number({
      required_error: "Please enter a valid number.",
      invalid_type_error: "Please enter a valid number.",
    })
    .nullable()
    .optional(),
  width: z.coerce.number({
    required_error: "Please enter a valid number.",
    invalid_type_error: "Please enter a valid number.",
  }),
  length: z.coerce.number({
    required_error: "Please enter a valid number.",
    invalid_type_error: "Please enter a valid number.",
  }),
  amount: z.coerce.number({
    required_error: "Please enter a valid number.",
    invalid_type_error: "Please enter a valid number.",
  }),
});

const Req = () => {
  return <span className="text-red-500">*</span>;
};

export default function WasteCalc() {
  type ScrapDataWithWaste = Array<
    Exclude<typeof scrap.data, null | undefined>[number] & {
      waste: { percent: number; materialNeeded: number; amountOut: number };
    }
  >;
  const [items, setItems] = useState<ScrapDataWithWaste>([]);
  const scrap = api.scrap.getLatest.useQuery();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(input: z.infer<typeof FormSchema>) {
    const arr: ScrapDataWithWaste = [];
    scrap.data?.forEach((savedItem) => {
      if (input.width > savedItem.width || input.length > savedItem.length)
        return;
      if (input.flute && input.flute !== savedItem.flute) return;
      const wOut = savedItem.width / input.width;
      const lOut = savedItem.length / input.length;
      const wWaste = Math.floor(wOut) * input.width - savedItem.width;
      const lWaste = Math.floor(lOut) * input.length - savedItem.length;
      const sheetsNeeded = Math.ceil(input.amount / (wOut * lOut));

      const percent = ((wWaste * lWaste) / (input.width * input.length)) * 100;
      arr.push({
        ...savedItem,
        waste: {
          percent: percent,
          materialNeeded: sheetsNeeded,
          amountOut: Math.floor(wOut) * Math.floor(lOut),
        },
      });
    });
    setItems(arr);
    if (arr.length === 0) {
      toast.error("No items found that match the criteria");
    }
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="relative h-60">
        {items.length > 0 ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-center gap-2 p-10"
            >
              <h3 className="text-3xl font-semibold leading-none tracking-tight">
                Search Parameters
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter the details of the scrap material you are looking for.
              </p>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="flute"
                  render={({ field }) => (
                    <FormItem className="w-3/12">
                      <FormLabel>Flute</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick flute type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BC">DW</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="pt">PT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strength"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          defaultValue={field.value ?? ""}
                          placeholder="Enter strength"
                          type="number"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>
                        Width
                        <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Enter width"
                          type="text"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormLabel>
                        Length
                        <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Enter width"
                          type="text"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>
                        Amount<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Enter amount"
                          type="number"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex gap-4">
                <Button className="w-1/2" type="submit">
                  Search
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.reset();
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        )}

        {items.length > 0 && (
          <>
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
                      <TableHead className="hidden md:table-cell">
                        Waste %
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Sheets Needed
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((result) => (
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
                            {String(result.waste.percent).substring(0, 4)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.waste.materialNeeded} (+5%){" "}
                          {String(result.waste.materialNeeded * 1.05).substring(
                            0,
                            3,
                          )}
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>all</strong> scrap items that are{" "}
                  <strong>able</strong> to be used.
                </div>
              </CardFooter>
            </Card>
            <Button
              className="mt-4"
              onClick={() => {
                setItems([]);
              }}
            >
              <Undo2 /> Back
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
