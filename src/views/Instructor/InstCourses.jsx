import { useNavigate } from "react-router-dom";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import FinalProjectCard from "./FinalProjectCard";
import FinalProjectService from "@/store/Classes/FinalProject";
import toast from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import useFinalProject from "@/hooks/useFinalProject";
import FullSpinner from "@/components/ui/FullSpinner/FullSpinner";

function InstFinalProjects() {
  const { deleteFinalProject, pendingProjects, approvedProjects, approveFinalProject } =
    useFinalProject();
  const navigate = useNavigate();
  const { data: pendingProjectsData, isLoading } = pendingProjects;
  const { data: approvedProjectsData, isLoading: approvedIsLoading } =
    approvedProjects;

  const handleDelete = (id) => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to delete this final project?"
        onConfirm={async () => {
          toast.dismiss(t.id);
          await deleteFinalProject.mutateAsync(id, {
            onSuccess: () => {
              toast.success("Final project deleted");
            },
            onError: () => {
              toast.error("Failed to delete final project");
            },
          });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  const handleApprove = async (id) => {
    await approveFinalProject.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Final project approved");
      },
      onError: () => {
        toast.error("Failed to approve final project");
      },
    });
  };

  const handleEdit = (id) => {
    navigate(`/InstructorLayout/EditFinalProject/${id}`);
  };

  if (isLoading || approvedIsLoading) return <FullSpinner />;

  const projects = [
    ...(pendingProjectsData ?? []),
    ...(approvedProjectsData ?? [])
  ];

  return (
    <div className="p-6 flex flex-col items-center gap-6 bg-surface rounded-lg shadow-md">
      {/* Section Heading */}
      <LandingHeading header="My Final Projects" />

      {/* Manage Projects Button */}
      <button
        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
        onClick={() => navigate("/InstructorLayout/ManageFinalProjects")}
      >
        + Manage Final Projects
      </button>

      {/* Projects List */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.length ? (
          projects.map((project) => (
            <FinalProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                navigate(`/InstructorLayout/InstFinalProjectDetails/${project.id}`)
              }
              onRemove={() => handleDelete(project.id)}
              onEdit={() => handleEdit(project.id)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-4">
            No final projects available.
          </p>
        )}
      </div>
    </div>
  );
}

export default InstFinalProjects;