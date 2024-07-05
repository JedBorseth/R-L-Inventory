import type { ReactNode } from "react";
import Sidebar from "~/components/sidebar";
import Header from "~/components/header";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) redirect("../../../");
  if (session)
    return (
      <>
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            {children}
          </div>
        </main>
      </>
    );
}
