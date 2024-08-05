import { Suspense, type ReactNode } from "react";
import Sidebar from "~/components/sidebar";
import Header from "~/components/header";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Toaster } from "~/components/ui/toaster";
import Head from "next/head";
export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const allowedEmails = ["jedborseth@gmail.com", "jedborseth@outlook.com"];
  if (
    !user?.primaryEmailAddress?.emailAddress.endsWith("@rlpackaging.ca") &&
    !allowedEmails.includes(user?.primaryEmailAddress?.emailAddress ?? "")
  ) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-center text-primary-foreground">
        <div className="flex flex-col gap-5 border-l pl-5">
          <h1>Please use an @rlpackaging.ca email</h1>
          <Link href="/"> Go Back</Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          {children}
        </div>
        <Toaster />
      </div>
    </>
  );
}
