"use client";
import Head from "next/head";
import Link from "next/link";
import { AuthShowcase } from "~/components/authShowcase";

export default function Page() {
  return (
    <>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#8D80AD] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-white text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            R&L <span className="text-[hsl(280,100%,70%)]">Inventory</span> App
          </h1>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
}
