"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
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
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const createStock = api.stock.create.useMutation({
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
    // createStock.mutate(data);
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

export const Edit = ({ id }: { id: number }) => {
  const data = api.finishedItems.getById.useQuery({ id: id });
  const FormSchema = z.object({
    amount: z.coerce.number({
      required_error: "Please specify amount",
      invalid_type_error: "Please enter a valid number",
    }),
    inventoryThreshold: z.coerce.number({
      required_error: "Please specify a minimum inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    maxInventoryThreshold: z.coerce.number({
      required_error: "Please specify a maximum inventory",
      invalid_type_error: "Please enter a valid number",
    }),
    width: z.coerce.number({
      required_error: "Please specify a width",
      invalid_type_error: "Please enter a valid number",
    }),
    length: z.coerce.number({
      required_error: "Please specify a length",
      invalid_type_error: "Please enter a valid number",
    }),
    CompanyUsedFor: z.coerce.string().array(),
    color: z.enum(["kraft", "white"], {
      invalid_type_error: "Please Enter a valid color",
      message: "Must be 'Kraft' or 'White'",
    }),
    flute: z.enum(["B", "C", "E", "F", "BC", "pt"], {
      required_error: "Please select a flute",
    }),
    strength: z.coerce.number({
      invalid_type_error: "Please enter a valid number",
    }),
    description: z.string().default(""),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      amount: data.data?.amount ?? 0,
      inventoryThreshold: data.data?.inventoryThreshold ?? 0,
      maxInventoryThreshold: data.data?.maxInventoryThreshold ?? 0,
      width: data.data?.width ?? 0,
      length: data.data?.length ?? 0,
      CompanyUsedFor: [],
      color: data.data?.color ?? "kraft",
      flute: data.data?.flute ?? "pt",
      strength: data.data?.strength ?? 0,
      description: data.data?.description ?? "",
    },
  });
  const router = useRouter();
  const createStock = api.stock.update.useMutation({
    onSuccess: async () => {
      form.reset();
      router.refresh();
      toast.success("Stock Item Updated", {
        description: "Stock sheet has been updated successfully.",
      });
      await data.refetch();
    },
    onError: (error) => {
      toast.error("Error Adding Stock Item", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createStock.mutate({ ...data, id });
  }
  const fieldArr = useFieldArray({
    control: form.control,
    name: "CompanyUsedFor" as never,
  });

  return (
    <Dialog>
      <DialogTrigger className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Edit
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full">
        <DialogTitle>Edit Stock Sheet</DialogTitle>
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
                        placeholder="Length"
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
                name="flute"
                render={({ field }) => (
                  <FormItem className="w-full space-y-3">
                    <FormLabel>Flute</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="B" />
                          </FormControl>
                          <FormLabel className="font-normal">B</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="C" />
                          </FormControl>
                          <FormLabel className="font-normal">C</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="E" />
                          </FormControl>
                          <FormLabel className="font-normal">E</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="F" />
                          </FormControl>
                          <FormLabel className="font-normal">F</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="BC" />
                          </FormControl>
                          <FormLabel className="font-normal">BC</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pt" />
                          </FormControl>
                          <FormLabel className="font-normal">PT</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="relative w-full px-2">
                <FormLabel>Associated Companies</FormLabel>
                <Button
                  type="button"
                  className="absolute right-0 top-0 h-2 w-2 p-2"
                  onClick={() => fieldArr.append("")}
                >
                  +
                </Button>
                <div className="flex max-h-20 flex-col gap-2 overflow-auto p-2 pr-4">
                  {fieldArr.fields.map(({ id }, index) => (
                    <Input
                      type="text"
                      required={false}
                      onDoubleClick={() => fieldArr.remove(index)}
                      defaultValue={fieldArr.fields.at(index)?.id}
                      placeholder="Company Name"
                      key={id}
                      {...form.register(`CompanyUsedFor.${index}`)}
                    />
                  ))}
                </div>
              </FormItem>
            </div>
            <div className="flex gap-10 max-sm:text-base">
              <FormField
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={data.data?.color ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select kraft of white" />
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
                name="strength"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Strength</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Strength"
                        type="number"
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
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Material count"
                        defaultValue={field.value}
                        type="number"
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
                        placeholder="Minimum Inventory"
                        defaultValue={field.value}
                        type="number"
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
                name="maxInventoryThreshold"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Max Inventory</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        placeholder="Max Amount"
                        defaultValue={field.value}
                        type="number"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        required={false}
                        defaultValue={field.value}
                        placeholder="Stock material description"
                        className=""
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