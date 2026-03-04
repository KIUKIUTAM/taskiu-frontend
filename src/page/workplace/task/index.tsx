import React, { useState } from 'react';
import { 
  Tag, 
  Avatar, 
  Button, 
  Select, 
  DatePicker, 
  Progress, 
  List, 
  Input, 
  Tooltip, 
  Divider, 
  Breadcrumb,
  Upload,
  Card,
  Dropdown
} from 'antd';
import { 
  UserOutlined, 
  PaperClipOutlined, 
  CheckSquareOutlined, 
  MoreOutlined, 
  LinkOutlined,
  SendOutlined,
  DeleteOutlined,
  StopOutlined,
  ClockCircleOutlined,
  FlagOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// --- 1. Mock Data (based on your variables) ---
const mockTask = {
  // 1. Identification and Basic Info
  id: "TASK-3402",
  title: "Implement User OAuth 2.0 Login and Permission Verification Module",
  summary: "Integrate Google and GitHub third-party login, and implement JWT Token verification mechanism.",
  description: `### Requirement Description
Current login system only supports username/password. To improve user experience, need to add OAuth login.

### Acceptance Criteria
- [ ] User can click "Login with Google"
- [ ] User can click "Login with GitHub"
- [ ] Backend needs to verify Token and return JWT
- [ ] Login failure should have error prompt

### Technical Notes
Please refer to RFC 6749 standard document.`,
  type: "Feature",

  // 2. Status and Workflow
  status: "In Progress",
  priority: "High",
  progress: 65,
  isArchived: false,

  // 3. Personnel Assignment
  assignee: { id: "u1", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1" },
  reporter: { id: "u2", name: "Sarah Lin", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2" },
  watchers: [
    { id: "u3", name: "Mike", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3" },
    { id: "u4", name: "Jenny", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4" },
    { id: "u5", name: "Tom", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=5" },
  ],

  // 4. Time Management
  createdAt: "2023-10-01T10:00:00Z",
  updatedAt: "2023-10-05T14:30:00Z",
  dueDate: "2023-10-20",
  startDate: "2023-10-02",
  estimatedTime: 24, // hours
  timeSpent: 16, // hours

  // 5. Classification and Relations
  projectId: "PROJ-Alpha",
  tags: ["Backend", "Security", "Auth"],
  dependencies: ["TASK-3399"], // Blocked by
  parentId: null,

  // 6. Attachments and Comments
  attachments: [
    { name: "UI_Mockup_v2.fig", url: "#", size: "2.4 MB" },
    { name: "API_Spec.pdf", url: "#", size: "500 KB" }
  ],
  comments: [
    { id: 1, user: "Sarah Lin", content: "Google API Key is ready, placed in 1Password.", time: "2 days ago" },
    { id: 2, user: "Alex Chen", content: "Received, currently handling Callback URL settings.", time: "1 day ago" }
  ]
};

const { TextArea } = Input;

const TaskDetailPage: React.FC = () => {
  // Simple state management
  const [task, setTask] = useState(mockTask);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#cf1322';
      case 'High': return '#f5222d';
      case 'Medium': return '#fa8c16';
      case 'Low': return '#52c41a';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- Top Navigation (Breadcrumb & Actions) --- */}
      <div className="mb-4 flex justify-between items-center">
        <Breadcrumb
          items={[
            { title: <a href="#">Projects</a> },
            { title: <a href="#">{task.projectId}</a> },
            { title: 'Board' },
            { title: task.id },
          ]}
        />
        <div className="flex gap-2">
          <Button icon={<LinkOutlined />}>Copy Link</Button>
          <Dropdown menu={{ items: [{ key: '1', label: 'Clone' }, { key: '2', label: 'Delete', danger: true }] }}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* --- Main Layout Grid (Left 8 Right 4) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === Left Main Content Area (Content) === */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Title and Description Block */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Title Header */}
            <div className="flex items-start gap-3 mb-6">
              <Tooltip title={`Type: ${task.type}`}>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-md mt-1">
                  <CheckSquareOutlined className="text-xl" />
                </div>
              </Tooltip>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 m-0 leading-tight">{task.title}</h1>
                <div className="text-gray-500 mt-1 text-sm">{task.summary}</div>
              </div>
            </div>

            {/* Description (Markdown Simulated) */}
            <div className="prose max-w-none text-gray-700 mb-8 whitespace-pre-line leading-relaxed">
              {task.description}
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Attachments ({task.attachments.length})</h3>
              <div className="flex flex-wrap gap-3">
                {task.attachments.map((file, idx) => (
                  <div key={idx} className="group flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all">
                    <div className="bg-white p-2 rounded border border-gray-100">
                      <PaperClipOutlined className="text-gray-400 text-lg group-hover:text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{file.name}</div>
                      <div className="text-xs text-gray-400">{file.size}</div>
                    </div>
                  </div>
                ))}
                <Upload>
                   <Button type="dashed" className="h-full px-6" icon={<PaperClipOutlined />}>Upload</Button>
                </Upload>
              </div>
            </div>
          </div>

          {/* 2. Dependencies */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Dependencies</h3>
            {task.dependencies.length > 0 ? (
               <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                 <StopOutlined />
                 <span className="font-medium text-sm">Blocked By:</span>
                 <a href="#" className="font-mono bg-white px-2 py-0.5 rounded border border-red-200 text-red-600 hover:text-red-800 hover:underline">
                    {task.dependencies[0]}
                 </a>
               </div>
            ) : (
              <span className="text-gray-400 text-sm">No dependencies</span>
            )}
          </div>

          {/* 3. Comments Area */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-6">Activity & Comments</h3>
            
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={task.comments}
              split={false}
              renderItem={(item) => (
                <li className="mb-6">
                  <div className="flex gap-4">
                    <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.user}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-gray-900 text-sm">{item.user}</span>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-r-xl rounded-bl-xl text-sm leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </li>
              )}
            />
            
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
              <Avatar icon={<UserOutlined />} className="bg-gray-200" />
              <div className="flex-1">
                <TextArea 
                  rows={3} 
                  placeholder="Leave a comment... (Markdown supported)" 
                  className="mb-3 bg-gray-50 focus:bg-white" 
                />
                <div className="flex justify-end gap-2">
                   <Button size="small">Cancel</Button>
                   <Button type="primary" size="small" icon={<SendOutlined />}>Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Right Sidebar (Properties) === */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Status & Priority */}
          <Card size="small" className="shadow-sm border-gray-200" title={<span className="text-xs font-bold uppercase text-gray-500">Status & Properties</span>}>
            <div className="space-y-5 py-2">
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1.5">Status</label>
                <Select 
                  defaultValue={task.status} 
                  className="w-full"
                  variant="filled"
                  options={[
                    { value: 'Todo', label: 'Todo' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Review', label: 'Review' },
                    { value: 'Done', label: 'Done' },
                  ]}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-gray-500 font-semibold block mb-1.5">Priority</label>
                   <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded border border-gray-100">
                      <FlagOutlined style={{ color: getPriorityColor(task.priority) }} />
                      <span className="text-sm font-medium">{task.priority}</span>
                   </div>
                </div>
                <div>
                   <label className="text-xs text-gray-500 font-semibold block mb-1.5">Progress</label>
                   <div className="flex items-center h-[30px]">
                     <Progress percent={task.progress} size="small" steps={5} strokeColor={task.progress === 100 ? '#52c41a' : '#1890ff'} />
                   </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. People */}
          <Card size="small" className="shadow-sm border-gray-200" title={<span className="text-xs font-bold uppercase text-gray-500">Personnel</span>}>
            <div className="space-y-4 py-1">
              {/* Assignee */}
              <div className="flex items-center justify-between group cursor-pointer p-1 -mx-1 rounded hover:bg-gray-50">
                <label className="text-xs text-gray-500 font-semibold">Assignee</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{task.assignee.name}</span>
                  <Avatar size="small" src={task.assignee.avatar} />
                </div>
              </div>
              <Divider className="my-2" />

              {/* Reporter */}
              <div className="flex items-center justify-between group cursor-pointer p-1 -mx-1 rounded hover:bg-gray-50">
                <label className="text-xs text-gray-500 font-semibold">Reporter</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{task.reporter.name}</span>
                  <Avatar size="small" src={task.reporter.avatar} />
                </div>
              </div>
              <Divider className="my-2" />

              {/* Watchers */}
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-2">
                  Watchers <span className="text-gray-400 font-normal">({task.watchers.length})</span>
                </label>
                <div className="flex items-center gap-2">
                  <Avatar.Group maxCount={4} size="small">
                    {task.watchers.map(u => (
                      <Tooltip key={u.id} title={u.name}>
                        <Avatar src={u.avatar} />
                      </Tooltip>
                    ))}
                    <Tooltip title="Add watcher">
                       <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} icon={<UserOutlined />} className="cursor-pointer hover:opacity-80" />
                    </Tooltip>
                  </Avatar.Group>
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Schedule & Tracking */}
          <Card size="small" className="shadow-sm border-gray-200" title={<span className="text-xs font-bold uppercase text-gray-500">Schedule & Tracking</span>}>
            <div className="space-y-5 py-2">
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1.5">Duration</label>
                <DatePicker.RangePicker 
                  className="w-full" 
                  defaultValue={[dayjs(task.startDate), dayjs(task.dueDate)]} 
                  format="YYYY/MM/DD"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                   <label className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                     <ClockCircleOutlined /> Time Tracking
                   </label>
                   <span className="text-xs text-gray-600 font-mono">{task.timeSpent}h / {task.estimatedTime}h</span>
                </div>
                <Tooltip title={`Spent: ${task.timeSpent}h / Estimated: ${task.estimatedTime}h`}>
                  <Progress 
                    percent={Math.round((task.timeSpent / task.estimatedTime) * 100)} 
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    format={percent => <span className="text-xs text-gray-500">{percent}%</span>}
                  />
                </Tooltip>
              </div>
              
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
                <span>Updated</span>
                <span>{dayjs(task.updatedAt).format('MM/DD HH:mm')}</span>
              </div>
            </div>
          </Card>

          {/* 4. Tags & Metadata */}
          <Card size="small" className="shadow-sm border-gray-200" title={<span className="text-xs font-bold uppercase text-gray-500">Details</span>}>
            <div className="space-y-4 py-1">
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-2">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map(tag => (
                    <Tag key={tag} color="blue" className="mr-0 rounded-full px-2.5">{tag}</Tag>
                  ))}
                  <Tag className="border-dashed bg-transparent cursor-pointer rounded-full hover:border-blue-400 hover:text-blue-500">+ Add</Tag>
                </div>
              </div>
              
              <Divider className="my-2" />
              
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-gray-500">Created</span>
                <span className="text-right text-gray-700">{dayjs(task.createdAt).format('YYYY-MM-DD')}</span>
                
                <span className="text-gray-500">Task ID</span>
                <span className="text-right text-gray-700 font-mono select-all">{task.id}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="text-right">
             <Button type="text" danger icon={<DeleteOutlined />} size="small" className="text-xs opacity-60 hover:opacity-100">
               Archive this task
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
