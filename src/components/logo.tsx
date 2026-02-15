import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    className={cn("fill-current text-foreground", props.className)}
    {...props}
  >
    <text
      x="10"
      y="35"
      fontFamily="'PT Sans', sans-serif"
      fontSize="30"
      fontWeight="bold"
      className="fill-primary"
    >
      Zariya
    </text>
  </svg>
);
export default Logo;
