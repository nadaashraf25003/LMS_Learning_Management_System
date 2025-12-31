import { lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarProvider, useSidebar } from "@/components/ui/Sidebar/sidebar";

const Navbar = lazy(() => import("@/components/SideNavbar/Navbar"));
const Footer = lazy(() => import("../Footer/Footer"));
import LogoModes from "../ui/LogoTheme/LogoModes";
import DefaultImage from "../../../public/images/default-avatar.png";
import useTokenStore from "@/store/user";

// const Image = localStorage.getItem("userimage") || DefaultImage;

function LayoutContent({ shouldHide }) {
  const { open } = useSidebar(); //  Now it's inside the provider
  // const userRole = localStorage.getItem("Role") || "student";
  const Image = useTokenStore((state) => state.user?.image) || DefaultImage;
  const userRole = useTokenStore((state) => state.user?.role) || "student";

  return (
    <>
      <Navbar role={userRole} />

      <div
        className={`transition-all duration-300 mt-16 ${
          open ? "ml-56" : "mx-auto"
        } max-md:ml-0`}
      >
        <Outlet />
        {!shouldHide && <Footer />}
      </div>
    </>
  );
}
// localStorage.clear();
// sessionStorage.clear();

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/").pop();
  console.log("location" , location)
  const hiddenPaths = ["AboutUs", "ContactUs", "SearchResults", "TermsofUse"];
  const shouldHide = hiddenPaths.includes(location);

  return (
    <>
      {shouldHide ? (
        <div>
          <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-[#0a0e19] flex items-center justify-between px-6 shadow-sm z-50">
            <button
              className="btn-secondary btn-hover transition"
              onClick={() => navigate("/UserLayout")}
            >
              Back To Dashboard
            </button>

            <div className="mt-5 max-sm:w-32">
              <LogoModes />
            </div>

            <img
              src={Image}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => navigate("/UserLayout")}
            />
          </header>
          <Outlet />
        </div>
      ) : (
        <SidebarProvider>
          <LayoutContent shouldHide={shouldHide} />
        </SidebarProvider>
      )}
    </>
  );
}

export default UserLayout;
