import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";

function ResendVerification() {
  const { resendVerificationMutation } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    resendVerificationMutation.mutate(data.email, {
      onSuccess: () => {
        toast.success("Code sent successfully! Check your inbox.");
        navigate("/User/verify-email", { state: { email: data.email } });
      },
      onError: () => {
        toast.error("Email not found or something went wrong.");
      },
    });
  };

  return (
    <section className="my-10 mx-auto max-w-md">
      <Toaster position="top-center" />

      <h2 className="text-center text-2xl font-bold mb-4 text-primary">
        Resend Verification Code
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="border rounded-md px-3 py-2"
          required
        />

        <button
          type="submit"
          className="bg-secondary text-white py-2 rounded-md hover:scale-105 transition-all"
        >
          Send Code
        </button>
      </form>

      {/* <p className="text-center mt-3 text-sm">
        Already have a code?{" "}
        <span
          className="text-secondary cursor-pointer hover:underline font-bold"
          onClick={() => navigate("/User/verify-email")}
        >
          Verify now
        </span>
      </p> */}
    </section>
  );
}

export default ResendVerification;
