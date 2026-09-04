import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Command } from "lucide-react";
import { SessionProvider } from "next-auth/react";

export default async function UserLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // Server-side session retrieval just for the authenticated subtree.
   const session = await auth();

   // If no session, you could redirect or render a minimal message.
   return (
      <SidebarProvider>
         <AppSidebar session={session} />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                     orientation="vertical"
                     className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
                     <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                           <BreadcrumbLink href="#">
                              PROJECT NAME
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                           <BreadcrumbPage>PROJECT FEATURE</BreadcrumbPage>
                        </BreadcrumbItem>
                     </BreadcrumbList>
                  </Breadcrumb>
               </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
               {children}
            </div>
         </SidebarInset>
      </SidebarProvider>
   )
}