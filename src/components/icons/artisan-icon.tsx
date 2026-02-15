import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export const ArtisanIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.37 2.15c.38-.38.74-.74 1.13-1.13.38-.38.38-.38 0 0a2.5 2.5 0 0 1 3.5 3.5c-.38.38-.74.74-1.13 1.13" />
    <path d="m14 6-8.5 8.5a1.5 1.5 0 0 0 0 2.12l4.24 4.24a1.5 1.5 0 0 0 2.12 0L20 12" />
    <path d="m14 6 5-5" />
    <path d="M9.5 12.5 11.5 14.5" />
    <path d="M2.15 11.37c-.38.38-.74.74-1.13 1.13a2.5 2.5 0 0 0 0 3.5c.38.38.74.74 1.13 1.13" />
    <path d="m22 22-8-8" />
  </svg>
);
