"use client";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import Link from "next/link";
import { motion, useAnimate } from "framer-motion";
import React from "react";

export default function Page() {
  const [scope, animate] = useAnimate();

  return (
    <main className="grid min-h-screen place-items-center" ref={scope}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
          bounce: 0.5,
        }}
        className="relative flex flex-col items-center justify-center gap-4 px-4"
      >
        <div className="text-center text-3xl font-bold dark:text-white md:text-7xl">
          R&L <span className="underline decoration-red-500">Packaging</span>{" "}
          Infinity
        </div>
        <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
          <ClerkLoading>Loading...</ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignInButton
                forceRedirectUrl={"/dashboard"}
                signUpForceRedirectUrl={"/dashboard"}
                signUpFallbackRedirectUrl={"/dashboard"}
                mode="modal"
              >
                <button className="w-fit rounded-full bg-black px-6 py-4 text-white dark:bg-white dark:text-black">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col gap-6">
                <Link
                  href={"../dashboard"}
                  onClick={async () => {
                    await animate("div", {
                      opacity: 0,
                      y: 40,
                      scale: 0.5,
                    });
                  }}
                  className="w-fit rounded-full bg-black px-6 py-4 text-white dark:bg-white dark:text-black"
                >
                  {" "}
                  Go to Dashboard
                </Link>
                <SignOutButton />
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </motion.div>
    </main>
  );
}
