import { useMutation, useQueryClient } from '@tanstack/react-query';
import message from 'antd/es/message';
import { useTranslation } from 'react-i18next';

import { teamApi, CreateTeamRequest } from '@/api/Team/teamApi';

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamApi.createTeam(data),
    onSuccess: async () => {
      message.success(t('teamCreated'));
      await queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
    },
    onError: () => {
      message.error(t('teamCreateFailed'));
    },
  });
};

