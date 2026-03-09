import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Empty, Form, Input, Modal, Tag, Skeleton, Avatar, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
  CrownOutlined,
  SettingOutlined,
  UserOutlined,
  CalendarOutlined,
  RightOutlined,
} from '@ant-design/icons';

import { useMyTeams } from '@/hooks/team/useMyTeams';
import { useCreateTeam } from '@/hooks/team/useCreateTeam';
import type { TeamMember, TeamRole } from '@/api/Team/teamApi';

type CreateTeamFormValues = {
  name: string;
  description?: string;
};

// ── Role 設定 ──────────────────────────────────────────────
const ROLE_CONFIG: Record<
  TeamRole,
  { label: string; color: string; icon: React.ReactNode; bgColor: string; textColor: string }
> = {
  OWNER: {
    label: 'Owner',
    color: 'gold',
    icon: <CrownOutlined />,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  ADMIN: {
    label: 'Admin',
    color: 'blue',
    icon: <SettingOutlined />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  MEMBER: {
    label: 'Member',
    color: 'default',
    icon: <UserOutlined />,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
  },
};

// ── 產生 Avatar 顏色（根據名稱） ───────────────────────────
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
];

const getAvatarColor = (name: string) => {
  const index =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ── Team Card ──────────────────────────────────────────────
const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const { t } = useTranslation('common');
  const teamName = member.team?.teamName ?? t('unknownTeam');
  const teamDescription = member.team?.teamDescription ?? null;
  const teamPublicId = member.team?.teamId ?? '';
  const joinedAt = formatDate(member.createdAt);
  const roleConfig = ROLE_CONFIG[member.role];
  const avatarColor = getAvatarColor(teamName);
  const initials = teamName.slice(0, 2).toUpperCase();

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md cursor-pointer">
      {/* 頂部：Avatar + 名稱 + Role */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Team Avatar */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${avatarColor} text-white text-base font-bold shadow-sm`}
          >
            {initials}
          </div>

          {/* 名稱 + Public ID */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {teamName}
              </span>
            </div>
            {teamPublicId && (
              <Tooltip title="Team ID">
                <span className="text-xs text-gray-400 font-mono">{teamPublicId}</span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Role Badge */}
        <div
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleConfig.bgColor} ${roleConfig.textColor}`}
        >
          {roleConfig.icon}
          <span>{roleConfig.label}</span>
        </div>
      </div>

      {/* 描述 */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {teamDescription ?? (
          <span className="italic text-gray-300">{t('noDescription')}</span>
        )}
      </p>

      {/* 底部：加入時間 + 箭頭 */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
        {joinedAt ? (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarOutlined className="text-gray-300" />
            <span>
              {t('joined')} {joinedAt}
            </span>
          </div>
        ) : (
          <span />
        )}
        <RightOutlined className="text-gray-300 text-xs transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
      </div>
    </div>
  );
};

// ── Skeleton Card ──────────────────────────────────────────
const TeamCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <Skeleton.Avatar active size={48} shape="square" />
      <div className="flex-1">
        <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 1, width: '40%' }} />
      </div>
    </div>
    <Skeleton active paragraph={{ rows: 2 }} title={false} />
  </div>
);

// ── Stats Bar ──────────────────────────────────────────────
const StatsBar: React.FC<{ teams: TeamMember[] }> = ({ teams }) => {
  const { t } = useTranslation('common');
  const ownerCount = teams.filter((m) => m.role === 'OWNER').length;
  const adminCount = teams.filter((m) => m.role === 'ADMIN').length;
  const memberCount = teams.filter((m) => m.role === 'MEMBER').length;

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span className="font-medium text-gray-700">
        {teams.length} {t('teams')}
      </span>
      <span className="text-gray-200">|</span>
      {ownerCount > 0 && (
        <span className="flex items-center gap-1 text-amber-600">
          <CrownOutlined />
          {ownerCount} Owner
        </span>
      )}
      {adminCount > 0 && (
        <span className="flex items-center gap-1 text-blue-600">
          <SettingOutlined />
          {adminCount} Admin
        </span>
      )}
      {memberCount > 0 && (
        <span className="flex items-center gap-1 text-gray-500">
          <UserOutlined />
          {memberCount} Member
        </span>
      )}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────
const TeamPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm<CreateTeamFormValues>();

  const myTeamsQuery = useMyTeams();
  const createTeamMutation = useCreateTeam();

  const teams = useMemo(() => myTeamsQuery.data ?? [], [myTeamsQuery.data]);

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => {
    setCreateOpen(false);
    form.resetFields();
  };

  const onCreate = async () => {
    const values = await form.validateFields();
    createTeamMutation.mutate(values, {
      onSuccess: () => closeCreate(),
    });
  };

  const renderContent = () => {
    // Loading
    if (myTeamsQuery.isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    // Empty
    if (teams.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-400">{t('noTeams')}</span>
            }
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="large">
            {t('createTeam')}
          </Button>
        </div>
      );
    }

    // Grid
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white shadow-sm">
              <TeamOutlined className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('team')}</h1>
              <p className="text-sm text-gray-500">{t('teamPageSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => myTeamsQuery.refetch()}
              loading={myTeamsQuery.isFetching}
            >
              {t('refresh')}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              {t('createTeam')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {!myTeamsQuery.isLoading && teams.length > 0 && (
          <div className="mb-4">
            <StatsBar teams={teams} />
          </div>
        )}

        {/* Content */}
        <div>{renderContent()}</div>
      </div>

      {/* Create Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-white">
              <TeamOutlined />
            </div>
            <span>{t('createTeam')}</span>
          </div>
        }
        open={createOpen}
        onCancel={closeCreate}
        onOk={onCreate}
        okText={t('create')}
        cancelText={t('cancel')}
        confirmLoading={createTeamMutation.isPending}
        destroyOnHidden
        width={480}
      >
        <Form form={form} layout="vertical" requiredMark={false} className="mt-4">
          <Form.Item
            label={t('teamName')}
            name="name"
            rules={[
              { required: true, message: t('teamNameRequired') },
              { min: 2, message: t('teamNameMin') },
            ]}
          >
            <Input
              prefix={<TeamOutlined className="text-gray-300" />}
              placeholder={t('teamNamePlaceholder')}
              size="large"
            />
          </Form.Item>

          <Form.Item label={t('teamDescription')} name="description">
            <Input.TextArea
              rows={4}
              placeholder={t('teamDescriptionPlaceholder')}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamPage;
