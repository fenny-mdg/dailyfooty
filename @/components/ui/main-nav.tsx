"use client";

import { Link } from "@remix-run/react";
import { Flame } from "lucide-react";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <Flame />
        <span className="hidden font-bold sm:inline-block">daily footy</span>
      </Link>
    </div>
  );
}
