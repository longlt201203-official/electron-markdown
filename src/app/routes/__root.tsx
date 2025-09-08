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
import GuideDrawer from "../components/guide-drawer";
import { Separator } from "../components/ui/separator";
import { useDocuments } from "../components/documents-provider";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { CircleQuestionMarkIcon } from "lucide-react";
import { NATIVE_API_UPDATE_RESTART, NATIVE_EVENT_UPDATE_DOWNLOADED } from "@/native/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Toaster } from "../components/ui/sonner";

const menuItems = [
  {
    icon: <HomeIcon className="size-4" />,
    label: "Home",
    to: "/editor",
  },
];

function Root() {
  const location = useLocation();
  const { documents, refetch } = useDocuments();
  const [guideOpen, setGuideOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<
    | null
    | {
        releaseName: string;
        releaseNotes: string;
        releaseDate: string;
        updateURL: string;
      }
  >(null);

  useEffect(() => {
    refetch();
  }, []);

  // Subscribe to update notifications from main
  useEffect(() => {
    const off = window.nativeAPI?.nativeAPICallback?.(
      NATIVE_EVENT_UPDATE_DOWNLOADED,
      (_evt, payload) => {
        setUpdateInfo(payload);
      }
    );
    return () => {
      off?.();
    };
  }, []);

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
              <SidebarMenu>
                {documents.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/document/$documentId"
                        params={{ documentId: doc.id.toString() }}
                      >
                        {doc.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>
        <div className="px-4 py-2 flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            aria-label={guideOpen ? "Hide Markdown guide" : "Show Markdown guide"}
            onClick={() => setGuideOpen((v) => !v)}
          >
            <CircleQuestionMarkIcon className="size-4" />
          </Button>
          <ModeToggle />
        </div>
        <Separator />
        <div className="px-4 py-2 flex flex-1 min-h-0 flex-col overflow-hidden">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
        {/* Update dialog with release notes */}
        <AlertDialog open={!!updateInfo} onOpenChange={(open) => !open && setUpdateInfo(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {updateInfo?.releaseName || "Update available"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                A new version has been downloaded. Review the notes below, then restart to apply the update.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-[50vh] overflow-y-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
              {updateInfo?.releaseNotes || "No release notes provided."}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUpdateInfo(null)}>Later</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  window.nativeAPI?.invokeNativeAPI?.(NATIVE_API_UPDATE_RESTART);
                }}
              >
                Restart now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <GuideDrawer open={guideOpen} onOpenChange={setGuideOpen} />
        <Toaster richColors position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: Root,
});
