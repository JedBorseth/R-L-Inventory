"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { capsFirst } from "~/lib/utils";
import { toast } from "sonner";

const DeleteItem = ({
  id,
  type,
}: {
  id: number;
  type: "pallet" | "scrap" | "stock" | "finishedItem";
}) => {
  const { handleSubmit } = useForm();
  const router = useRouter();
  const removePallet = api.pallet.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Pallet Deleted", {
        description: "The pallet has been deleted.",
      });
    },
  });
  const removeScrap = api.scrap.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Scrap Material Deleted", {
        description: "The scrap material has been deleted.",
      });
    },
  });
  const removeStock = api.stock.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Stock Deleted", {
        description: "The stock has been deleted.",
      });
    },
  });
  const removeFinishedItem = api.finishedItems.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Finished Item Deleted", {
        description: "The finished item has been deleted.",
      });
    },
  });
  return (
    <Dialog>
      <DialogTrigger className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {type === "finishedItem" ? "Finished Item" : capsFirst(type)}{" "}
            Type
          </DialogTitle>
          <div>
            <form
              onSubmit={handleSubmit(() => {
                if (type === "pallet") removePallet.mutate(id);
                if (type === "scrap") removeScrap.mutate(id);
                if (type === "stock") removeStock.mutate(id);
                if (type === "finishedItem") removeFinishedItem.mutate(id);
              })}
              className="flex flex-col gap-5 pt-5"
            >
              <h1>Are You Sure?</h1>
              <DialogClose asChild>
                <Button type="submit" variant="destructive">
                  Yes, Im Sure!
                </Button>
              </DialogClose>
            </form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItem;
