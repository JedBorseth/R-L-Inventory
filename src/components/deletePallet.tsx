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

const DeletePallet = ({ id }: { id: number }) => {
  const { handleSubmit } = useForm();
  const router = useRouter();
  const remove = api.pallet.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Dialog>
      <DialogTrigger className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Pallet Type</DialogTitle>
          <div>
            <form
              onSubmit={handleSubmit(() => {
                remove.mutate(id);
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

export default DeletePallet;
