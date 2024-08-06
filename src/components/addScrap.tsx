"use client";
import {
  Dialog,
  DialogClose,
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const AddScrap = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();
  const router = useRouter();

  type FormValues = {
    amount: number;
    width: number;
    length: number;
    CompanyUsedFor: string[];
    color: "kraft" | "white";
    flute: "B" | "C" | "E" | "F" | "BC" | "pt";
    strength: number;
    scored: boolean;
    scoredAt: number[];
    description: string;
  };

  const createScrap = api.scrap.create.useMutation({
    onSuccess: () => {
      router.refresh();
      reset();
      toast({
        title: "Pallet Added",
        description: "Pallet has been added successfully.",
      });
    },
  });
  const onSubmit = async (data: FieldValues) => {
    if (data.width <= 0 || data.length <= 0 || data.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error Adding Pallet",
        description: "Your values must be greater than 0.",
      });
      return;
    }
    // Other client side validation can go here
    createScrap.mutate(data as FormValues);
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
          <DialogTitle>Add New Scrap Material</DialogTitle>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 pt-5 max-sm:text-base"
            >
              <label htmlFor="width">Dimensions</label>
              <Input
                id="width"
                className="max-sm:text-base"
                type="number"
                inputMode="numeric"
                placeholder="Width (inches)"
                {...register("width", { required: true, min: 0 })}
              />
              <Input
                id="length"
                className="max-sm:text-base"
                type="number"
                inputMode="numeric"
                placeholder="Length (inches)"
                {...register("length", { required: true, min: 0 })}
              />
              <Input
                type="number"
                className="max-sm:text-base"
                inputMode="numeric"
                placeholder="Sheet Count"
                {...register("amount", { required: true, min: 0 })}
              />
              <label>Flute</label>
              <RadioGroup
                defaultValue="bc"
                id="color"
                className="justify-items-between grid-cols-2"
              >
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="b" id="b" />
                  <Label htmlFor="b">B</Label>
                </div>
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="c" id="c" />
                  <Label htmlFor="c">C</Label>
                </div>
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="e" id="e" />
                  <Label htmlFor="e">E</Label>
                </div>
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="f" id="f" />
                  <Label htmlFor="f">F</Label>
                </div>
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="bc" id="bc" />
                  <Label htmlFor="bc">BC</Label>
                </div>
                <div className="flex items-center space-x-2 max-sm:justify-center">
                  <RadioGroupItem value="pt" id="pt" />
                  <Label htmlFor="pt">PT</Label>
                </div>
              </RadioGroup>
              <label htmlFor="desc">Description</label>
              <Input
                type="text"
                className="max-sm:text-base"
                id="desc"
                placeholder="Extra Notes Go Here"
                {...register("description", {})}
              />
              <DialogClose asChild disabled={formState.isValid ? false : true}>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddScrap;
