/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaGlobe,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useCountries from "@/hooks/useCountries";
import Select from "react-select";
import { customSelectStyles } from "@/utils/SelectStyle";
import api from "@/API/Config";
import toast, { Toaster } from "react-hot-toast";

const InstructorRegisterEndPoint = "Auth/instructor-register";

const InstructorSchema = z.object({
  // Step 1 - Basic info
  fullName: z.string().min(8, "Full name must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // Step 2 - Contact info
  phone: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  country: z
    .object({ label: z.string(), value: z.string() })
    .refine((value) => value !== null, "Country is required"),
  gender: z
    .object({ label: z.string(), value: z.string() })
    .refine((value) => value !== null, "Gender is required"),

  // Step 3 - Instructor details
  specialization: z.string().min(3, "Specialization is required"),
  experienceYears: z
    .string()
    .min(1, "Years of experience is required")
    .regex(/^[0-9]+$/, "Must be a number"),
  bio: z.string().min(10, "Short bio is required"),

  policiesCheck: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions",
  }),
});

function InstructorRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { allCountries } = useCountries();

  const [formData, setFormData] = useLocalStorage("instructorSignup", {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    country: "",
    gender: "",
    specialization: "",
    experienceYears: "",
    bio: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(InstructorSchema),
    mode: "onChange",
  });

  // Sync form data with localStorage
  useEffect(() => {
    const subscription = watch((values) => {
      const { password, ...safeValues } = values;
      setFormData(safeValues);
    });
    return () => subscription.unsubscribe();
  }, [setFormData, watch]);

  useEffect(() => {
    if (formData) reset(formData);
  }, [reset]);

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["fullName", "email", "password"]);
    if (step === 2) valid = await trigger(["phone", "address", "country"]);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);
  const onSubmit = (data) => {
  const formattedData = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    address: data.address,
    country: data.country.value,
    gender: data.gender.value,
    specialization: data.specialization,
    years_Of_Experience: data.experienceYears,
    bio: data.bio,
    role: "Instructor",
  };

  api
    .post(InstructorRegisterEndPoint, formattedData)
    .then(() => {
      toast.success(
        "Registration successful! Please verify your email before logging in."
      );
      navigate("/User/verify-email", { state: { email: data.email } }); // Pass email to verify page
    })
    .catch((error) => {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.errorMessage ||
        "Something went wrong.";
      toast.error(errMsg);
    });
};

  return (
    <section className="my-5 mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress indicator */}
        <div className="flex justify-center mb-4 gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-3 h-3 rounded-full ${
                step >= n ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 - Basic Info */}
        {step === 1 && (
          <>
            {/* Full Name */}
            <div className="mb-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("fullName")}
                  placeholder="Full Name"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.fullName?.message}
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("email")}
                  placeholder="Email"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.password?.message}
              </p>
            </div>

            <Button type="button" onClick={nextStep} className="w-full mt-5">
              Next
            </Button>
          </>
        )}

        {/* STEP 2 - Contact Info */}
        {step === 2 && (
          <>
            {/* Phone */}
            <div className="mb-4">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="eg"
                    placeholder="Phone Number"
                    inputClassName="rounded-md px-3 py-2 w-full"
                  />
                )}
              />
              <p className="text-red-500 text-sm ml-2">
                {errors.phone?.message}
              </p>
            </div>

            {/* Address */}
            <div className="mb-4">
              <div className="relative">
                <FaHome className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("address")}
                  placeholder="Address"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.address?.message}
              </p>
            </div>

            {/* Country */}
            <div className="mb-4">
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={allCountries}
                    placeholder="Country"
                    onChange={(selected) => field.onChange(selected)}
                    value={field.value}
                    styles={customSelectStyles}
                  />
                )}
              />
              <p className="text-red-500 text-sm ml-2">
                {errors.country?.message}
              </p>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                    placeholder="Gender"
                    styles={customSelectStyles}
                  />
                )}
              />
              <p className="text-red-500 text-sm ml-2">
                {errors.gender?.message}
              </p>
            </div>

            <div className="flex justify-between mt-5">
              <Button type="button" onClick={prevStep} variant="secondary">
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 - Instructor Details */}
        {step === 3 && (
          <>
            {/* Specialization */}
            <div className="mb-4">
              <div className="relative">
                <FaBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("specialization")}
                  placeholder="Specialization (e.g. Web Development)"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.specialization?.message}
              </p>
            </div>

            {/* Experience Years */}
            <div className="mb-4">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  {...register("experienceYears")}
                  placeholder="Years of Experience"
                  className="px-10 py-2"
                />
              </div>
              <p className="text-red-500 text-sm ml-2">
                {errors.experienceYears?.message}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <textarea
                {...register("bio")}
                placeholder="Write a short bio about your teaching experience"
                className="w-full border rounded-md px-3 py-2"
                rows={4}
              />
              <p className="text-red-500 text-sm ml-2">{errors.bio?.message}</p>
            </div>

            {/* Policies */}
            <label className="text-sm text-text-secondary">
              <input
                {...register("policiesCheck")}
                type="checkbox"
                className="mr-2 accent-primary"
              />
              I agree to the{" "}
              <span
                className="text-secondary cursor-pointer font-bold"
                onClick={() => navigate("/TermsofUse")}
              >
                Terms of Use
              </span>{" "}
              and{" "}
              <span
                className="text-secondary cursor-pointer font-bold"
                onClick={() => navigate("/PrivacyPolicy")}
              >
                Privacy Policy
              </span>
            </label>
            <p className="text-red-500 text-sm mt-1">
              {errors.policiesCheck?.message}
            </p>

            <div className="flex justify-between mt-5">
              <Button type="button" onClick={prevStep} variant="secondary">
                Back
              </Button>
              <Button type="submit">Register</Button>
            </div>
          </>
        )}
      </form>

      <hr className="my-5 text-text-secondary" />

      <p className="text-text-secondary text-center">
        Already have an account?{" "}
        <span
          className="text-secondary cursor-pointer hover:scale-105 font-bold"
          onClick={() => navigate("/User/Login")}
        >
          Sign In
        </span>
      </p>

      <Link to="/User/Register">
        <Button className="mt-5 w-full cursor-pointer" variant="secondary">
          Student Register
        </Button>
      </Link>
    </section>
  );
}

export default InstructorRegister;
