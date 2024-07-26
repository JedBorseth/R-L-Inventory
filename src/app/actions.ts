// "use server";
// import { db } from "~/server/db";
// import { pallets } from "~/server/db/schema";
// import { z } from "zod";

// export type State = {
//   status: "success";
//   message: string;
// } | null;

// export async function addPallet(
//   prevState: State | null,
//   data: FormData,
// ): Promise<State> {
//   const width = z.number().parse(Number(data.get("width")));
//   const length = z.number().parse(Number(data.get("length")));
//   const amount = z.number().parse(Number(data.get("amount")));
//   //   await db.insert(pallets).values({
//   //     width: width,
//   //     length: length,
//   //     amount: amount,
//   //   });
//   console.log("server <-----------------");
//   return {
//     status: "success",
//     message: "idiot this is the server",
//   };
// }

// Spent way to long figuring this out but im not gonna use it
