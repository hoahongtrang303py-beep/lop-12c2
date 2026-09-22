import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  User, 
  CheckSquare, 
  BarChart3, 
  Calendar,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { Student, Task, SubjectScore, NavigationTab } from '../types';
import { TEACHER_INFO } from '../data/initialData';

interface HomeViewProps {
  student: Student;
  tasks: Task[];
  scores: SubjectScore[];
  onNavigate: (tab: NavigationTab) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onViewTaskDetail: (task: Task) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  student,
  tasks,
  scores,
  onNavigate,
  onToggleTaskStatus,
  onViewTaskDetail,
}) => {
  // Calculations
  const inProgressTasks = tasks.filter((t) => t.status === 'dang_lam');
  const completedTasks = tasks.filter((t) => t.status === 'hoan_thanh');
  const pendingTasks = tasks.filter((t) => t.status === 'chua_lam');
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Latest score or GPA
  const averageScore = scores.length > 0 
    ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1) 
    : '0.0';
  const latestScoreItem = scores[0];

  // Urgent/upcoming tasks (not yet completed, up to 3)
  const urgentTasks = tasks
    .filter((t) => t.status !== 'hoan_thanh')
    .slice(0, 3);

  return (
    <div id="home-view-container" className="space-y-6">
      {/* 1. Welcome Banner */}
      <section 
        id="home-welcome-banner" 
        className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
          <GraduationCap className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs font-semibold mb-3 border border-blue-400/30">
            <span>Trường THPT Phạm Văn Đồng</span>
            <span>•</span>
            <span>GV phụ trách: {TEACHER_INFO.name}</span>
          </div>

          <h2 id="home-greeting-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Xin chào, em {student.name}! 👋
          </h2>

          <p id="home-greeting-desc" className="text-blue-100 text-sm sm:text-base leading-relaxed mb-4">
            Chào mừng em đến với hệ thống <strong>Quản trị Học tập THPT Phạm Văn Đồng</strong>. Hãy kiểm tra các nhiệm vụ cần hoàn thành hôm nay, theo dõi tiến độ và tiếp tục phát huy kết quả học tập nhé!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
              Lớp: <strong>{student.classId}</strong>
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
              Mã học sinh: <strong>{student.studentCode}</strong>
            </span>
            <span className="bg-emerald-400/20 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-400/30 font-medium">
              Tỷ lệ hoàn thành: <strong>{progressPercent}%</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Quick Overview Stats Cards (4 Metrics) */}
      <section id="home-overview-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tasks in progress */}
        <div 
          id="stat-in-progress-card" 
          onClick={() => onNavigate('nhiem_vu')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đang thực hiện</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span id="stat-in-progress-count" className="text-3xl font-extrabold text-slate-900">{inProgressTasks.length}</span>
            <span className="text-xs text-slate-500">nhiệm vụ</span>
          </div>
          <p className="text-xs text-amber-700 mt-2 font-medium flex items-center gap-1">
            <span>+{pendingTasks.length} nhiệm vụ chưa bắt đầu</span>
          </p>
        </div>

        {/* Metric 2: Completed tasks */}
        <div 
          id="stat-completed-card" 
          onClick={() => onNavigate('nhiem_vu')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đã hoàn thành</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span id="stat-completed-count" className="text-3xl font-extrabold text-slate-900">{completedTasks.length}</span>
            <span className="text-xs text-slate-500">/ {totalTasks} bài</span>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium">
            Đạt kết quả tốt, duy trì tiến độ!
          </p>
        </div>

        {/* Metric 3: Learning progress */}
        <div 
          id="stat-progress-card" 
          onClick={() => onNavigate('tien_do')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tiến độ học tập</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span id="stat-progress-percent" className="text-3xl font-extrabold text-blue-600">{progressPercent}%</span>
            <span className="text-xs text-slate-500">hoàn thành</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 4: Latest score / GPA */}
        <div 
          id="stat-score-card" 
          onClick={() => onNavigate('ket_qua')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Điểm gần nhất / ĐTB</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span id="stat-average-score" className="text-3xl font-extrabold text-purple-700">{averageScore}</span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
          <p className="text-xs text-purple-700 mt-2 font-medium truncate" title={latestScoreItem ? `${latestScoreItem.subject}: ${latestScoreItem.score} đ` : ''}>
            {latestScoreItem ? `Gần nhất: ${latestScoreItem.subject} (${latestScoreItem.score} đ)` : 'Xếp loại Tốt'}
          </p>
        </div>
      </section>

      {/* 3. Five Primary Feature Navigation Cards */}
      <section id="home-navigation-cards-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="feature-nav-heading" className="text-base sm:text-lg font-bold text-slate-900">
            5 Tính năng Quản trị Học tập chính
          </h3>
          <span className="text-xs text-slate-500">Bấm nút để truy cập nhanh</span>
        </div>

        <div id="home-feature-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Trang chủ */}
          <div 
            id="feature-card-home"
            className="bg-blue-50/70 border-2 border-blue-500/40 rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">1. Trang chủ</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Xem tổng quan nhanh tên trường THPT Phạm Văn Đồng, lời chào, số nhiệm vụ, tiến độ và điểm số mới nhất.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
              ✓ Đang hiển thị tại màn hình này
            </span>
          </div>

          {/* Card 2: Hồ sơ học sinh */}
          <div 
            id="feature-card-profile"
            onClick={() => onNavigate('ho_so')}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                2. Hồ sơ học sinh
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Xem và chỉnh sửa Họ tên, Lớp, Mã học sinh, Email và tổng quan quá trình rèn luyện tại THPT.
              </p>
            </div>
            <button 
              id="goto-profile-btn"
              onClick={(e) => { e.stopPropagation(); onNavigate('ho_so'); }}
              className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem hồ sơ cá nhân</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Nhiệm vụ học tập */}
          <div 
            id="feature-card-tasks"
            onClick={() => onNavigate('nhiem_vu')}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                3. Nhiệm vụ học tập
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Danh sách bài tập, hạn nộp, môn học, lọc trạng thái và nút đánh dấu hoàn thành nhanh chóng.
              </p>
            </div>
            <button 
              id="goto-tasks-btn"
              onClick={(e) => { e.stopPropagation(); onNavigate('nhiem_vu'); }}
              className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1"
            >
              <span>Vào danh sách nhiệm vụ ({tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 4: Theo dõi tiến độ */}
          <div 
            id="feature-card-progress"
            onClick={() => onNavigate('tien_do')}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                4. Theo dõi tiến độ
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Biểu đồ tỷ lệ hoàn thành theo phần trăm trực quan, phân tích tiến độ chi tiết theo từng môn học.
              </p>
            </div>
            <button 
              id="goto-progress-btn"
              onClick={(e) => { e.stopPropagation(); onNavigate('tien_do'); }}
              className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem biểu đồ tiến độ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 5: Kết quả / Điểm số */}
          <div 
            id="feature-card-grades"
            onClick={() => onNavigate('ket_qua')}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                5. Kết quả / Điểm số
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Bảng điểm môn học, số bài hoàn thành, điểm trung bình và nhận xét tích cực từ cô Diệp Thị Linh.
              </p>
            </div>
            <button 
              id="goto-grades-btn"
              onClick={(e) => { e.stopPropagation(); onNavigate('ket_qua'); }}
              className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem bảng điểm & nhận xét</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Priority Tasks Snapshot */}
      <section id="home-urgent-tasks-section" className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 id="urgent-tasks-heading" className="text-base font-bold text-slate-900">
              Nhiệm vụ học tập cần ưu tiên
            </h3>
          </div>
          <button 
            id="view-all-tasks-link"
            onClick={() => onNavigate('nhiem_vu')}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {urgentTasks.length === 0 ? (
          <div id="no-urgent-tasks-msg" className="p-6 text-center bg-slate-50 rounded-lg text-slate-600 text-xs">
            🎉 Tuyệt vời! Em đã hoàn thành tất cả các nhiệm vụ được giao.
          </div>
        ) : (
          <div id="urgent-tasks-list" className="space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                id={`urgent-task-item-${task.id}`}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {task.subject}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      task.priority === 'Khẩn cấp' 
                        ? 'bg-rose-100 text-rose-700' 
                        : task.priority === 'Quan trọng' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Hạn: {task.deadline}
                    </span>
                  </div>
                  <h4 
                    onClick={() => onViewTaskDetail(task)}
                    className="text-sm font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                  >
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{task.shortDescription}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    id={`urgent-task-detail-btn-${task.id}`}
                    onClick={() => onViewTaskDetail(task)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Chi tiết
                  </button>
                  <button
                    id={`urgent-task-complete-btn-${task.id}`}
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Xong</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
