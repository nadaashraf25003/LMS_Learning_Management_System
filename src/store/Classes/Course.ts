import Urls from "@/API/URL";
import { useAppStore } from "../app";
import api from "@/API/Config";

export interface CourseData {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  authorId: number;
  views: string;
  posted: string;
  rating: number;
  hours: string;
  price: number;
  tag: string;
  image: string;
  studentsEnrolled: number;
  certificateIncluded: boolean;
  duration: string;
  instructorId: number;
  isApproved: boolean;
}

class Course {
  async addCourse(courseFormData: FormData) {
  try {
    useAppStore.setState({ saveLoading: true });
    const response = await api.post(Urls.addCourse, courseFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  } finally {
    useAppStore.setState({ saveLoading: false });
  }
}
  async getPendingCourses() {
    try {
      useAppStore.setState({ isLoading: true });
      const response = await api.get(Urls.getPendingCourses);
      if (response.status === 200) {
        // useAppStore.commit({ type: "setToast", payload: "Login Success" });
        return response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      useAppStore.setState({ isLoading: false });
    }
  }

  async getApprovedCourses() {
    try {
      useAppStore.setState({ isLoading: true });
      const response = await api.get(Urls.getApprovedCourses);
      if (response.status === 200) {
        // useAppStore.commit({ type: "setToast", payload: "Login Success" });
        return response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      useAppStore.setState({ isLoading: false });
    }
  }

  async getCourseById(id: string) {
    try {
      useAppStore.setState({ isLoading: true });
      const response = await api.get(Urls.getCourseById + id);
      if (response.status === 200) {
        // useAppStore.commit({ type: "setToast", payload: "Login Success" });
        return response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      useAppStore.setState({ isLoading: false });
    }
  }

  async approveCourse(id: string) {
    try {
      useAppStore.setState({ isLoading: true });
      const response = await api.put(Urls.approveCourse + id);
      if (response.status === 200) {
        // useAppStore.commit({ type: "setToast", payload: "Login Success" });
        return response.data;
      }
    } catch (err) {
      console.log("error-approveCourse", err);
    } finally {
      useAppStore.setState({ isLoading: false });
    }
  }

async updateCourse(id: string, courseFormData: FormData) {
  try {
    useAppStore.setState({ saveLoading: true });
    const response = await api.put(`${Urls.updateCourse}/${id}`, courseFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  } finally {
    useAppStore.setState({ saveLoading: false });
  }
}


  async deleteCourse(id: string) {
    try {
      useAppStore.setState({ isLoading: true });
      useAppStore.getState().setToastPosition("top-center");

      const response = await api.delete(Urls.deleteCourse + id);
      if (response.status === 200) {
        // useAppStore.commit({ type: "setToast", payload: "Login Success" });
        return response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      useAppStore.setState({ isLoading: false });
    }
  }
}

export default Course;
