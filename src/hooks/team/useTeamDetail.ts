import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi, TeamRole } from '@/api/Team/teamApi';
import message from 'antd/es/message';

export const useTeamDetail = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamApi.getTeam(teamId),
    enabled: !!teamId,
  });
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: () => teamApi.getTeamMembers(teamId),
    enabled: !!teamId,
  });
};

export const useAddMember = (teamId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: TeamRole }) => 
      teamApi.addMember(teamId, email, role),
    onSuccess: () => {
      message.success('Member added successfully');
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'members'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to add member');
    }
  });
};

export const useRemoveMember = (teamId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => teamApi.removeMember(teamId, userId),
    onSuccess: () => {
      message.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'members'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to remove member');
    }
  });
};

export const useTeamProjects = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId, 'projects'],
    queryFn: () => teamApi.getTeamProjects(teamId),
    enabled: !!teamId,
  });
};

export const useCreateProject = (teamId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, description, file }: { name: string; description?: string; file?: File }) => 
      teamApi.createProject(teamId, { name, description, file }),
    onSuccess: () => {
      message.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'projects'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create project');
    }
  });
};

export const useDeleteProject = (teamId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectId: string) => teamApi.deleteProject(teamId, projectId),
    onSuccess: () => {
      message.success('Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'projects'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete project');
    }
  });
};
