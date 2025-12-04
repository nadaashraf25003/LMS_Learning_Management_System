import { AppSidebar } from "@/components/AppSidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Sidebar/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/Sidebar/sidebar";

import { Input } from "@/components/ui/input";
import { MenubarDemo } from "../Menubar/MenubarDemo";
import LogoNav from "../ui/Logo/LogoNav";
import LogoModes from "../ui/LogoTheme/LogoModes";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Page({ role }) {
   const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/SearchResults?query=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    // <SidebarProvider>
    <div>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="fixed w-full z-10 bg-sidebar shadow-md flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-32">
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
                    <div className="flex items-center justify-between bg-b gap-24">
                      <div className="mt-5 w-24"><LogoModes/></div>
                      <Input
                        type="text"
                        placeholder="search for your course..."
                        className="w-96 bg-input"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                {/* <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>  
                  </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <MenubarDemo role={role}/>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-red-300">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div> */}
      </SidebarInset>
    </div>
    // </SidebarProvider>
  );
}
