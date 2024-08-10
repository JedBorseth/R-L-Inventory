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
import React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
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

const AddScrap = () => {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Product
        </span>
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full">
        <DialogHeader>
          <DialogTitle>Add New Scrap Material</DialogTitle>
        </DialogHeader>
        <ScrapForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddScrap;

export const ScrapForm = () => {
  const FormSchema = z.object({
    amount: z.coerce.number({
      required_error: "Please specify amount",
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
    scored: z.boolean(),
    scoredAt: z.array(z.number()),
    description: z.string().default(""),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      scoredAt: [],
      scored: false,
    },
    resolver: zodResolver(FormSchema),
  });
  console.log(form.formState.errors);
  const router = useRouter();
  const createScrap = api.scrap.create.useMutation({
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
    createScrap.mutate(data);
  }
  const fieldArr = useFieldArray({
    control: form.control,
    name: "CompanyUsedFor" as never,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex gap-10">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="width"
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
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="length"
                    type="number"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <FormField
            control={form.control}
            name="flute"
            render={({ field }) => (
              <FormItem className="space-y-3 md:max-w-40">
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
          <FormItem className="relative space-y-3">
            <FormLabel>Associated Companies</FormLabel>
            <Button
              type="button"
              className="absolute right-0 top-0 h-2 w-2 p-2"
              onClick={() => fieldArr.append({ value: "" })}
            >
              +
            </Button>
            <div className="flex max-h-20 flex-col gap-2 overflow-auto p-2 pr-4">
              {fieldArr.fields.map(({ id }) => (
                <Input
                  type="text"
                  placeholder="Company Name"
                  key={id}
                  {...form.register(`CompanyUsedFor.${Number(id)}`)}
                />
              ))}
            </div>
          </FormItem>
        </div>
        <div className="flex gap-10">
          <FormField
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    style={{ textTransform: "lowercase" }}
                    onChange={field.onChange}
                    placeholder="White/Kraft"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
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
        <div className="flex gap-10">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    placeholder="Material count"
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
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    required={false}
                    placeholder="Scrap material description"
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <FormItem>
          <Label htmlFor="scoreInput" className="space-y-2">
            Scores: {scoreArr.map((score) => `${score}, `)}
          </Label>
          <Input
            id="scoreInput"
            onChange={(e) => {
              setScoreArr(
                e.target.value.split(",").map((score) => parseInt(score)),
              );
            }}
          />

          <input
            {...form.register("scoredAt")}
            className="hidden"
            value={scoreArr.map((score) => score.toString())}
          />
          <input
            {...form.register("scored")}
            className="hidden"
            value={scoreArr.length > 0 ? 1 : 0}
          />
          <FormMessage />
        </FormItem> */}
        {form.formState.isValid ? (
          <DialogClose type="submit" asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
};
