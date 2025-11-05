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
      type?: "stock" | "finishedItems" | "pallet";
    };

    const item = data.item;
    const user = await currentUser();
    const joke = await getJoke();

    // Determine type (if not provided by frontend)
    const type =
      data.type ??
      ("depth" in item
        ? "finishedItems"
        : "block" in item
        ? "pallets"
        : "stock");

    // Title generation
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
      title =
        "descriptionAsTitle" in item && item.descriptionAsTitle
          ? item.description
          : `${item.width}x${item.length} | ${
              "CompanyUsedFor" in item && item.CompanyUsedFor
                ? String(item.CompanyUsedFor).split(",")[0]
                : `${"strength" in item ? item.strength : ""}${
                    "flute" in item ? item.flute : ""
                  }`
            }`;
    }

    const dashboardLink = `http://inventory.rlpackaging.ca/dashboard/${type}/${item.id}`;

    // ✅ Keep all original inline styles and HTML intact
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Simple Transactional Email</title>
    <style media="all" type="text/css">
@media all {
  .btn-primary table td:hover {
    background-color: #ec0867 !important;
  }
  .btn-primary a:hover {
    background-color: #ec0867 !important;
    border-color: #ec0867 !important;
  }
}
@media only screen and (max-width: 640px) {
  .main p,
  .main td,
  .main span {
    font-size: 16px !important;
  }
  .wrapper {
    padding: 8px !important;
  }
  .content {
    padding: 0 !important;
  }
  .container {
    padding: 0 !important;
    padding-top: 8px !important;
    width: 100% !important;
  }
  .main {
    border-left-width: 0 !important;
    border-radius: 0 !important;
    border-right-width: 0 !important;
  }
  .btn table {
    max-width: 100% !important;
    width: 100% !important;
  }
  .btn a {
    font-size: 16px !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
@media all {
  .ExternalClass {
    width: 100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
    line-height: 100%;
  }
  .apple-link a {
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    text-decoration: none !important;
  }
  #MessageViewBody a {
    color: inherit;
    text-decoration: none;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
}
</style>
  </head>
  <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="background-color: #f4f5f6; width: 100%;">
      <tr>
        <td>&nbsp;</td>
        <td class="container" style="max-width: 600px; padding-top: 24px; margin: 0 auto;">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader" style="display: none;">R&L Inventory App Material Request</span>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;">
              <tr>
                <td class="wrapper" style="padding: 24px;">
                  <p>Hello Mike,</p>
                  <p>
                    ${
                      type === "finishedItems"
                        ? "Finished Item"
                        : type === "pallets"
                        ? "Pallet"
                        : "Material"
                    } Request for ${title}
                    <br />
                    Current Stock: ${item.amount ?? "N/A"}
                    <br />
                    Min Threshold: ${item.inventoryThreshold ?? "N/A"}
                    <br />
                    Max Threshold: ${
                      "maxInventoryThreshold" in item
                        ? item.maxInventoryThreshold ?? "N/A"
                        : "N/A"
                    }
                    <br />
                    Last Updated: ${new Date(
                      item.dateModified ?? ""
                    ).toLocaleDateString()}
                    <br />
                    Requested by User: ${user ? user.username : "Unknown User"}
                  </p>
                  <table class="btn btn-primary" style="width: 100%;">
                    <tbody>
                      <tr>
                        <td align="left">
                          <table style="width: auto;">
                            <tbody>
                              <tr>
                                <td style="border-radius: 4px; text-align: center; background-color: #0867ec;">
                                  <a href="${dashboardLink}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; background-color: #0867ec; color: #ffffff;">View Item in App</a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>Joke of the day:</p>
                  <p>${joke.joke}</p>
                </td>
              </tr>
            </table>

            <!-- FOOTER -->
            <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;">
              <table style="width: 100%;">
                <tr>
                  <td class="content-block" style="color: #9a9ea6; font-size: 16px; text-align: center;">
                    <span class="apple-link">R&L Packaging, 30945 Wheel Ave, Abbotsford, BC V2T 6G7</span>
                    <br /> Don't like these emails? <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="text-decoration: underline; color: #9a9ea6;">Unsubscribe</a>.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by" style="color: #9a9ea6; font-size: 16px; text-align: center;">
                    App Created by <a href="http://jedborseth.com" style="color: #9a9ea6; text-decoration: none;">Jed Borseth</a>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;

    // Send the email
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
