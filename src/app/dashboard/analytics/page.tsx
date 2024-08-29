"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { api } from "~/trpc/react";

const chartConfig = {
  amount: {
    label: "Total",
  },
  pallets: {
    label: "Pallets",
    color: "hsl(var(--chart-1))",
  },
  scrap: {
    label: "Scrap",
    color: "hsl(var(--chart-2))",
  },
  stock: {
    label: "Stock",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function Component() {
  const data = api.all.getTotals.useQuery();
  const chartData = [
    { title: "pallets", amount: data.data?.pallets, fill: "" },
    { title: "scrap", amount: data.data?.scrap, fill: "" },
    { title: "stock", amount: data.data?.stock, fill: "" },
  ];
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>All Items</CardTitle>
        <CardDescription>
          For all tracked items including pallets, scrap, stock, and finished
          material
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="amount"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          This data is not very useful <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          These graphs look cool tho.
        </div>
      </CardFooter>
    </Card>
  );
}
