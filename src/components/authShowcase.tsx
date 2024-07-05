"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <span>Logged in as {sessionData.user?.name} redirecting...</span>
        )}
      </p>
      {sessionData?.user.image ? (
        <Image
          src={sessionData?.user.image}
          alt="User avatar"
          className="rounded-full"
          width={40}
          height={40}
        />
      ) : null}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
