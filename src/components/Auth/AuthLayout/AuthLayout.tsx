import { Outlet, useLocation, useNavigate } from "react-router";
import authIMG from "@/assets/authIMG.webp";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LogoModes from "@/components/ui/LogoTheme/LogoModes";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/utils/ThemeProvider";
import { SocialButtons } from "@/assets/Constants/Features";
import SocialButton from "../SocialButton/SocialButton";
import useTokenStore from "@/store/user";
import { useEffect } from "react";

const AuthLayout = () => {
  const { theme } = useTheme();
  const pathname = useLocation().pathname;
  const page = pathname.split("/").pop(); // Get last part of URL
  const { token } = useTokenStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      // navigate("/UserLayout");
    }
  }, [token]);

  // Determine the header title and description
  const getHeaderTitle = () => {
    if (page === "Login") return "Log In";
    if (page === "Register") return "Sign Up";
    if (page === "ForgetPassword") return "Forgot Password";
    if (page === "ResetPassword") return "Reset Password";
    return "";
  };

  const getHeaderDescription = () => {
    if (page === "Login") return "Log in to your Learnify account!";
    if (page === "Register") return "Sign up to start your Learnify journey!";
    if (page === "ForgetPassword")
      return "Enter your email to receive a password reset code.";
    if (page === "ResetPassword")
      return "Enter your email, reset code, and new password.";
    return "";
  };

  const showSocialButtons =
    page !== "ForgetPassword" && page !== "ResetPassword";

  return (
    <main className="min-h-dvh overflow-y-auto bg-surface">
      <div className="flex min-h-dvh mx-0 rounded-md px-0 border-border shadow-lg">
        <Card className="w-full border-none flex-3 px-5">
          <CardHeader className="text-center">
            <div className="mx-auto">
              <LogoModes />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              Welcome to Learnify
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {getHeaderDescription()}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {showSocialButtons &&
              SocialButtons.map((item, i) => (
                <SocialButton
                  key={i}
                  Icon={item.Icon}
                  title={item.title}
                  color={item.color}
                />
              ))}

            {showSocialButtons && <Separator />}

            <main className="mt-4">
              <Outlet />
            </main>
          </CardContent>
        </Card>

        <div className="flex-5 rounded-md hidden md:block relative">
          {theme === "dark" && (
            <div className="w-full h-full bg-black/40 opacity-45 absolute" />
          )}
          <img
            src={authIMG}
            alt="auth"
            loading="lazy"
            className="w-full h-full object-left object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
