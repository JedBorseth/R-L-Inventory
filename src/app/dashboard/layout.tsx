import { ReactNode } from "react";
import Sidebar from "~/components/sidebar";
import Header from "~/components/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="bg-muted/40 flex min-h-screen w-full flex-col">
        <Sidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          {children}
        </div>
      </main>
    </>
  );
}
