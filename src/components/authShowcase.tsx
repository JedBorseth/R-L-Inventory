"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
export const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-white text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
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
        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-10 py-3 font-semibold no-underline transition"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
