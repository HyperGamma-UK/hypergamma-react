import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </NavLink>
      <NavLink
        to="/devices"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Devices
      </NavLink>
      <NavLink
        to="/plus"
        className="disabled text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Hyper+
      </NavLink>
    </nav>
  )
}
