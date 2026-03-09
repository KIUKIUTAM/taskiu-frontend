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

export interface TeamMember {
  id: string;
  role: TeamRole;
  team?: Team;
  createdAt?: string;
  updatedAt?: string;
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
};

