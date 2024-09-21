"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";

import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export const AddFinishedItem = () => {
  const FormSchema = z.object({
    width: z.coerce.number({
      required_error: "Please specify a width",
      invalid_type_error: "Please enter a valid number",
    }),
    length: z.coerce.number({
      required_error: "Please specify a length",
      invalid_type_error: "Please enter a valid number",
    }),
    depth: z.coerce.number({
      required_error: "Please specify a depth",
      invalid_type_error: "Please enter a valid number",
    }),
    amount: z.coerce.number({
      required_error: "Please specify an amount",
      invalid_type_error: "Please enter a valid number",
    }),
    description: z.string().nullable().optional(),
    flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
    color: z.enum(["kraft", "white"], {
      required_error: "Please select a color",
      invalid_type_error: "Please select a color",
    }),
    strength: z.coerce.number({
      required_error: "Please specify a strength",
      invalid_type_error: "Please enter a valid number",
    }),
    inventoryThreshold: z.coerce.number({
      required_error: "Please specify a min inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    maxInventoryThreshold: z.coerce.number({
      required_error: "Please specify a max inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    itemNum: z.string({
      required_error: "Please specify an item number",
      invalid_type_error: "Please enter a valid item number",
    }),
    amountPerPallet: z.coerce.number({
      required_error: "Please specify amount per pallet",
      invalid_type_error: "Please enter a valid number",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const createFinishedItem = api.finishedItems.create.useMutation({
    onSuccess: () => {
      router.refresh();
      form.reset();
      toast.success("Pallet Added", {
        description: "Pallet has been added successfully.",
      });
    },
    onError: (error) => {
      toast.error("Error Adding Pallet", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    createFinishedItem.mutate(data);
  }
  const fieldArr = useFieldArray({
    control: form.control,
    name: "CompanyUsedFor" as never,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 max-sm:text-base"
      >
        <div className="flex gap-10 max-sm:text-base">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Width"
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
              <FormItem className="w-full">
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Length"
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
            name="depth"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Depth</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Depth"
                    type="text"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-10 max-sm:text-base">
          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Strength"
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
            name="flute"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel>Flute</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Pick flute type"
                        defaultValue={field.value ?? ""}
                      />
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
        </div>
        <div className="flex gap-10 max-sm:text-base">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Amount"
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
            name="inventoryThreshold"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Min Inventory</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Low Inventory Threshold"
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
            name="maxInventoryThreshold"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Max Inventory</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Max Inventory Threshold"
                    type="text"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-10 max-sm:text-base">
          <FormField
            control={form.control}
            name="itemNum"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Item No.</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Item Number"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amountPerPallet"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Per Pallet</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Total Amount Per Pallet"
                    type="text"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-10 max-sm:text-base">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Kraft or White"
                        defaultValue={field.value ?? ""}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kraft">Kraft</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="h-min w-2/3">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="resize-none"
                    onChange={field.onChange}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.formState.isValid ? (
          <DialogClose type="submit" asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        ) : (
          <Button type="submit">Submit</Button>
        )}
        <Button
          type="reset"
          onClick={() => form.reset()}
          variant="outline"
          className=" ml-2"
        >
          Reset
        </Button>
      </form>
    </Form>
  );
};

export const Edit = ({ id, button }: { id: number; button?: boolean }) => {
  const data = api.finishedItems.getById.useQuery({ id: id });
  const FormSchema = z.object({
    width: z.coerce.number({
      required_error: "Please specify a width",
      invalid_type_error: "Please enter a valid number",
    }),
    length: z.coerce.number({
      required_error: "Please specify a length",
      invalid_type_error: "Please enter a valid number",
    }),
    depth: z.coerce.number({
      required_error: "Please specify a depth",
      invalid_type_error: "Please enter a valid number",
    }),
    amount: z.coerce.number({
      required_error: "Please specify an amount",
      invalid_type_error: "Please enter a valid number",
    }),
    description: z.string().nullable().optional(),
    flute: z.enum(["B", "C", "E", "F", "BC", "pt"]),
    color: z.enum(["kraft", "white"], {
      required_error: "Please select a color",
      invalid_type_error: "Please select a color",
    }),
    strength: z.coerce.number({
      required_error: "Please specify a strength",
      invalid_type_error: "Please enter a valid number",
    }),
    inventoryThreshold: z.coerce.number({
      required_error: "Please specify a min inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    maxInventoryThreshold: z.coerce.number({
      required_error: "Please specify a max inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    itemNum: z.string({
      required_error: "Please specify an item number",
      invalid_type_error: "Please enter a valid item number",
    }),
    amountPerPallet: z.coerce.number({
      required_error: "Please specify amount per pallet",
      invalid_type_error: "Please enter a valid number",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      amount: data.data?.amount ?? 0,
      inventoryThreshold: data.data?.inventoryThreshold ?? 0,
      maxInventoryThreshold: data.data?.maxInventoryThreshold ?? 0,
      width: data.data?.width ?? 0,
      length: data.data?.length ?? 0,
      depth: data.data?.depth ?? 0,
      color: data.data?.color ?? "kraft",
      flute: data.data?.flute ?? "pt",
      strength: data.data?.strength ?? 0,
      description: data.data?.description ?? "",
      itemNum: data.data?.itemNum ?? "",
      amountPerPallet: data.data?.amountPerPallet ?? 0,
    },
  });
  const router = useRouter();
  const updateFinishedItem = api.finishedItems.update.useMutation({
    onSuccess: async () => {
      form.reset();
      router.refresh();
      toast.success("finished Item Updated", {
        description: "finished Item has been updated successfully.",
      });
      await data.refetch();
    },
    onError: (error) => {
      toast.error("Error Adding finished Item", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateFinishedItem.mutate({ ...data, id });
  }

  return (
    <Dialog>
      <DialogTrigger
        className={
          button
            ? "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            : "flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        }
      >
        Edit
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full">
        <DialogTitle>Edit finishedItem Sheet</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 max-sm:text-base"
          >
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Width"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
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
                  <FormItem className="w-full">
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Length"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Depth</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Depth"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                control={form.control}
                name="strength"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Strength</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Strength"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flute"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel>Flute</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Pick flute type"
                            defaultValue={field.value ?? ""}
                          />
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
            </div>
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Amount"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inventoryThreshold"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Min Inventory</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Low Inventory Threshold"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxInventoryThreshold"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Max Inventory</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Max Inventory Threshold"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                control={form.control}
                name="itemNum"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Item No.</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Item Number"
                        type="text"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountPerPallet"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Per Pallet</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Total Amount Per Pallet"
                        type="text"
                        inputMode="numeric"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Kraft or White"
                            defaultValue={field.value ?? ""}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kraft">Kraft</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="h-min w-2/3">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        className="resize-none"
                        onChange={field.onChange}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.isValid ? (
              <DialogClose type="submit" asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            ) : (
              <Button type="submit">Submit</Button>
            )}
            <Button
              type="reset"
              onClick={() => form.reset()}
              variant="outline"
              className=" ml-2"
            >
              Reset
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
