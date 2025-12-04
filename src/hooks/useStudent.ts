/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";

export interface CourseVM {
  id: number;
  title: string;
  image?: string;
  price?: number;
  [key: string]: any;
}
export interface CheckoutVM {
  checkoutId: number;
  checkoutDate: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  items: CourseVM[];
}

const useStudent = () => {
  const queryClient = useQueryClient();

  // -------- Save a course --------
  const saveCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.post<{ success: boolean; data: any }>(
        Urls.saveCourse + `?courseId=${courseId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCourses"] });
    },
  });

  // -------- Get saved courses --------
  const savedCourses = useQuery({
    queryKey: ["savedCourses"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: CourseVM[] }>(
        Urls.savedCourses
      );
      return res.data;
    },
  });

  // -------- Remove saved course --------
  const removeSavedCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.delete<{ success: boolean; data: any }>(
        Urls.removeSavedCourse + `?courseId=${courseId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCourses"] });
    },
  });

  // -------- Get my enrollments --------
  const myEnrollments = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: CourseVM[] }>(
        Urls.myEnrollments
      );
      return res.data;
    },
  });

  // -------- Enroll --------
  const enrollCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.post<{ success: boolean; data: any }>(
        Urls.enroll + `?courseId=${courseId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnrollments"] });
    },
  });

  // -------- Remove enrollment --------
  const removeEnrollment = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.delete<{ success: boolean; data: any }>(
        Urls.removeEnrollment + `?courseId=${courseId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnrollments"] });
    },
  });

  // -------- Add to Cart --------
  const addToCart = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.post(Urls.addToCart + `?courseId=${courseId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // -------- Get Cart --------
  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get(Urls.getCart);
      return res.data;
    },
  });

  // -------- Remove Cart Item --------
  const removeCartItem = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.delete(
        Urls.removeCartItem + `?courseId=${courseId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // -------- Checkout: Create a checkout --------
  const createCheckout = useMutation({
    mutationFn: async (paymentMethod: string = "card") => {
      const res = await api.post<{ success: boolean; data: any }>(
        Urls.createCheckout + `?paymentMethod=${paymentMethod}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
    },
  });

  // In your useStudent hook
const getCheckouts = useQuery({
  queryKey: ["myCheckouts"],
  queryFn: async () => {
    const res = await api.get<{ success: boolean; data: CheckoutVM[] }>(
      Urls.myCheckouts
    );
    // make sure to return an array even if API returns undefined
    return res.data?.data || [];
  },
  staleTime: 1000 * 60, // 1 minute caching
  retry: 1,
});

  // -------- Checkout: Get single checkout details --------
  const getCheckoutDetails = (checkoutId: number) =>
    useQuery({
      queryKey: ["checkoutDetails", checkoutId],
      queryFn: async () => {
        const res = await api.get<{ success: boolean; data: CheckoutVM }>(
          Urls.getCheckoutDetails.replace("{checkoutId}", checkoutId.toString())
        );
        return res.data.data;
      },
      enabled: !!checkoutId,
    });

  return {
    // Saves
    saveCourse,
    savedCourses,
    removeSavedCourse,

    // Enrollment
    myEnrollments,
    enrollCourse,
    removeEnrollment,

    // Cart
    addToCart,
    cart,
    removeCartItem,

    // Checkout
    createCheckout,
    getCheckouts,
    getCheckoutDetails,
  };
};

export default useStudent;
