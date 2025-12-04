import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";
import useTokenStore from "@/store/user";

const useProfile = () => {
  const { user } = useTokenStore.getState();
  const UserRole = user?.role?.toLowerCase() ?? "admin";

  let ProfileEndpoint = "";
  switch (UserRole) {
    case "student":
      ProfileEndpoint = Urls.studentprofile;
      break;
    case "instructor":
      ProfileEndpoint = Urls.instructorprofile;
      break;
    case "admin":
      ProfileEndpoint = Urls.adminprofile;
      break;
    default:
      throw new Error("Invalid role");
  }

  const profile = useQuery({
    queryKey: ["profile", UserRole],
    queryFn: async () => {
      const res = await api.get(ProfileEndpoint);
      return res.data;
    },
    enabled: !!UserRole,
  });

  return { profile, UserRole };
};

export default useProfile;
