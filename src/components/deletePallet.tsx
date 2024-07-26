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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

const DeletePallet = () => {
  const { register, handleSubmit } = useForm();
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
                alert("no");
              })}
              className="flex flex-col gap-5 pt-5"
            >
              <h1>Are You Sure?</h1>
              <Button type="submit">Yes, I am sure!</Button>
            </form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePallet;
