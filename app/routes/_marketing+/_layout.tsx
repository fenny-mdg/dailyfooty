import { Outlet } from "@remix-run/react";

import { SiteHeader } from "~/components/site-header.tsx";

export default function IndexLayout() {
  return (
    <div>
      <SiteHeader />

      <Outlet />
    </div>
  );
}
