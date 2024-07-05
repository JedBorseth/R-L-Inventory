"use client";

import { signOut } from "next-auth/react";
const LogOut = () => {
  return (
    <span
      onClick={async () => {
        await signOut();
      }}
    >
      Logout
    </span>
  );
};

export default LogOut;
