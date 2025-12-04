/* eslint-disable no-unused-vars */
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAppStore } from "@/store/app";
import useAuth from "@/hooks/useAuth";
import { Toaster } from 'react-hot-toast';
import useTokenStore from "@/store/user";
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Login() {
  const navigate = useNavigate();
  const { setToast } = useAppStore();
   const { setToken } = useTokenStore();
  const { loginMutation } = useAuth();

  const {
    // register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

const onSubmit = async (data) => {
  await loginMutation.mutateAsync(data, {
    onSuccess(data) {
      // If login successful
      setToken(data.token);
      setToast("Login Success", "success");
      // navigate("/");
    },
    onError(err) {
      // Get the error message from backend
      const message = err.response?.data?.message || err.message || "Login failed";

      // Handle different cases
      if (message.toLowerCase().includes("email") && message.toLowerCase().includes("not found")) {
        setToast("Email does not exist. Please register first.", "error");
      } else if (message.toLowerCase().includes("password") || message.toLowerCase().includes("invalid")) {
        setToast("Incorrect password. Please try again.", "error");
      } else if (message.toLowerCase().includes("verify") || message.toLowerCase().includes("not verified")) {
        setToast("Your email is not verified. Please verify your email first.", "error");
        navigate("/User/VerifyEmail", { state: { email: data.email } });
      } else {
        setToast(message, "error");
      }
    },
  });
};

  return (
    <section className="my-5 space-y-6 max-w-md mx-auto">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input {...field} type="text" placeholder="Enter email..." className="px-10" />
              </div>
            )}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>}
        </div>

        <div className="mb-5">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input {...field} type="password" placeholder="Enter password..." className="px-10 py-2" />
              </div>
            )}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>}
        </div>

        <button type="submit" className="btn bg-secondary w-full hover:scale-102 my-5">
          Login
        </button>
      </form>

      <p className="text-text-secondary">
        Or{" "}
        <span
          className="text-secondary cursor-pointer hover:scale-105 font-bold"
          onClick={() => navigate("/User/ForgetPassword")}
        >
          Forgot Password?
        </span>
      </p>

      <hr className="my-5 text-text-secondary" />

      <p className="text-text-secondary">
        Don't have an account?{" "}
        <button
          className="text-secondary cursor-pointer hover:scale-105 font-bold"
          onClick={() => navigate("/User/Register")}
          disabled={loginMutation.isPending}
        >
          Sign Up
        </button>
      </p>
      <p className="text-text-secondary">
        Resend Verification Code?{" "}
        <button
          className="text-secondary cursor-pointer hover:scale-105 font-bold"
          onClick={() => navigate("/User/resend-verification")}
          // disabled={loginMutation.isPending}
        >
          Resend Verification Code
        </button>
      </p>
    </section>
  );
}

export default Login;
