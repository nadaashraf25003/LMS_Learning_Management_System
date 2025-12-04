import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyEmailMutation } = useAuth();
  const { register, handleSubmit } = useForm();
  const email = state?.email;

  const onSubmit = (data) => {
    if (!email) {
      toast.error("Email not provided");
      return;
    }

    verifyEmailMutation.mutate(
      { email, code: data.code },
      {
        onSuccess: () => {
          toast.success("Email verified successfully! You can now log in.");
          navigate("/User/Login"); // redirect to login page
        },
        onError: (err) => {
          toast.error(err.message || "Verification failed");
        },
      }
    );
  };

  return (
    <section className="my-10 mx-auto max-w-md">
      <Toaster position="top-center" />
      <h2 className="text-center text-2xl font-bold mb-4">Verify Your Email</h2>

      {email && (
        <p className="text-center text-text-secondary mb-4">
          Verification code was sent to:{" "}
          <span className="font-bold text-primary">{email}</span>
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          {...register("code")}
          placeholder="Enter verification code"
          className="border rounded-md px-3 py-2"
        />

        <button
          type="submit"
          className="bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
        >
          Verify Email
        </button>
       
      </form>
       <button
          type="submit"
          className="bg-primary text-white py-2 rounded-md hover:bg-primary-dark mt-4 w-100 m-auto block"
          onClick={() => navigate("/User/resend-verification")}
        >
          Resend Verification Code
        </button>
    </section>
  );
}

export default VerifyEmail;
