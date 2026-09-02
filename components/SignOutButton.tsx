"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-2 text-slate-400 hover:text-white underline underline-offset-2"
    >
      Dilni (Sign Out)
    </button>
  );
}
