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
      type: "stock" | "finishedItems" | "pallet";
    };

    const { item, type } = data;
    const user = await currentUser();
    const joke = await getJoke();

    // --- Title logic ---
    let title = "";
    if (type === "finishedItems" && "depth" in item) {
      title = `${item.width}x${item.length}x${item.depth} | ${
        item.companyId
          ? String(item.companyId).split(",")[0]
          : `${item.strength}${item.flute}`
      }`;
    } else if (type === "pallet" && "block" in item) {
      title = `${item.width}x${item.length} | ${
        item.block ? "Block" : "Stringer"
      } Pallet`;
    } else {
      title =
        "descriptionAsTitle" in item && item.descriptionAsTitle
          ? item.description ?? `${item.width}x${item.length}`
          : `${item.width}x${item.length}`;
    }

    const dashboardLink = `http://inventory.rlpackaging.ca/dashboard/${type}/${item.id}`;

    // --- Keep your existing HTML + inline styles ---
    const html = `
<!doctype html>
<html lang="en">
  <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px;">
      <h2 style="margin-bottom: 10px;">Inventory Request</h2>
      <p style="margin: 0;">${
        type === "finishedItems"
          ? "Finished Item"
          : type === "pallet"
          ? "Pallet"
          : "Material"
      } Request for <strong>${title}</strong></p>
      <p style="margin: 8px 0;">Current Stock: <strong>${item.amount ?? "N/A"}</strong></p>
      <p style="margin: 8px 0;">Min Threshold: <strong>${item.inventoryThreshold ?? "N/A"}</strong></p>
      ${
        "maxInventoryThreshold" in item
          ? `<p style="margin: 8px 0;">Max Threshold: <strong>${
              item.maxInventoryThreshold ?? "N/A"
            }</strong></p>`
          : ""
      }
      <p style="margin: 8px 0;">Requested by: <strong>${
        user?.firstName ?? "Unknown"
      }</strong></p>
      <a href="${dashboardLink}" style="display: inline-block; margin-top: 15px; background: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none;">View Item in Dashboard</a>
      <hr style="margin: 20px 0;" />
      <p style="font-style: italic; color: #555;">Joke of the day: ${joke.joke}</p>
    </div>
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
            : type === "pallet"
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
