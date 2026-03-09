import { useQuery } from '@tanstack/react-query';
import { teamApi } from '@/api/Team/teamApi';

export const useMyTeams = () => {
  return useQuery({
    queryKey: ['teams', 'me'],
    queryFn: teamApi.getMyTeams,
    retry: false,
    staleTime: 1000 * 30,
  });
};

