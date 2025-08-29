import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../components/ui/sidebar";
import { HomeIcon } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle";
import { Separator } from "../components/ui/separator";

const menuItems = [
  {
    icon: <HomeIcon className="size-4" />,
    label: "Home",
    to: "/",
  },
];

function Root() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.to}
                    >
                      <Link to={item.to}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu></SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>
        <div className="px-4 py-2">
          <ModeToggle />
        </div>
        <Separator />
        <div className="px-4 py-2 h-full">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: Root,
});
