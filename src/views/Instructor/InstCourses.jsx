import { useNavigate } from "react-router-dom";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import CourseCard from "./CourseCard";
import CourseService from "@/store/Classes/Course";
import toast from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import useCourse from "@/hooks/useCourse";
import FullSpinner from "@/components/ui/Full Spinner/FullSpinner";

function InstCourses() {
  const { deleteCourse, pendingCourses, approvedCourses, approveCourse } =
    useCourse();
  const navigate = useNavigate();
  const { data: pendingCoursesData, isLoading } = pendingCourses;
  const { data: approvedCoursesData, isLoading: approvedIsLoading } =
    approvedCourses;

  console.log(pendingCourses, approvedCourses);
  const handleDelete = (id) => {
    console.log(id);
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to delete this course?"
        onConfirm={async () => {
          toast.dismiss(t.id);
          await deleteCourse.mutateAsync(id, {
            onSuccess: () => {
              toast.success("Course deleted");
            },
            onError: () => {
              toast.error("Failed to delete course");
            },
          });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  //  // Delete course
  // const handleDelete = (course) => {
  //   toast.custom((t) => (
  //     <ConfirmToast
  //       message={`Delete ${course.title}?`}
  //       onConfirm={() => {
  //         api
  //           .delete(`${DeleteCourseEndPoint}/${course.id}`)
  //           .then(() => {
  //             setCourses((prev) => prev.filter((c) => c.id !== course.id));
  //             toast.success(`Deleted ${course.title}`);
  //           })
  //           .catch(() => toast.error("Failed to delete course"));
  //       }}
  //       onCancel={() => toast.dismiss(t.id)}
  //     />
  //   ));
  // };

  //   const handleDelete = (course) => {
  //   toast.custom((t) => (
  //     <ConfirmToastno
  //       message={`Delete course "${course.title}"?`}
  //       onConfirm={() => {
  //         courseService
  //           .deleteCourse(course.id)
  //           .then(() => {
  //             setPendingCourses((prev) =>
  //               prev.filter((c) => c.id !== course.id)
  //             );
  //             setApprovedCourses((prev) =>
  //               prev.filter((c) => c.id !== course.id)
  //             );
  //             toast.success("Course deleted");
  //             toast.dismiss(t.id);
  //           })
  //           .catch(() => {
  //             toast.error("Error deleting course");
  //           });
  //       }}
  //       onCancel={() => toast.dismiss(t.id)}
  //     />
  //   ));
  // };

  const handleApprove = async (id) => {
    await approveCourse.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Course approved");
      },
      onError: () => {
        toast.error("Failed to approve course");
      },
    });
  };

  const handleEdit = (id) => {
    navigate(`/InstructorLayout/CreateCourse/${id}`);
  };

  if (isLoading || approvedIsLoading) return <FullSpinner />;
const courses = [
  ...(pendingCoursesData ?? []),
  ...(approvedCoursesData ?? [])
];

  return (
    <div className="p-6 flex flex-col items-center gap-6 bg-surface rounded-lg shadow-md">
      {/* Section Heading */}
      <LandingHeading header="My Created Courses" />

      {/* Create Course Button */}
      <button
        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
        onClick={() => navigate("/InstructorLayout/CreateCourse")}
      >
        + Create Course
      </button>

      {/* Courses List */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.length ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() =>
                navigate(`/InstructorLayout/InstCourseDetails/${course.id}`)
              }
              onRemove={() => handleDelete(course.id)}
              onEdit={() => handleEdit(course.id)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-4">
            No courses created.
          </p>
        )}
      </div>
    </div>
  );
}

export default InstCourses;
