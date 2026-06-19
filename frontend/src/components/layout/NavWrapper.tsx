"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";

const AUTH_ROUTES = ["/login", "/register"];

export function NavWrapper() {
  const pathname = usePathname();
  if (AUTH_ROUTES.includes(pathname)) return null;
  return <Nav />;
}
