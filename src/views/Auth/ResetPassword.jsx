/* eslint-disable no-unused-vars */
import { useTheme } from "@/utils/ThemeProvider";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate, useLocation } from "react-router";
import { FaEnvelope, FaLock } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const ResetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z.string().min(6, "Enter the 6-digit code"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email ?? "";

  const { resetPasswordMutation, resendVerificationMutation } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  const emailValue = watch("email");

  const onSubmit = (data) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Password reset successfully");
        navigate("/User/Login");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };

  const handleResendCode = () => {
    resendVerificationMutation.mutate(
      { email: emailValue },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Verification code sent!");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to resend code");
        },
      }
    );
  };

  return (
    <section className="my-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            {...register("email")}
            type="text"
            placeholder="Enter your email..."
            className="bg-input px-10 py-2"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Verification Code */}
        <div className="mb-4 relative">
          <Input
            {...register("code")}
            type="text"
            placeholder="Enter verification code"
            className="bg-input px-3 py-2"
          />
          <p className="text-red-500 text-sm">{errors.code?.message}</p>
        </div>

        {/* Resend Button */}
        {/* <p
          className="text-secondary text-sm cursor-pointer hover:underline font-bold mb-2"
          onClick={handleResendCode}
        >
          {resendVerificationMutation.isPending
            ? "Sending..."
            : "Resend Verification Code"}
        </p> */}

        {/* New Password */}
        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            {...register("newPassword")}
            type="password"
            placeholder="Enter new password"
            className="bg-input px-10 py-2"
          />
          <p className="text-red-500 text-sm">{errors.newPassword?.message}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn bg-secondary w-full cursor-pointer hover:scale-102 my-5"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* Back Link */}
      <p className="text-text-secondary">
        Go Back{" "}
        <span
          className="text-secondary cursor-pointer hover:scale-105 font-bold"
          onClick={() => navigate("/User/Login")}
        >
          Sign In
        </span>
      </p>
    </section>
  );
}

export default ResetPassword;
