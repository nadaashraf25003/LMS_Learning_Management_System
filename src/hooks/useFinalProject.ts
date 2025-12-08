import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
// import FinalProjectService from "@/store/Classes/FinalProject";
import { useAuth } from "@/hooks/useAuth";

// Define interfaces for types
interface FinalProject {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'approved';
  // Add more fields as needed based on your API response
}

interface AuthUser {
  id: string;
  // Add more user fields as needed
}

interface UseFinalProjectReturn {
  pendingProjects: UseQueryResult<FinalProject[], Error>;
  approvedProjects: UseQueryResult<FinalProject[], Error>;
  approveFinalProject: UseMutationResult<void, Error, string>;
  deleteFinalProject: UseMutationResult<void, Error, string>;
}

const useFinalProject = (): UseFinalProjectReturn => {
  const queryClient = useQueryClient();
  const { user } = useAuth() as { user: AuthUser | null }; // Type assertion based on your useAuth return
  const instructorId = user?.id;

  // Fetch pending final projects
  const pendingProjects = useQuery<FinalProject[], Error>({
    queryKey: ["pendingProjects", instructorId] as const,
    queryFn: () => FinalProjectService.getPendingProjects(instructorId!),
    enabled: !!instructorId,
  });

  // Fetch approved final projects
  const approvedProjects = useQuery<FinalProject[], Error>({
    queryKey: ["approvedProjects", instructorId] as const,
    queryFn: () => FinalProjectService.getApprovedProjects(instructorId!),
    enabled: !!instructorId,
  });

  // Mutation for approving a final project
  const approveFinalProject = useMutation<void, Error, string>({
    mutationFn: (id: string) => FinalProjectService.approveFinalProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProjects", instructorId] });
      queryClient.invalidateQueries({ queryKey: ["approvedProjects", instructorId] });
    },
  });

  // Mutation for deleting a final project
  const deleteFinalProject = useMutation<void, Error, string>({
    mutationFn: (id: string) => FinalProjectService.deleteFinalProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProjects", instructorId] });
      queryClient.invalidateQueries({ queryKey: ["approvedProjects", instructorId] });
    },
  });

  return {
    pendingProjects,
    approvedProjects,
    approveFinalProject,
    deleteFinalProject,
  };
};

export default useFinalProject;