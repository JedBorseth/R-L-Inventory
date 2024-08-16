import { type ReactNode } from "react";
import Sidebar from "~/components/sidebar";
import Header from "~/components/header";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Toaster } from "~/components/ui/sonner";
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
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar />

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          {children}
        </div>

        {/* <Link href="/dashboard/chat">
          <Button className="fixed bottom-5 right-5">
            <MessageSquare />
          </Button>
        </Link> */}
        <Toaster richColors duration={3000} />
      </div>
    </>
  );
}
