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

const AddPallet = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: FieldValues) => {
    if (data.amount <= data.inventoryThreshold) {
      toast({
        variant: "destructive",
        title: "Error Adding Pallet",
        description:
          "Your inventory amount must be greater than the threshold.",
      });
      return;
    }
    console.log(data);
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
              className="flex flex-col gap-5 pt-5"
            >
              <Input
                type="number"
                placeholder="Width (inches)"
                {...register("width", { required: true, min: 0 })}
              />
              <Input
                type="number"
                placeholder="Length (inches)"
                {...register("length", { required: true, min: 0 })}
              />
              <Input
                type="number"
                placeholder="Current Inventory Count"
                {...register("amount", { required: true, min: 0 })}
              />
              <Input
                type="number"
                placeholder="Min Inventory Amount"
                {...register("inventoryThreshold", { required: true, min: 0 })}
              />

              <div className="flex items-center text-center">
                <label htmlFor="block">Block Pallet</label>
                <Input
                  type="checkbox"
                  id="block"
                  placeholder="block"
                  {...register("block", {})}
                />
                <label htmlFor="used">Used</label>
                <Input
                  type="checkbox"
                  id="used"
                  placeholder="used"
                  {...register("used", {})}
                />
                <label htmlFor="heatTreated">Heat Treated Pallet</label>
                <Input
                  type="checkbox"
                  id="heatTreated"
                  placeholder="Heat Treated Pallet"
                  {...register("heatTreated", {})}
                />
              </div>
              <Input
                type="text"
                placeholder="Description"
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
