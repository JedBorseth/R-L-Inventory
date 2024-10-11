import type { NextApiRequest, NextApiResponse } from "next";
import type { useUser } from "@clerk/nextjs";

type reqType = {
  request: string;
  machine?: string;
  user: ReturnType<typeof useUser>;
};
// should probably be using trpc but idk
export async function POST(req: Request) {
  const body: reqType = (await req.json()) as reqType;
  console.log(body.user);

  return new Response(JSON.stringify({ msg: "Hello World" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
