import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Progress } from "~/components/ui/progress";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Cardboard Stock</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <Link href="/dashboard/stock">Visit Stock Page</Link>
          </Button>
        </CardFooter>
      </Card>
      <Component
        title="Stock"
        desc="Your total amount of cardboard stock in the warehouse"
        amount={4356}
      />
      <Component
        title="Pallets"
        desc="Estimated number of pallets on hand"
        amount={342}
      />
      <Card className="grid-row-3 sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Pallet Tracker</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <Link href="/dashboard/pallets">Visit Pallet Tracker</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

const Component = ({
  title,
  amount,
  desc,
}: {
  title: string;
  amount: number;
  desc: string;
}) => {
  const palletLowInventory = 500;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>
          {title}{" "}
          {title === "Pallets" &&
            amount < palletLowInventory &&
            "(Low Inventory)"}
        </CardDescription>
        <CardTitle className="text-4xl">{amount.toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </CardContent>
      <CardFooter>
        <Progress value={amount / 100} aria-label="" />
      </CardFooter>
    </Card>
  );
};
