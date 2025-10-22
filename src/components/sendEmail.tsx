"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

import type { UseTRPCQueryResult } from "@trpc/react-query/shared";
import type { inferRouterOutputs } from "@trpc/server";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";
import { toast } from "sonner";

type StockItemData =
  inferRouterOutputs<AppRouter>["stock"]["getLatest"][number];
const SendEmail = ({ item }: { item: StockItemData }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute bottom-0 right-0 top-0 m-auto h-8 w-8"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Request More{" "}
              {item.descriptionAsTitle
                ? item.description
                : String(item.width) + "x" + String(item.length)}
              ?
            </DialogTitle>
            <DialogDescription>
              An email will be sent to the Mike to notify them that more stock
              is needed for this item.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="submit"
                className="mt-4"
                onClick={async () => {
                  try {
                    const request = await fetch("/api/send", {
                      method: "POST",
                      body: JSON.stringify({ item }),
                    });
                    const res = (await request.json()) as {
                      message: string;
                      responseStatus: string;
                      joke: string;
                    };
                    console.log("Email send response:", res);
                    toast.success("Email Sent Successfully!", {
                      description: res.joke,
                    });
                  } catch (error) {
                    console.error("Error sending email:", error);
                  }
                }}
              >
                Send Email
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="mt-4" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendEmail;
