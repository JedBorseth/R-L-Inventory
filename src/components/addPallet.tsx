"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";

const AddPallet = () => {
  const { register, handleSubmit, formState } = useForm();
  const onSubmit = (data: FieldValues) => console.log(data);
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
          <DialogDescription>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 pt-5"
            >
              <Input
                type="number"
                placeholder="Width"
                {...register("width", { required: true, min: 0 })}
              />
              <Input
                type="number"
                placeholder="Length"
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
                {...register("inventoryThreshold", {})}
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

              <Input
                type="submit"
                className="bg-secondary hover:bg-secondary/20"
              />
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddPallet;
