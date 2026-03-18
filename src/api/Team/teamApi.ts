import { privateClient } from '@/api/api-client';

export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface Team {
  id?: string;
  teamId?: string;
  teamName?: string;
  teamDescription?: string | null;
  teamPicture?: string | null;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface TeamMember {
  id: string;
  role: TeamRole;
  team?: Team;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  projectId: string;
  projectName: string;
  projectDescription?: string;
  projectPictureUrl?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  file?: File;
}

export const teamApi = {
  createTeam: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await privateClient.post<Team>('/teams', data);
    return response.data;
  },

  getMyTeams: async (): Promise<TeamMember[]> => {
    const response = await privateClient.get<TeamMember[]>('/teams/me');
    return response.data;
  },

  getTeam: async (teamId: string): Promise<Team> => {
    const response = await privateClient.get<Team>(`/teams/${teamId}`);
    return response.data;
  },

  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await privateClient.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },

  addMember: async (teamId: string, email: string, role: TeamRole): Promise<TeamMember> => {
    const response = await privateClient.post<TeamMember>(`/teams/${teamId}/members`, {
      email,
      role,
    });
    return response.data;
  },

  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await privateClient.delete(`/teams/${teamId}/members/${userId}`);
  },

  // Projects
  getTeamProjects: async (teamId: string): Promise<Project[]> => {
    const response = await privateClient.get<Project[]>(`/teams/${teamId}/projects`);
    return response.data;
  },

  createProject: async (teamId: string, data: CreateProjectRequest): Promise<Project> => {
    const formData = new FormData();
    const requestData = {
      name: data.name,
      description: data.description,
    };
    
    // Append JSON data as a Blob with application/json type
    formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
    
    // Append file if exists
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await privateClient.post<Project>(`/teams/${teamId}/projects`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteProject: async (teamId: string, projectId: string): Promise<void> => {
    await privateClient.delete(`/teams/${teamId}/projects/${projectId}`);
  }
};
