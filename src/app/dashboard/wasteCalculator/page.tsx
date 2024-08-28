"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useState } from "react";

const FormSchema = z.object({
  flute: z.string({
    required_error: "Please select a flute type.",
  }),
  strength: z.coerce.number({
    required_error: "Please enter a valid number.",
    invalid_type_error: "Please enter a valid number.",
  }),
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

export default function WasteCalc() {
  const [step, setStep] = useState(1);
  const steps = 3;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Data", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <main className="min-h-screen w-full">
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {step === 1 ? (
              <div>
                <h3 className="w-full text-2xl font-bold tracking-tight">
                  Flute And Strength.
                </h3>
                <FormField
                  control={form.control}
                  name="flute"
                  render={({ field }) => (
                    <FormItem className="w-3/12">
                      <FormLabel>Flute</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick flute type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dw">DW</SelectItem>
                          <SelectItem value="b">B</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="e">E</SelectItem>
                          <SelectItem value="f">F</SelectItem>
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
                          defaultValue={field.value}
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
            ) : null}
            {step === 2 ? (
              <div>
                <h3 className="w-full text-2xl font-bold tracking-tight">
                  Width & Length.
                </h3>
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Width</FormLabel>
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
                    <FormItem className="w-1/2">
                      <FormLabel>Length</FormLabel>
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
            ) : null}
            {step === 3 ? (
              <div>
                <h3 className="w-full text-2xl font-bold tracking-tight">
                  Quantity.
                </h3>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Amount</FormLabel>
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
            ) : null}
            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>

        {step === 1 ? null : (
          <Button
            className="mt-4"
            type="submit"
            onClick={() => {
              if (step === 1) return;
              setStep(step - 1);
            }}
          >
            Back
          </Button>
        )}
        <Button
          className="mt-4"
          type="submit"
          onClick={() => {
            if (step === steps) return;
            setStep(step + 1);
          }}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
