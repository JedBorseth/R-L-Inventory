import { currentUser } from "@clerk/nextjs/server";
import type { inferRouterOutputs } from "@trpc/server";
import { NextResponse } from "next/server";
import { env } from "~/env";
import type { AppRouter } from "~/server/api/root";

const RESEND_API_KEY = env.RESEND_API_KEY;

type DadJokeResponse = {
  id: string;
  joke: string;
  status: number;
};

async function getJoke(): Promise<DadJokeResponse> {
  const res = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch joke: ${res.statusText}`);
  return (await res.json()) as DadJokeResponse;
}

export async function POST(req: Request) {
  type StockItemData =
    inferRouterOutputs<AppRouter>["stock"]["getLatest"][number];
  type FinishedItemData =
    inferRouterOutputs<AppRouter>["finishedItems"]["getLatest"][number];
  type PalletItemData =
    inferRouterOutputs<AppRouter>["pallet"]["getLatest"][number];

  try {
    const data = (await req.json()) as {
      item: StockItemData | FinishedItemData | PalletItemData;
      type: "stock" | "finishedItems" | "pallets";
    };

    const { item, type } = data;
    const user = await currentUser();
    const joke = await getJoke();

    // Build the title
    let title = "";
    if (type === "finishedItems" && "depth" in item) {
      title = `${item.width}x${item.length}x${item.depth} | ${
        item.companyId
          ? String(item.companyId).split(",")[0]
          : `${item.strength}${item.flute}`
      }`;
    } else if (type === "pallets" && "block" in item) {
      title = `${item.width}x${item.length} | ${
        item.block ? "Block" : "Stringer"
      } Pallet`;
    } else {
      title = "descriptionAsTitle" in item && item.descriptionAsTitle
        ? item.description
        : `${item.width}x${item.length}`;
    }

    const dashboardLink = `http://inventory.rlpackaging.ca/dashboard/${type}/${item.id}`;

    const html = `<!doctype html>
<html lang="en">
  <body>
    <p>Hello Mike,</p>
    <p>
      ${type === "finishedItems"
        ? "Finished Item"
        : type === "pallets"
        ? "Pallet"
        : "Material"} Request for ${title}
      <br /> 
      Current Stock: ${item.amount ?? "N/A"}
      <br />
      Min Threshold: ${item.inventoryThreshold ?? "N/A"}
      <br />
      Max Threshold: ${"maxInventoryThreshold" in item ? item.maxInventoryThreshold ?? "N/A" : "N/A"}
      <br />
      Requested by: ${user?.username ?? "Unknown"}
    </p>
    <a href="${dashboardLink}">View Item in App</a>
    <hr/>
    <p>Joke of the day: ${joke.joke}</p>
  </body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "R&L Inventory <inventory@jedborseth.com>",
        to: ["mike@rlpackaging.ca"],
        subject:
          type === "finishedItems"
            ? "Finished Item Inventory Request"
            : type === "pallets"
            ? "Pallet Inventory Request"
            : "Material Inventory Request",
        html,
      }),
    });

    if (res.ok) {
      return NextResponse.json({
        message: "Email sent successfully",
        responseStatus: res.status,
        joke: joke.joke,
      });
    }

    throw new Error(`Email service responded with ${res.status}`);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 400 });
  }
}
