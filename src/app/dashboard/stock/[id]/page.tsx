"use client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  const { data, isLoading } = api.stock.getById.useQuery({
    id: Number(params.id),
  });
  const [code, setCode] = useState<string | null>(null);

  const generateQRCode = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "https://inventory.rlpackaging.ca/dashboard/stock/"
        : "https://inventory.rlpackaging.ca/dashboard/stock/";
    return await QRCode.toDataURL(`${baseUrl}${params.id}/`);
  };
  if (isLoading) return <SkeletonDemo />;
  else
    return (
      <Card className="relative mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {data?.width}x{data?.length}
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-2"
              onClick={async () => {
                const pdf = new jsPDF();
                pdf.setFontSize(15);
                const code = await generateQRCode();
                pdf.addImage(code, "png", 0, 0, 200, 200);
                pdf.save(`qrcode-${data?.id}.pdf`);
              }}
            >
              <QrCode />
            </Button>
          </CardTitle>
          <CardDescription>{data?.amount} in stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {data?.strength}
            {data?.flute}
          </div>
          <div>{capsFirst(data?.color ?? "")}</div>
          <div>
            Added On {data?.dateAdded}
            Last Updated {data?.dateModified}
          </div>
        </CardContent>
      </Card>
    );
}
