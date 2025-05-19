"use client";
import React from "react";
import {
    HomeIcon,
    SettingsIcon,
    BarChartIcon,
    GalleryVerticalEnd,
    HelpCircleIcon,
    LayoutDashboardIcon,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    console.log("pathname", pathname);
    const data = {
        user: {
            name: "Rabin Kaspal",
            email: "rabinkaspal@example.com",
            avatar: "/nexts.svg",
        },
        navMain: [
            {
                title: "Home",
                url: "/",
                icon: HomeIcon,
            },
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboardIcon,
            },
            {
                title: "Results",
                url: "/results",
                icon: BarChartIcon,
            },
            {
                title: "Settings",
                url: "/settings",
                icon: SettingsIcon,
            },
        ],
        navSecondary: [
            {
                title: "Get Premium",
                url: "#",
                icon: HelpCircleIcon,
            },
        ],
    };
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">Contractz</span>
                                <span className="text-xs">Your Workspace</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} path={pathname} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
