import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Index() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Inventory Dashboard</title>
        <meta name="description" content="App created by jed borseth :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#8D80AD] to-[#15162c]">
        <h1 className="text-3xl">{sessionData?.user.name}</h1>
        <p>This page can only be accessed by authenticated users </p>

        <Link href="../">Go Back</Link>
      </main>
    </>
  );
}
