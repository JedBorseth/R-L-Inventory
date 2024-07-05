"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
const LogOut = () => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOut();
      }}
    >
      Logout
    </DropdownMenuItem>
  );
};

export default LogOut;
