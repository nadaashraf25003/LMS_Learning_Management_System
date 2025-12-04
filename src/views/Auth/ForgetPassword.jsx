/* eslint-disable no-unused-vars */
import { useTheme } from "@/utils/ThemeProvider";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router";
import { FaEnvelope } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const ForgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function ForgetPassword() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { forgotPasswordMutation } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: (res) => {
        toast.success(res.message || "Reset code sent successfully");
        navigate("/User/ResetPassword", { state: { email: data.email } });
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };

  return (
    <section className="my-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            {...register("email")}
            type="text"
            placeholder="Enter your email..."
            className="bg-input px-10 py-2"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* Send Button */}
        <button
          className="btn bg-secondary w-full cursor-pointer hover:scale-102 my-5"
          type="submit"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      {/* Back to Login */}
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

export default ForgetPassword;
