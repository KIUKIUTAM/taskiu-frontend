import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  UserAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import {
  Typography,
  Avatar,
  Button,
  Card,
  Tag,
  Skeleton,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Empty,
  Upload,
  Badge,
  Tooltip,
  Space,
  Divider,
} from 'antd';
import {
  useTeamDetail,
  useTeamMembers,
  useAddMember,
  useRemoveMember,
  useTeamProjects,
  useCreateProject,
  useDeleteProject,
} from '@/hooks/team/useTeamDetail';
import { TeamRole } from '@/api/Team/teamApi';

const { Title, Text, Paragraph } = Typography;

// ─── Role Config ──────────────────────────────────────────────────────────────
// Maps role keys to display color, icon, and i18n label key
const ROLE_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; labelKey: string }
> = {
  OWNER: { color: 'gold', icon: <CrownOutlined />, labelKey: 'team.role.owner' },
  ADMIN: { color: 'blue', icon: <SafetyCertificateOutlined />, labelKey: 'team.role.admin' },
  MEMBER: { color: 'default', icon: <UserOutlined />, labelKey: 'team.role.member' },
};

// ─── Role Select Options ──────────────────────────────────────────────────────
// Used in invite modal — avoids deprecated Select.Option children pattern
const getRoleOptions = (t: (key: string) => string) => [
  {
    value: 'ADMIN',
    label: (
      <Space>
        <SafetyCertificateOutlined className="text-blue-500" />
        {t('team.role.admin')}
      </Space>
    ),
  },
  {
    value: 'MEMBER',
    label: (
      <Space>
        <UserOutlined className="text-gray-500" />
        {t('team.role.member')}
      </Space>
    ),
  },
];

// ─── MemberCard ───────────────────────────────────────────────────────────────
// Displays a single team member row with role badge and remove action

interface MemberCardProps {
  item: any;
  onRemove: (userId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ item, onRemove }) => {
  const { t } = useTranslation('common');

  const role = ROLE_CONFIG[item.role] ?? ROLE_CONFIG.MEMBER;
  const displayName = item.user?.name || item.user?.email || 'Unknown';
  const initial = displayName[0]?.toUpperCase();

  // Extract nested ternary — fix for sonarqube(typescript:S3358)
  const renderRemoveAction = () => {
    if (item.role === 'OWNER') return null;
    return (
      <Popconfirm
        title={t('team.member.removeTitle')}
        description={t('team.member.removeConfirm')}
        onConfirm={() => onRemove(item.user.id)}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        okButtonProps={{ danger: true }}
      >
        <Tooltip title={t('team.member.remove')}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          />
        </Tooltip>
      </Popconfirm>
    );
  };

  return (
    <div className="member-card group flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 min-w-0">
        {/* Online status badge wrapping avatar */}
        <Badge dot color="green" offset={[-2, 32]} style={{ boxShadow: '0 0 0 2px white' }}>
          <Avatar
            src={item.user?.picture}
            size={44}
            className="shrink-0 bg-linear-to-br from-indigo-400 to-purple-500 font-semibold text-white"
          >
            {initial}
          </Avatar>
        </Badge>

        {/* Member name, role tag, and email */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-800 truncate">{displayName}</span>
            <Tag icon={role.icon} color={role.color} className="text-xs m-0 leading-none">
              {t(role.labelKey)}
            </Tag>
          </div>
          <Text type="secondary" className="text-xs truncate block">
            {item.user?.email}
          </Text>
        </div>
      </div>

      {renderRemoveAction()}
    </div>
  );
};

// ─── ProjectCard ──────────────────────────────────────────────────────────────
// Displays a project card with hover accent bar and action buttons

interface ProjectCardProps {
  project: any;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const { t } = useTranslation('common');

  // Extracted from inline onClick to avoid nested ternary warnings
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: t('team.project.deleteTitle'),
      content: t('team.project.deleteConfirm', { name: project.projectName }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: () => onDelete(project.projectId),
    });
  };

  // Extract avatar rendering to avoid nested ternary — fix for sonarqube(typescript:S3358)
  const renderProjectAvatar = () => {
    if (project.projectPictureUrl) {
      return <Avatar shape="square" size={48} src={project.projectPictureUrl} className="rounded-lg" />;
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <FolderOpenOutlined className="text-indigo-500 text-xl" />
      </div>
    );
  };

  return (
    <Card
      hoverable
      className="project-card overflow-hidden border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group relative"
      // Fix: bodyStyle deprecated → use styles.body in antd v6
      styles={{ body: { padding: '16px' } }}
    >
      {/* Top accent bar — visible on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-3">
        <div className="shrink-0">{renderProjectAvatar()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Text strong className="text-gray-800 truncate block leading-tight">
              {project.projectName}
            </Text>

            {/* Action buttons — visible on hover */}
            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip title={t('common.settings')}>
                <Button type="text" size="small" icon={<SettingOutlined />} className="text-gray-400 hover:text-indigo-500" />
              </Tooltip>
              <Tooltip title={t('common.delete')}>
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={handleDelete} />
              </Tooltip>
            </div>
          </div>

          <Paragraph
            ellipsis={{ rows: 2 }}
            className="text-gray-400 text-xs mt-1 mb-0 leading-relaxed"
          >
            {project.projectDescription || t('team.project.noDescription')}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

// ─── TeamDetailPage ───────────────────────────────────────────────────────────
// Main page — renders team header, members tab, and projects tab

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const [activeTab, setActiveTab] = useState('members');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  // ── Data Fetching ─────────────────────────────────────────────────────────
  const { data: team, isLoading: isTeamLoading } = useTeamDetail(teamId!);
  const { data: members, isLoading: isMembersLoading } = useTeamMembers(teamId!);
  const { data: projects, isLoading: isProjectsLoading } = useTeamProjects(teamId!);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: addMember, isPending: isAddingMember } = useAddMember(teamId!);
  const { mutate: removeMember } = useRemoveMember(teamId!);
  const { mutate: createProject, isPending: isCreatingProject } = useCreateProject(teamId!);
  const { mutate: deleteProject } = useDeleteProject(teamId!);

  const [inviteForm] = Form.useForm();
  const [projectForm] = Form.useForm();

  const MEMBER_SKELETON_KEYS = ['ms-1', 'ms-2', 'ms-3', 'ms-4'] as const;
  const PROJECT_SKELETON_KEYS = ['ps-1', 'ps-2', 'ps-3', 'ps-4', 'ps-5', 'ps-6'] as const;

  // ── Modal Handlers ────────────────────────────────────────────────────────

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    inviteForm.resetFields();
  };

  const handleCloseProjectModal = () => {
    setIsCreateProjectModalOpen(false);
    projectForm.resetFields();
  };

  // Submit invite form — calls addMember mutation
  const handleInvite = (values: { email: string; role: TeamRole }) => {
    addMember(values, { onSuccess: handleCloseInviteModal });
  };

  // Submit create project form — extracts File object from Upload fileList
  const handleCreateProject = (values: { name: string; description: string; file: any }) => {
    const file = values.file?.[0]?.originFileObj ?? null;
    createProject(
      { name: values.name, description: values.description, file },
      { onSuccess: handleCloseProjectModal }
    );
  };

  // ── Loading State ─────────────────────────────────────────────────────────
  if (isTeamLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton.Input active size="large" block />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // ── Not Found State ───────────────────────────────────────────────────────
  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">{t('team.notFound')}</Text>}
        />
        <Button type="primary" onClick={() => navigate(-1)}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  // ── Skeleton Loaders ──────────────────────────────────────────────────────
  // Extracted to avoid inline nested ternary in tab children

  const renderMembersContent = () => {
    if (isMembersLoading) {
    return (
      <div className="space-y-3">
        {MEMBER_SKELETON_KEYS.map((key) => (
          <Skeleton key={key} avatar active paragraph={{ rows: 1 }} />
        ))}
      </div>
    );
  }
    if (members && members.length > 0) {
      return (
        <div className="space-y-2">
          {members.map((item: any) => (
            // Use unique user id as key — fix for sonarqube(typescript:S6479)
            <MemberCard key={item.user?.id} item={item} onRemove={(userId) => removeMember(userId)} />
          ))}
        </div>
      );
    }
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('team.member.empty')}>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsInviteModalOpen(true)}>
          {t('team.member.inviteFirst')}
        </Button>
      </Empty>
    );
  };

  const renderProjectsContent = () => {
    if (isProjectsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECT_SKELETON_KEYS.map((key) => (
          <Card key={key}>
            <Skeleton avatar active paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    );
  }
    if (projects && projects.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            // Use unique project id as key — fix for sonarqube(typescript:S6479)
            <ProjectCard key={project.projectId} project={project} onDelete={(id) => deleteProject(id)} />
          ))}
        </div>
      );
    }
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('team.project.empty')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateProjectModalOpen(true)}>
          {t('team.project.createFirst')}
        </Button>
      </Empty>
    );
  };

  // ── Tab Definitions ───────────────────────────────────────────────────────
  const tabItems = [
    {
      key: 'members',
      label: (
        <span className="flex items-center gap-2 px-2">
          <TeamOutlined />
          <span>{t('team.tabs.members')}</span>
          {members && <Badge count={members.length} size="small" color="geekblue" overflowCount={99} />}
        </span>
      ),
      children: (
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-5">
            <div>
              <Title level={4} style={{ margin: 0 }}>{t('team.member.title')}</Title>
              <Text type="secondary" className="text-sm">
                {t('team.member.count', { count: members?.length ?? 0 })}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 border-none shadow-sm"
            >
              {t('team.member.invite')}
            </Button>
          </div>
          {renderMembersContent()}
        </div>
      ),
    },
    {
      key: 'projects',
      label: (
        <span className="flex items-center gap-2 px-2">
          <ProjectOutlined />
          <span>{t('team.tabs.projects')}</span>
          {projects && <Badge count={projects.length} size="small" color="geekblue" overflowCount={99} />}
        </span>
      ),
      children: (
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-5">
            <div>
              <Title level={4} style={{ margin: 0 }}>{t('team.project.title')}</Title>
              <Text type="secondary" className="text-sm">
                {t('team.project.count', { count: projects?.length ?? 0 })}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 border-none shadow-sm"
            >
              {t('team.project.create')}
            </Button>
          </div>
          {renderProjectsContent()}
        </div>
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Team Header ── */}
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50/60 via-white to-purple-50/40 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-100/40 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-100/30 pointer-events-none" />

        <div className="relative flex justify-between items-start gap-4">
          <div className="flex gap-4 items-center">
            {/* Team initial avatar */}
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-200 shrink-0">
              {team.teamName?.[0]?.toUpperCase()}
            </div>
            <div>
              <Title level={2} style={{ margin: 0, lineHeight: 1.2 }}>{team.teamName}</Title>
              <Text type="secondary" className="text-sm mt-1 block">
                {team.teamDescription || t('team.noDescription')}
              </Text>
              {/* Quick-glance stats tags */}
              <div className="flex gap-2 mt-2">
                <Tag color="geekblue" icon={<TeamOutlined />}>
                  {t('team.member.count', { count: members?.length ?? 0 })}
                </Tag>
                <Tag color="purple" icon={<ProjectOutlined />}>
                  {t('team.project.count', { count: projects?.length ?? 0 })}
                </Tag>
              </div>
            </div>
          </div>
          <Button icon={<SettingOutlined />} className="shrink-0 hover:border-indigo-400 hover:text-indigo-500">
            {t('common.settings')}
          </Button>
        </div>
      </div>

      {/* ── Main Content Tabs ──
          Fix: tabPosition deprecated in antd v6 → use items with layout wrapper instead */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex min-h-125">
        {/* Left nav sidebar — replaces deprecated tabPosition="left" */}
        <div className="team-tab-nav bg-gray-50 border-r border-gray-100 py-3 min-w-60 shrink-0">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center text-left px-3 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 mb-1
                ${activeTab === tab.key
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-500'
                }`}
              style={{ width: 'calc(100% - 16px)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content panel */}
        <div className="flex-1 overflow-auto">
          {tabItems.find((tab) => tab.key === activeTab)?.children}
        </div>
      </div>

      {/* ── Invite Member Modal ──
          Fix: destroyOnClose deprecated → removed; use key prop to reset state instead */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-base">
            <UserAddOutlined className="text-indigo-500" />
            <span>{t('team.member.inviteTitle')}</span>
          </div>
        }
        open={isInviteModalOpen}
        onCancel={handleCloseInviteModal}
        footer={null}
        // Use key to force remount on open — replaces deprecated destroyOnClose
        key={isInviteModalOpen ? 'invite-open' : 'invite-closed'}
      >
        <Divider className="mt-3 mb-5" />
        <Form form={inviteForm} onFinish={handleInvite} layout="vertical">
          <Form.Item
            name="email"
            label={t('common.email')}
            rules={[{ required: true, type: 'email', message: t('validation.email') }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-300" />}
              placeholder="colleague@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item name="role" label={t('team.member.role')} initialValue="MEMBER">
            {/* Fix: Select.Option deprecated → use options prop instead */}
            <Select size="large" options={getRoleOptions(t)} />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleCloseInviteModal}>{t('common.cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isAddingMember}
              className="bg-indigo-500 hover:bg-indigo-600 border-none"
            >
              {t('team.member.sendInvite')}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Create Project Modal ──
          Fix: destroyOnClose deprecated → removed; form.resetFields() handles cleanup */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-base">
            <FolderOpenOutlined className="text-indigo-500" />
            <span>{t('team.project.createTitle')}</span>
          </div>
        }
        open={isCreateProjectModalOpen}
        onCancel={handleCloseProjectModal}
        footer={null}
        // Use key to force remount on open — replaces deprecated destroyOnClose
        key={isCreateProjectModalOpen ? 'project-open' : 'project-closed'}
      >
        <Divider className="mt-3 mb-5" />
        <Form form={projectForm} onFinish={handleCreateProject} layout="vertical">
          <Form.Item
            name="name"
            label={t('team.project.name')}
            rules={[{ required: true, message: t('validation.projectName') }]}
          >
            <Input
              placeholder={t('team.project.namePlaceholder')}
              size="large"
              prefix={<ProjectOutlined className="text-gray-300" />}
            />
          </Form.Item>

          <Form.Item name="description" label={t('team.project.description')}>
            <Input.TextArea
              rows={4}
              placeholder={t('team.project.descriptionPlaceholder')}
              className="resize-none"
            />
          </Form.Item>

          {/* File upload — beforeUpload returns false to prevent auto-upload */}
          <Form.Item
            name="file"
            label={t('team.project.picture')}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload maxCount={1} beforeUpload={() => false} listType="picture" accept="image/*">
              <Button icon={<UploadOutlined />} className="w-full">
                {t('common.selectFile')}
              </Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleCloseProjectModal}>{t('common.cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingProject}
              className="bg-indigo-500 hover:bg-indigo-600 border-none"
            >
              {t('team.project.createBtn')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamDetailPage;
