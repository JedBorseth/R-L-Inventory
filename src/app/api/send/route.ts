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
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch joke: ${res.statusText}`);
  }

  const data = (await res.json()) as DadJokeResponse;
  return data;
}

export async function POST(req: Request) {
  type StockItemData =
    inferRouterOutputs<AppRouter>["stock"]["getLatest"][number];
  type FinishedItemData =
    inferRouterOutputs<AppRouter>["finishedItems"]["getLatest"][number];

  try {
    const data = (await req.json()) as { item: StockItemData | FinishedItemData };
    const user = await currentUser();
    const joke = await getJoke();
    const item = data.item;

    // Detect if it's a finished item (has a "depth" property)
    const isFinishedItem = "depth" in item;

    // Build the title
    const title = isFinishedItem
      ? `${item.width}x${item.length}x${item.depth} | ${
          item.companyId
            ? String(item.companyId).split(",")[0]
            : `${item.strength}${item.flute}`
        }`
      : item.descriptionAsTitle
      ? item.description
      : `${item.width}x${item.length} | ${
          item.CompanyUsedFor
            ? String(item.CompanyUsedFor).split(",")[0]
            : `${item.strength}${item.flute}`
        }`;

    // Dashboard link — depends on item type
    const dashboardLink = `http://inventory.rlpackaging.ca/dashboard/${
      isFinishedItem ? "finishedItems" : "stock"
    }/${item.id}`;

    // Keep your full original email HTML — only data is dynamic
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
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6">
      <tr>
        <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
        <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top">
          <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">R&L Inventory App Material Request</span>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Hello Mike,</p>
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">
                    ${isFinishedItem ? "Finished Item" : "Material"} Request for ${title}
                    <br /> 
                    Current Stock: ${item.amount ?? "N/A"}
                    <br />
                    Min Threshold: ${item.inventoryThreshold ?? "N/A"}
                    <br />
                    Max Threshold: ${item.maxInventoryThreshold ?? "N/A"}
                    <br />
                    Last Updated: ${new Date(item.dateModified ?? "").toLocaleDateString()}
                    <br />
                    Requested by User: ${user ? user.firstName : "Unknown User"}
                  </p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                            <tbody>
                              <tr>
                                <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center; background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec">
                                  <a href="${dashboardLink}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">View Item in App</a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Joke of the day:</p>
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${joke.joke}</p>
                </td>
              </tr>
              <!-- END MAIN CONTENT AREA -->
              </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                  <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center">
                    <span class="apple-link" style="color: #9a9ea6; font-size: 16px; text-align: center;">R&L Packaging, 30945 Wheel Ave, Abbotsford, BC V2T 6G7</span>
                    <br> Don't like these emails? <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="text-decoration: underline; color: #9a9ea6; font-size: 16px; text-align: center;">Unsubscribe</a>.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center">
                    App Created by <a href="http://jedborseth.com" style="color: #9a9ea6; text-align: center; text-decoration: none;">Jed Borseth</a>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->
          </div>
        </td>
        <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
      </tr>
    </table>
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
        subject: isFinishedItem
          ? "Finished Item Inventory Request"
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
  } catch (error) {
    console.error("Error parsing JSON body:", error);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
