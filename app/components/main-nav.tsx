import { NavLink, useLocation } from "react-router-dom";

import { cn } from "tailwindcss/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  
  const routes = [
    { name: 'Home', path: "/" },
    { name: 'Devices', path: "/devices" },
    { name: 'Hyper+', path: "/plus" }
  ]

  const location = useLocation();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map(o => {
        return <NavLink
          to={o.path}
          className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === o.path ? '' : 'text-muted-foreground'}`}
        >
        {o.name}
      </NavLink>
      })}
    </nav>
  )
}
