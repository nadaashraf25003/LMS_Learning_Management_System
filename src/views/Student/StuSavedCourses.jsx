/* eslint-disable react-hooks/rules-of-hooks */

import React, { lazy, Suspense } from "react";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import useStudent from "@/hooks/useStudent";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import FullSpinner from "@/components/ui/Full Spinner/FullSpinner";

// Lazy load CourseCard
const CourseCard = lazy(() => import("@/views/Others/SearchResults/CourseCard"));

export default function StuSavedCourses() {
  const { savedCourses, removeSavedCourse } = useStudent();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeSavedCourse.mutate(id, {
      onSuccess: () => toast.success("Course removed successfully"),
      onError: () => toast.error("Failed to remove course"),
    });
  };

  if (savedCourses.isLoading) return  <FullSpinner />;
 
  
  const courses = savedCourses.data || [];
  // console.log("courses", courses);

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <div className="w-full flex justify-start">
        <LandingHeading header="Saved Courses" />
      </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRemove={() => handleRemove(course.id)}
                 onClick={() => navigate(`/StudentLayout/StuCourseDetails/${course.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No saved courses yet.</p>
        )}
    </div>
  );
}
