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
import { toast } from "sonner";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

const AddPallet = () => {
  const form = useForm();
  const router = useRouter();
  const createPallet = api.pallet.create.useMutation({
    onSuccess: () => {
      router.refresh();
      form.reset();
      toast.success("Pallet Added", {
        description: "Pallet has been added successfully.",
      });
    },
  });
  const onSubmit = async (data: FieldValues) => {
    if (data.amount <= data.inventoryThreshold) {
      toast.error("Error Adding Pallet", {
        description:
          "Your inventory amount must be greater than the threshold.",
      });
      return;
    }
    createPallet.mutate({
      length: Number(data.length),
      width: Number(data.width),
      amount: Number(data.amount),
      block: data.block ? true : false,
      used: data.used ? true : false,
      heatTreated: data.heatTreated ? true : false,
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 pt-5 max-sm:text-base"
              >
                <label htmlFor="width">Dimensions</label>
                <Input
                  id="width"
                  className="max-sm:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="Width (inches)"
                  {...form.register("width", { required: true, min: 0 })}
                />
                <Input
                  id="length"
                  className="max-sm:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="Length (inches)"
                  {...form.register("length", { required: true, min: 0 })}
                />
                <label htmlFor="amount">Inventory</label>
                <Input
                  id="amount"
                  type="number"
                  className="max-sm:text-base"
                  inputMode="numeric"
                  placeholder="Current Amount"
                  {...form.register("amount", { required: true, min: 0 })}
                />
                <Input
                  type="number"
                  className="max-sm:text-base"
                  inputMode="numeric"
                  placeholder="Low Inventory Threshold"
                  {...form.register("inventoryThreshold", {
                    required: true,
                    min: 0,
                  })}
                />
                <label htmlFor="desc">Description</label>
                <Input
                  type="text"
                  className="max-sm:text-base"
                  id="desc"
                  placeholder="Extra Notes Go Here"
                  {...form.register("desc", {})}
                />

                <div className="flex items-center justify-between gap-10 text-center text-sm">
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      name="block"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Block</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      name="used"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Used</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      name="heatTreated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Heat Treated</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
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
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddPallet;

export const Edit = ({ id }: { id: number }) => {
  const data = api.pallet.getById.useQuery({ id: id });
  const form = useForm({
    values: {
      desc: data.data?.description,
      width: data.data?.width,
      length: data.data?.length,
      amount: data.data?.amount,
      inventoryThreshold: data.data?.inventoryThreshold,
      block: data.data?.block,
      used: data.data?.used,
      heatTreated: data.data?.heatTreated,
    },
  });
  const router = useRouter();
  const createPallet = api.pallet.update.useMutation({
    onSuccess: async () => {
      router.refresh();
      form.reset();
      toast.success("Edit Success", {
        description: "Pallet has been edited successfully.",
      });
      await data.refetch();
    },
  });
  const onSubmit = async (data: FieldValues) => {
    if (data.amount <= data.inventoryThreshold) {
      toast.error("Error Editing Pallet", {
        description:
          "Your inventory amount must be greater than the threshold.",
      });
      return;
    }

    createPallet.mutate({
      id: id,
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
      <DialogTrigger className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pallet Data</DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 pt-5 max-sm:text-base"
              >
                <label htmlFor="width">Dimensions</label>
                <Input
                  id="width"
                  className="max-sm:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="Width (inches)"
                  {...form.register("width", { required: true, min: 0 })}
                />
                <Input
                  id="length"
                  className="max-sm:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="Length (inches)"
                  {...form.register("length", { required: true, min: 0 })}
                />
                <label htmlFor="amount">Inventory</label>
                <Input
                  id="amount"
                  type="number"
                  className="max-sm:text-base"
                  inputMode="numeric"
                  placeholder="Current Amount"
                  {...form.register("amount", { required: true, min: 0 })}
                />
                <Input
                  type="number"
                  className="max-sm:text-base"
                  inputMode="numeric"
                  placeholder="Low Inventory Threshold"
                  {...form.register("inventoryThreshold", {
                    required: true,
                    min: 0,
                  })}
                />
                <label htmlFor="desc">Description</label>
                <Input
                  type="text"
                  className="max-sm:text-base"
                  id="desc"
                  placeholder="Extra Notes Go Here"
                  {...form.register("desc", {})}
                />

                <div className="flex items-center justify-between gap-10 text-center text-sm">
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      name="block"
                      defaultValue={data.data?.block}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              onCheckedChange={field.onChange}
                              defaultChecked={data.data?.block ? true : false}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Block</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      name="used"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              onCheckedChange={field.onChange}
                              defaultChecked={data.data?.used ? true : false}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Used</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <FormField
                      control={form.control}
                      defaultValue={data.data?.heatTreated}
                      name="heatTreated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              onCheckedChange={field.onChange}
                              defaultChecked={
                                data.data?.heatTreated ? true : false
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Heat Treated</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
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
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
