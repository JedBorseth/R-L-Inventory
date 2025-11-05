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
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { toast } from "sonner";

type StockItemData =
  inferRouterOutputs<AppRouter>["stock"]["getLatest"][number];

type FinishedItemData =
  inferRouterOutputs<AppRouter>["finishedItems"]["getLatest"][number];

type PalletItemData =
  inferRouterOutputs<AppRouter>["pallets"]["getLatest"][number];

type ItemData = StockItemData | FinishedItemData | PalletItemData;

const SendEmail = ({ item }: { item: ItemData }) => {
  const getTitle = () => {
    if ("depth" in item) {
      // Finished item
      return `${item.width}x${item.length}x${item.depth} | ${
        item.companyId
          ? String(item.companyId).split(",")[0]
          : `${item.strength}${item.flute}`
      }`;
    } else if ("block" in item) {
      // Pallet item
      return `${item.width}x${item.length} | ${
        item.block ? "Block" : "Stringer"
      } Pallet`;
    } else {
      // Stock item
      return item.descriptionAsTitle
        ? item.description
        : `${item.width}x${item.length}`;
    }
  };

  const getItemType = () => {
    if ("depth" in item) return "finishedItems";
    if ("block" in item) return "pallets";
    return "stock";
  };

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
            <DialogTitle>Request More {getTitle()}?</DialogTitle>
            <DialogDescription>
              An email will be sent to Mike to notify them that more stock is
              needed for this item.
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
                      body: JSON.stringify({ item, type: getItemType() }),
                    });
                    const res = (await request.json()) as {
                      message: string;
                      responseStatus: string;
                      joke: string;
                    };
                    toast.success("Email Sent Successfully!", {
                      description: res.joke,
                    });
                  } catch (error) {
                    console.error("Error sending email:", error);
                    toast.error("Failed to send email.");
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
