"use client";
import Link from "next/link";
import { useEffect } from "react";
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
import { api } from "~/trpc/react";
import { createSwapy } from "swapy";

export default function Dashboard() {
  const data = api.all.getEverything.useQuery().data!;
  // const stockAmount = data.stock.reduce((acc, obj) => acc + obj.amount, 0);
  // const palletAmount = data.pallets.reduce((acc, obj) => acc + obj.amount, 0);

  // const scrapSft = data.scrap.reduce(
  //   (acc, obj) => acc + obj.width * obj.length * obj.amount,
  //   0,
  // );
  useEffect(() => {
    const container = document.querySelector("#swapy-container")!;
    const swapy = createSwapy(container);
    swapy.onSwap(({ data }) => {
      localStorage.setItem("slotItem", JSON.stringify(data.object));
    });
  }, []);
  return (
    <main
      className="grid flex-1 grid-cols-1 items-start gap-4 p-4 sm:grid-cols-2 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3"
      id="swapy-container"
    >
      <Card data-swapy-slot="one">
        <BigCard
          title="Cardboard Stock"
          desc="Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis."
          link="/dashboard/stock"
          linkTitle="Visit Stock Page"
        />
      </Card>
      <Card data-swapy-slot="two">
        <SmallCard
          title="Stock"
          desc="Your total amount of cardboard stock in the warehouse"
          amount={123123}
          max={10000}
        />
      </Card>
      <Card data-swapy-slot="three">
        <SmallCard
          title="Pallets"
          desc="Estimated number of pallets on hand"
          amount={1234}
          max={5000}
        />
      </Card>
      <Card data-swapy-slot="four">
        <BigCard
          title="Pallet Tracker"
          desc=" Introducing Our Dynamic Orders Dashboard for Seamless Management and
        Insightful Analysis."
          link="/dashboard/pallets"
          linkTitle="Visit Pallet Tracker"
        />
      </Card>
      <Card data-swapy-slot="five">
        <BigCard
          title="Scrap Material"
          desc="Introducing Our Dynamic Orders Dashboard for Seamless Management and
        Insightful Analysis."
          link="/dashboard/stock"
          linkTitle="Visit Stock Page"
        />
      </Card>
      <Card data-swapy-slot="six">
        <SmallCard
          title="Square Footage"
          desc="SFt of scrap material in the warehouse"
          amount={123124123}
          max={1000000000}
          sft
        />
      </Card>
      {/* <SmallCard
        title="Scrap Material"
        desc="Total number of scrap items in the warehouse"
        amount={scrapAmount}
        max={123000}
      /> */}
    </main>
  );
}

const SmallCard = ({
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
  amount = Math.floor(amount);
  return (
    <div className={`${sft ? "col-span-2" : null}`} data-swapy-item={title}>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">
          {<Counter value={amount} /> ? amount : <Counter value={amount} />}
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
    </div>
  );
};

const BigCard = ({
  title,
  desc,
  link,
  linkTitle,
}: {
  title: string;
  desc: string;
  link: string;
  linkTitle: string;
}) => {
  return (
    <Card className="grid-row-5 max-sm:col-span-2" data-swapy-item={title}>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href={link}>{linkTitle}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
