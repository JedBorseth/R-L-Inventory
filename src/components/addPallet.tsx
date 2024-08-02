"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";

const AddPallet = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const createPallet = api.pallet.create.useMutation({
    onSuccess: () => {
      console.log("pog");
      router.refresh();
    },
  });
  const onSubmit = async (data: FieldValues) => {
    if (data.amount <= data.inventoryThreshold) {
      toast({
        variant: "destructive",
        title: "Error Adding Pallet",
        description:
          "Your inventory amount must be greater than the threshold.",
      });
      return;
    }
    createPallet.mutate({
      length: Number(data.length),
      width: Number(data.width),
      amount: Number(data.amount),
      block: Boolean(data.block),
      used: Boolean(data.used),
      heatTreated: Boolean(data.heatTreated),
      inventoryThreshold: Number(data.inventoryThreshold),
      description: String(data.desc),
    });
  };
  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Product
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pallet Type</DialogTitle>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 pt-5 text-base"
            >
              <label htmlFor="width">Dimensions</label>
              <Input
                id="width"
                type="number"
                inputMode="numeric"
                placeholder="Width (inches)"
                {...register("width", { required: true, min: 0 })}
              />
              <Input
                id="length"
                type="number"
                placeholder="Length (inches)"
                {...register("length", { required: true, min: 0 })}
              />
              <label htmlFor="amount">Inventory</label>
              <Input
                id="amount"
                type="number"
                placeholder="Current Amount"
                {...register("amount", { required: true, min: 0 })}
              />
              <Input
                type="number"
                placeholder="Will email alert when inventory is below"
                {...register("inventoryThreshold", { required: true, min: 0 })}
              />

              <div className="flex items-center justify-between gap-10 text-center text-sm">
                <div className="flex flex-col items-center">
                  <label htmlFor="block">Block Pallet</label>
                  <Checkbox id="block" {...register("block", {})} />
                </div>
                <div className="flex flex-col items-center">
                  <label htmlFor="used">Used</label>
                  <Checkbox type="button" id="used" {...register("used", {})} />
                </div>
                <div className="flex flex-col items-center">
                  <label htmlFor="heatTreated">Heat Treated Pallet</label>
                  <Checkbox
                    type="button"
                    id="heatTreated"
                    {...register("heatTreated", {})}
                  />
                </div>
              </div>
              <label htmlFor="desc">Description</label>
              <Input
                type="text"
                id="desc"
                placeholder="Extra Notes Go Here"
                {...register("desc", {})}
              />

              <Button type="submit">Submit</Button>
            </form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddPallet;
