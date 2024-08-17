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

import { Button } from "./ui/button";
const ViewDetailed = ({
  title,
  children,
}: {
  title: string;
  children: JSX.Element;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="">{title}</span>
      </DialogTrigger>
      <DialogContent className="max-w-screen w-auto">
        <DialogHeader>
          <DialogTitle>Available Data for Item.</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
        <DialogClose asChild>
          <Button variant="destructive">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailed;
