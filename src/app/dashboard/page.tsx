import Link from "next/link";
import Counter from "~/components/animatedNum";
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
import { api } from "~/trpc/server";

export default async function Dashboard() {
  const data = await api.all.getEverything();
  const stockAmount = data.stock.reduce((acc, obj) => acc + obj.amount, 0);
  const palletAmount = data.pallets.reduce((acc, obj) => acc + obj.amount, 0);

  const scrapSft = data.scrap.reduce(
    (acc, obj) => acc + obj.width * obj.length * obj.amount,
    0,
  );
  const scrapAmount = data.scrap.reduce((acc, obj) => acc + obj.amount, 0);

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
        amount={stockAmount}
        max={10000}
      />
      <Component
        title="Pallets"
        desc="Estimated number of pallets on hand"
        amount={palletAmount}
        max={5000}
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

      <Card className="grid-row-3 sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Scrap Material</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <Link href="/dashboard/scrap">Visit Scrap Page</Link>
          </Button>
        </CardFooter>
      </Card>
      <Component
        title="Square Footage"
        desc="SFt of scrap material in the warehouse"
        amount={scrapSft}
        max={1000000000}
        sft
      />
      {/* <Component
        title="Scrap Material"
        desc="Total number of scrap items in the warehouse"
        amount={scrapAmount}
        max={123000}
      /> */}
    </main>
  );
}

const Component = ({
  title,
  amount,
  desc,
  max,
  sft,
}: {
  title: string;
  amount: number;
  desc: string;
  max: number;
  sft?: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">
          {amount ? <Counter value={amount} /> : "0"}
          {sft ? (
            <span className="text-sm">
              ft<span className="align-super">2</span>
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </CardContent>
      <CardFooter>
        <Progress value={(amount / max) * 100} aria-label="" />
      </CardFooter>
    </Card>
  );
};
