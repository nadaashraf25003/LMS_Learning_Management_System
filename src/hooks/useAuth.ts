/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";
import useTokenStore from "@/store/user";
import { useAppStore } from "@/store/app";

export interface LoginData {
  email: string;
  password: string;
}

export interface StudentRegisterData extends LoginData {
  fullName: string;
  phoneNumber: string;
  address: string;
  country: string;
  university: string;
  major: string;
  educationLevel: string;
  gender: "male" | "female";
}

export interface InstructorRegisterData extends LoginData {
  fullName: string;
  phoneNumber: string;
  address: string;
  country: string;
  gender: "male" | "female";
  specialization: string;
  yearOfExperience: number;
  bio?: string;
}

const useAuth = () => {
  const appStore = useAppStore();
  const tokenStore = useTokenStore();
  const queryClient = useQueryClient();

  // ✅ Login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.login, data);
      return response.data;
    },

    onSuccess: (data) => {
      tokenStore.setToken(data.token);
      tokenStore.setUser(data.user);
    },
    onError: (err: any) => {
      appStore.setError(err.message || "Login failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Logout
  const logout = () => {
    appStore.setIsLoading(true);
    try {
      tokenStore.setToken(null);
      tokenStore.setUser(undefined);
    } catch (err: any) {
      appStore.setError(err.message || "Logout failed");
    } finally {
      appStore.setIsLoading(false);
    }
  };

  // ✅ Student registration
  const studentRegisterMutation = useMutation({
    mutationFn: async (data: StudentRegisterData) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.studentRegister, data);
      return response.data;
    },

    onError: (err: any) => {
      appStore.setError(err.message || "Student registration failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Instructor registration
  const instructorRegisterMutation = useMutation({
    mutationFn: async (data: InstructorRegisterData) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.instrctorRegister, data);
      return response.data;
    },

    onError: (err: any) => {
      appStore.setError(err.message || "Instructor registration failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Verify email
  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.verifyEmail, { email, code });
      return response.data;
    },

    onSuccess: (data) => {
      tokenStore.setToken(data.token);
      tokenStore.setUser(data.user);
    },
    onError: (err: any) => {
      appStore.setError(err.message || "Email verification failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.forgotPassword, { email });
      return response.data;
    },

    onError: (err: any) => {
      appStore.setError(err.message || "Forgot password failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      code: string;
      newPassword: string;
    }) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.resetPassword, data);
      return response.data;
    },

    onError: (err: any) => {
      appStore.setError(err.message || "Reset password failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Refresh token
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.refreshToken);
      return response.data;
    },

    onSuccess: (data) => {
      tokenStore.setToken(data.token);
      tokenStore.setUser(data.user);
    },
    onError: (err: any) => {
      appStore.setError(err.message || "Token refresh failed");
    },
    onSettled: () => appStore.setIsLoading(false),
  });

  // ✅ Resend verification code
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      appStore.setIsLoading(true);
      const response = await api.post(Urls.resendVerification, { email });
      return response.data;
    },
    onSuccess: () => {
      appStore.setToast("Verification code sent successfully!", "success");
    },
    onError: (err: any) => {
      appStore.setError(err.message || "Failed to resend verification code");
    },
    onSettled: () => appStore.setIsLoading(false),
  });


  return {
    loginMutation,
    logout,
    studentRegisterMutation,
    instructorRegisterMutation,
    verifyEmailMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    refreshTokenMutation,
    resendVerificationMutation,
  };
};

export default useAuth;
