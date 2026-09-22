import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  X, 
  BookOpen,
  Info,
  Check
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onBackToHome: () => void;
  selectedTaskForDetail?: Task | null;
  onCloseDetailModal?: () => void;
  onOpenDetailModal?: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleStatus,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onBackToHome,
  selectedTaskForDetail,
  onCloseDetailModal,
  onOpenDetailModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [activeDetailTask, setActiveDetailTask] = useState<Task | null>(selectedTaskForDetail || null);
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({});
  const [isNewTask, setIsNewTask] = useState<boolean>(false);

  // Sync with prop if passed
  React.useEffect(() => {
    if (selectedTaskForDetail) {
      setActiveDetailTask(selectedTaskForDetail);
    }
  }, [selectedTaskForDetail]);

  // Extract unique subjects
  const subjects = useMemo(() => {
    const set = new Set(tasks.map((t) => t.subject));
    return Array.from(set);
  }, [tasks]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      chua_lam: tasks.filter((t) => t.status === 'chua_lam').length,
      dang_lam: tasks.filter((t) => t.status === 'dang_lam').length,
      hoan_thanh: tasks.filter((t) => t.status === 'hoan_thanh').length,
    };
  }, [tasks]);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      // Subject filter
      if (subjectFilter !== 'all' && task.subject !== subjectFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          task.subject.toLowerCase().includes(q) ||
          task.shortDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, statusFilter, subjectFilter, searchQuery]);

  // Handle open add task
  const handleOpenAdd = () => {
    setIsNewTask(true);
    setTaskForm({
      id: `task-${Date.now()}`,
      title: '',
      subject: 'Toán học',
      shortDescription: '',
      detailedInstructions: '',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'chua_lam',
      priority: 'Bình thường',
      teacherNote: '',
      assignedBy: 'Cô Diệp Thị Linh',
    });
    setIsEditingTask(true);
  };

  // Handle open edit task
  const handleOpenEdit = (task: Task) => {
    setIsNewTask(false);
    setTaskForm({ ...task });
    setIsEditingTask(true);
    setActiveDetailTask(null);
  };

  // Save task
  const handleSaveTaskForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.subject) return;

    if (isNewTask) {
      onAddTask(taskForm as Task);
    } else {
      onUpdateTask(taskForm as Task);
    }
    setIsEditingTask(false);
  };

  return (
    <div id="tasks-view-container" className="space-y-6">
      {/* Top action bar & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="tasks-back-to-home-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          <div>
            <h2 id="tasks-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
              Nhiệm vụ học tập ({tasks.length})
            </h2>
            <p className="text-xs text-slate-500">Danh sách bài tập, hạn nộp và hướng dẫn từ giáo viên</p>
          </div>
        </div>

        <button
          id="add-new-task-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhiệm vụ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div id="tasks-filter-bar" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="filter-status-all"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span>Tất cả</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {counts.all}
            </span>
          </button>

          <button
            id="filter-status-dang-lam"
            onClick={() => setStatusFilter('dang_lam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === 'dang_lam'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Đang làm</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full">
              {counts.dang_lam}
            </span>
          </button>

          <button
            id="filter-status-chua-lam"
            onClick={() => setStatusFilter('chua_lam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === 'chua_lam'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Chưa làm</span>
            <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full">
              {counts.chua_lam}
            </span>
          </button>

          <button
            id="filter-status-hoan-thanh"
            onClick={() => setStatusFilter('hoan_thanh')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === 'hoan_thanh'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full">
              {counts.hoan_thanh}
            </span>
          </button>
        </div>

        {/* Search input & Subject dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="tasks-search-input"
              type="text"
              placeholder="Tìm kiếm nhiệm vụ theo tên, môn học, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              id="tasks-subject-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả các môn ({tasks.length})</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Cards */}
      <div id="tasks-list-grid" className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div id="no-tasks-found" className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Không tìm thấy nhiệm vụ nào</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không có bài tập nào phù hợp với bộ lọc hiện tại. Thử chọn lại môn học hoặc đổi trạng thái lọc.
            </p>
            <button
              onClick={() => { setStatusFilter('all'); setSubjectFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'hoan_thanh';
            const isInProgress = task.status === 'dang_lam';

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : isInProgress 
                    ? 'border-amber-200/80 bg-white' 
                    : 'border-slate-200'
                }`}
              >
                {/* Task Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Subject badge */}
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800">
                      {task.subject}
                    </span>

                    {/* Status badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isInProgress 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {isInProgress && <Clock className="w-3 h-3" />}
                      {!isCompleted && !isInProgress && <AlertCircle className="w-3 h-3" />}
                      <span>
                        {isCompleted ? 'Đã hoàn thành' : isInProgress ? 'Đang làm' : 'Chưa làm'}
                      </span>
                    </span>

                    {/* Priority badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      task.priority === 'Khẩn cấp' 
                        ? 'bg-rose-100 text-rose-700' 
                        : task.priority === 'Quan trọng' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>

                    {/* Deadline */}
                    <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto sm:ml-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hạn: <strong className="text-slate-700">{task.deadline}</strong></span>
                    </span>
                  </div>

                  <h3 
                    id={`task-title-${task.id}`}
                    onClick={() => setActiveDetailTask(task)}
                    className={`text-base font-bold cursor-pointer hover:text-blue-600 transition-colors ${
                      isCompleted ? 'text-slate-700 line-through decoration-emerald-500' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.shortDescription}
                  </p>

                  {task.teacherNote && (
                    <div className="text-[11px] text-blue-900 bg-blue-50/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border border-blue-100">
                      <Info className="w-3 h-3 text-blue-600" />
                      <span>Ghi chú của cô Diệp Thị Linh: {task.teacherNote}</span>
                    </div>
                  )}
                </div>

                {/* Task Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  {/* View Details Button */}
                  <button
                    id={`view-task-detail-btn-${task.id}`}
                    onClick={() => setActiveDetailTask(task)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 transition-colors"
                  >
                    Chi tiết
                  </button>

                  {/* Edit Task (for teacher) */}
                  <button
                    id={`edit-task-btn-${task.id}`}
                    onClick={() => handleOpenEdit(task)}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    title="Chỉnh sửa nhiệm vụ (Giáo viên)"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Task */}
                  <button
                    id={`delete-task-btn-${task.id}`}
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa nhiệm vụ "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa nhiệm vụ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Mark completed / toggle status button */}
                  <button
                    id={`mark-complete-btn-${task.id}`}
                    onClick={() => onToggleStatus(task.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Đổi làm lại' : 'Đánh dấu hoàn thành'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Detail Modal */}
      {activeDetailTask && (
        <div id="task-detail-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div id="task-detail-modal-card" className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 relative">
            <button
              id="close-task-detail-modal-btn"
              onClick={() => {
                setActiveDetailTask(null);
                if (onCloseDetailModal) onCloseDetailModal();
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800">
                  {activeDetailTask.subject}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                  activeDetailTask.status === 'hoan_thanh' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : activeDetailTask.status === 'dang_lam' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {activeDetailTask.status === 'hoan_thanh' ? 'Đã hoàn thành' : activeDetailTask.status === 'dang_lam' ? 'Đang làm' : 'Chưa làm'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Hạn hoàn thành: <strong>{activeDetailTask.deadline}</strong>
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{activeDetailTask.title}</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700">Tóm tắt nội dung:</span>
                <p className="text-slate-600">{activeDetailTask.shortDescription}</p>
              </div>

              {activeDetailTask.detailedInstructions && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700">Hướng dẫn chi tiết từ giáo viên:</span>
                  <p className="text-slate-600 whitespace-pre-line">{activeDetailTask.detailedInstructions}</p>
                </div>
              )}

              {activeDetailTask.teacherNote && (
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 space-y-1">
                  <span className="font-bold text-blue-800">Ghi chú nhắc nhở (Cô Diệp Thị Linh):</span>
                  <p>{activeDetailTask.teacherNote}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(activeDetailTask)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa nội dung này</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onToggleStatus(activeDetailTask.id);
                    setActiveDetailTask({
                      ...activeDetailTask,
                      status: activeDetailTask.status === 'hoan_thanh' ? 'dang_lam' : 'hoan_thanh',
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white ${
                    activeDetailTask.status === 'hoan_thanh' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {activeDetailTask.status === 'hoan_thanh' ? 'Đổi sang Đang làm' : 'Đánh dấu hoàn thành'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isEditingTask && (
        <div id="task-edit-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div id="task-edit-modal-card" className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setIsEditingTask(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {isNewTask ? 'Thêm nhiệm vụ học tập mới' : 'Chỉnh sửa nhiệm vụ học tập'}
            </h3>

            <form onSubmit={handleSaveTaskForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên nhiệm vụ / bài tập *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập chương 2 môn Vật lí"
                  value={taskForm.title || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Môn học *
                  </label>
                  <select
                    value={taskForm.subject || 'Toán học'}
                    onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Vật lí">Vật lí</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Lịch sử">Lịch sử</option>
                    <option value="Địa lí">Địa lí</option>
                    <option value="GDKT & PL">GDKT & PL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn hoàn thành *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.deadline || ''}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={taskForm.priority || 'Bình thường'}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Quan trọng">Quan trọng</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trạng thái thực hiện
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="taskStatus"
                      checked={taskForm.status === 'chua_lam'}
                      onChange={() => setTaskForm({ ...taskForm, status: 'chua_lam' })}
                    />
                    <span>Chưa làm</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="taskStatus"
                      checked={taskForm.status === 'dang_lam'}
                      onChange={() => setTaskForm({ ...taskForm, status: 'dang_lam' })}
                    />
                    <span>Đang làm</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="taskStatus"
                      checked={taskForm.status === 'hoan_thanh'}
                      onChange={() => setTaskForm({ ...taskForm, status: 'hoan_thanh' })}
                    />
                    <span>Đã hoàn thành</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung tóm tắt *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả ngắn gọn yêu cầu cần làm..."
                  value={taskForm.shortDescription || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hướng dẫn chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Các bước thực hiện, tài liệu tham khảo, hình thức nộp bài..."
                  value={taskForm.detailedInstructions || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, detailedInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú từ giáo viên (Cô Diệp Thị Linh)
                </label>
                <input
                  type="text"
                  placeholder="Lưu ý quan trọng cho học sinh..."
                  value={taskForm.teacherNote || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, teacherNote: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingTask(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{isNewTask ? 'Tạo nhiệm vụ' : 'Lưu cập nhật'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
