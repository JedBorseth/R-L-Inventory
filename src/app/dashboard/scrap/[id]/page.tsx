"use client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Skeleton } from "~/components/ui/skeleton";
import { capsFirst } from "~/lib/utils";
import { QrCode } from "lucide-react";
import { useState } from "react";
import { Edit } from "~/components/addScrap";
import EditAmount from "~/components/editAmount";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Toast } from "~/components/ui/toast";
import { useRouter } from "next/navigation";

function SkeletonDemo() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          <Skeleton className="h-12 w-12 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[250px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-[200px]" />
      </CardContent>
    </Card>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading, refetch } = api.scrap.getById.useQuery({
    id: Number(params.id),
  });
  const [code, setCode] = useState<string | null>(null);

  const generateQRCode = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "https://inventory.rlpackaging.ca/dashboard/Scrap/"
        : "https://inventory.rlpackaging.ca/dashboard/Scrap/";
    return await QRCode.toDataURL(`${baseUrl}${params.id}/`);
  };
  // Form Stuff
  const UpdateAmount = api.scrap.updateAmount.useMutation({
    onSuccess: async () => {
      await refetch();
      toast.success("Amount Updated", {
        description: "Scrap Product amount has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Error Updating Amount", {
        description: error.message,
      });
    },
  });
  const FormSchema = z.object({
    amount: z.coerce.number(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    UpdateAmount.mutate({
      id: Number(params.id),
      amount: data.amount,
    });
  }

  if (isLoading) return <SkeletonDemo />;
  else
    return (
      <Card className="relative mx-auto max-w-sm max-md:mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">
            {data?.width}x{data?.length}
            <div className="absolute right-2 top-2 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const pdf = new jsPDF();
                  pdf.setFontSize(50);
                  pdf.setTextColor("#000000");
                  console.log(pdf.getTextColor());
                  pdf.text(
                    `${data?.width}x${data?.length} | ${data?.strength}${data?.flute}`,
                    100,
                    25,
                    {
                      align: "center",
                      renderingMode: "fill",
                      lineHeightFactor: 1.5,
                      baseline: "bottom",
                    },
                  );
                  const code = await generateQRCode();
                  pdf.addImage(code, "png", 5, 80, 200, 200, "QR Code", "FAST");
                  pdf.save(`Scrap-id-${data?.id}.pdf`);
                }}
              >
                <QrCode />
              </Button>
              {data && typeof data.id === "number" && (
                <Edit id={data.id} button />
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {data && typeof data.id === "number" && (
              <EditAmount result={{ ...data, block: null }} type="scrap" />
            )}{" "}
            in Scrap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-4 w-full space-y-6 max-sm:text-base"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  defaultValue={data?.amount}
                  render={({ field }) => (
                    <FormItem className="w-20">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          onChange={field.onChange}
                          placeholder="Amount"
                          type="number"
                          inputMode="numeric"
                          defaultValue={data?.amount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div>
            Description:{" "}
            {(data?.notes ?? "").length <= 0 ? (
              <p className="opacity-50">No Description Set</p>
            ) : (
              <p className="whitespace-pre-line">{data?.notes}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="block border-t px-6 py-4">
          <div>
            {data?.strength}
            {data?.flute} {capsFirst(data?.color ?? "")}
          </div>
          <div>
            Added On {new Date(data?.dateAdded ?? "").toDateString()} At{" "}
            {new Date(data?.dateAdded ?? "").toLocaleTimeString()}
          </div>
          <div>
            Last Updated {new Date(data?.dateModified ?? "").toDateString()} At{" "}
            {new Date(data?.dateModified ?? "").toLocaleTimeString()}
          </div>
        </CardFooter>
      </Card>
    );
}
