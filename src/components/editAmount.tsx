"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  amount: z.coerce.number(),
});

const EditAmount = ({
  type,
  result,
}: {
  result: {
    amount: number;
    prodAmount?: number;
    id: number;
    block: boolean | null;
    width: number;
    length: number;
  };
  type: "pallet" | "scrap" | "stock" | "finishedItem" | "prodFinishedItem";
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: type === "prodFinishedItem" ? result.prodAmount : result.amount,
    },
  });
  const router = useRouter();

  const mutatePallet = api.pallet.updateAmount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Pallet Amount Updated", {
        description: `The pallet amount has been updated from ${result.amount} to ${form.getValues("amount")}`,
      });
    },
    onError: (error) => {
      toast.error("Error updating pallet amount", {
        description: error.message,
      });
    },
  });
  const mutateScrap = api.scrap.updateAmount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Scrap Amount Updated", {
        description: `The scrap material amount has been updated from ${result.amount} to ${form.getValues("amount")}`,
      });
    },
    onError: (error) => {
      toast.error("Error updating pallet amount", {
        description: error.message,
      });
    },
  });
  const mutateStock = api.stock.updateAmount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Scrap Amount Updated", {
        description: `The scrap material amount has been updated from ${result.amount} to ${form.getValues("amount")}`,
      });
    },
    onError: (error) => {
      toast.error("Error updating pallet amount", {
        description: error.message,
      });
    },
  });
  const mutateFinishedItem = api.finishedItems.updateAmount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Finished Item Amount Updated", {
        description: `The item amount has been updated from ${result.amount} to ${form.getValues("amount")}`,
      });
    },
    onError: (error) => {
      toast.error("Error updating product amount", {
        description: error.message,
      });
    },
  });
  const mutateProdFinishedItem = api.finishedItems.updateAmount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Product Amount Updated", {
        description: `The product amount has been updated from ${result.amount} to ${form.getValues("amount")}`,
      });
    },
    onError: (error) => {
      toast.error("Error updating product amount", {
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.amount === 0) {
      toast.error("Will add a delete pop up here eventually");
      return;
    }
    if (type === "pallet") {
      mutatePallet.mutate({
        id: result.id,
        amount: values.amount,
      });
    }
    if (type === "scrap") {
      mutateScrap.mutate({
        id: result.id,
        amount: values.amount,
      });
    }
    if (type === "stock") {
      mutateStock.mutate({
        id: result.id,
        amount: values.amount,
      });
    }
    if (type === "finishedItem") {
      mutateFinishedItem.mutate({
        id: result.id,
        amount: values.amount,
        prodAmount: result.prodAmount ?? 0,
      });
    }
    if (type === "prodFinishedItem") {
      mutateProdFinishedItem.mutate({
        id: result.id,
        prodAmount: values.amount ?? 0,
        amount: result.amount,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="">
        <span className="">
          {type === "prodFinishedItem" ? result.prodAmount : result.amount}
        </span>
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full">
        <DialogHeader>
          <DialogTitle>
            Editing amount for: {result.width}x{result.length}{" "}
            {result.block ? "Block" : ""}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      className=""
                    />
                  </FormControl>
                  <div className="grid grid-cols-6 gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) - 10);
                      }}
                    >
                      -10
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) + 10);
                      }}
                    >
                      +10
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) - 50);
                      }}
                    >
                      -50
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) + 50);
                      }}
                    >
                      +50
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) - 100);
                      }}
                    >
                      -100
                    </Button>

                    <Button
                      size="icon"
                      type="button"
                      onClick={() => {
                        form.setValue("amount", Number(field.value) + 100);
                      }}
                    >
                      +100
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.isValid ? (
              <DialogClose type="submit" asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAmount;
