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
import { MoreHorizontal } from "lucide-react";
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
  type ScrapDataExcludingNull = Exclude<typeof scrap.data, null | undefined>;
  type ScrapDataWithWaste = ScrapDataExcludingNull;
  const [items, setItems] = useState<ScrapDataWithWaste>([]);
  const scrap = api.scrap.getLatest.useQuery();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const arr: SetStateAction<typeof scrap.data> = [];
    scrap.data?.forEach((scrap) => {
      if (data.width > scrap.width || data.length > scrap.length) return;
      if (data.flute && data.flute !== scrap.flute) return;
      const wOut = scrap.width / data.width;
      const lOut = scrap.length / data.length;
      const wWaste = scrap.width - Math.floor(wOut) * data.width;
      const lWaste = scrap.length - Math.floor(lOut) * data.length;
      const sheetsNeeded = Math.ceil(data.amount / (wOut * lOut));
      if (sheetsNeeded > scrap.amount) return;
      console.log(
        scrap,
        `For this box, you will waste ${wWaste * lWaste * data.amount}sft of material. you will also need ${sheetsNeeded} sheets of material.`,
      );
      arr.push({ ...scrap });
    });
    setItems(arr);
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
                        Material Needed
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
                          <Badge variant="outline">10%</Badge>
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
          </>
        )}
      </div>
    </main>
  );
}