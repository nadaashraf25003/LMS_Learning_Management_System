import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import useTokenStore from "@/store/user";
import useStudent from "@/hooks/useStudent";
import useNotification from "@/hooks/useNotification";

export function MenubarDemo({ role }) {
  
  // const Role = useTokenStore((state) => state.user?.role) ? true : false;
  const navigate = useNavigate();
  console.log(role)

  // Hook calls
  const { cart } = useStudent();
  const { getNotifications } = useNotification();
    const { data, isLoading: loading } = getNotifications();

  // Counts
  const cartCount = cart?.data?.length ?? 0;
  const unreadNotificationCount = data?.unreadCount || 0;
  // console.log("Cart Count:", cartCount);
  // console.log("Unread Notification Count:", unreadNotificationCount);

  return (
    <Menubar>
      <MenubarMenu>
        {role=="student" && (
          <MenubarTrigger
            onClick={() => navigate("/StudentLayout/StuShoppingCart")}
            className="relative"
          >
            <i className="fa-solid fa-cart-shopping text-xl"></i>

            {cartCount > 0 && (
              <Badge className="absolute -top-3 -right-2 text-xs px-1 bg-red-600">
                {cartCount}
              </Badge>
            )}
          </MenubarTrigger>
        )}
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger
          onClick={() => navigate("/UserLayout/Notifications")}
          className="relative"
        >
          <i className="fa-solid fa-bell text-xl"></i>

          {unreadNotificationCount > 0 && (
            <Badge className="absolute -top-3 -right-2 text-xs px-1 bg-red-600">
              {unreadNotificationCount}
            </Badge>
          )}
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
