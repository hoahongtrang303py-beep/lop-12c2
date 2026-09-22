import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Tv, 
  Award,
  BookOpen,
  PieChart
} from 'lucide-react';
import { Task, Student } from '../types';

interface ProgressViewProps {
  tasks: Task[];
  student: Student;
  onBackToHome: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  tasks,
  student,
  onBackToHome,
}) => {
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'hoan_thanh');
  const inProgressTasks = tasks.filter((t) => t.status === 'dang_lam');
  const notStartedTasks = tasks.filter((t) => t.status === 'chua_lam');
  const incompleteCount = totalTasks - completedTasks.length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const inProgressRate = totalTasks > 0 ? Math.round((inProgressTasks.length / totalTasks) * 100) : 0;
  const notStartedRate = totalTasks > 0 ? Math.max(0, 100 - completionRate - inProgressRate) : 0;

  // Breakdown by subject
  const subjectBreakdown = useMemo(() => {
    const map: { [sub: string]: { total: number; completed: number; inProgress: number; notStarted: number } } = {};
    tasks.forEach((t) => {
      if (!map[t.subject]) {
        map[t.subject] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
      }
      map[t.subject].total += 1;
      if (t.status === 'hoan_thanh') map[t.subject].completed += 1;
      else if (t.status === 'dang_lam') map[t.subject].inProgress += 1;
      else map[t.subject].notStarted += 1;
    });

    return Object.entries(map).map(([subject, counts]) => {
      const rate = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
      return {
        subject,
        ...counts,
        rate,
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [tasks]);

  return (
    <div id="progress-view-container" className={`space-y-6 ${presentationMode ? 'scale-102 transition-all' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="progress-back-to-home-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          <div>
            <h2 id="progress-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
              Theo dõi tiến độ học tập
            </h2>
            <p className="text-xs text-slate-500">
              Học sinh: <strong className="text-slate-700">{student.name}</strong> - Lớp {student.classId}
            </p>
          </div>
        </div>

        {/* Presentation mode toggle for classroom projectors */}
        <button
          id="toggle-presentation-mode-btn"
          onClick={() => setPresentationMode(!presentationMode)}
          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            presentationMode 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Tối ưu kích thước chữ và độ tương phản khi chiếu lên máy chiếu lớp học"
        >
          <Tv className="w-4 h-4" />
          <span>{presentationMode ? 'Tắt chế độ máy chiếu' : 'Chế độ máy chiếu THPT'}</span>
        </button>
      </div>

      {/* Main Overall Progress Card */}
      <div id="overall-progress-card" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              TỔNG THỂ HỆ THỐNG
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tỷ lệ hoàn thành nhiệm vụ: {completionRate}%
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
              {completionRate >= 80 
                ? 'Tiến độ học tập rất xuất sắc! Em đã hoàn thành phần lớn các nhiệm vụ được giao.'
                : completionRate >= 50
                ? 'Tiến độ khá ổn định. Tiếp tục phân bổ thời gian để giải quyết các nhiệm vụ còn lại nhé.'
                : 'Cần nỗ lực đẩy nhanh tiến độ hoàn thành bài tập trước khi đến hạn chót.'}
            </p>
          </div>

          {/* Large Circular/Radial Percentage Visual */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="48"
                className="text-slate-100 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Completed stroke */}
              <circle
                cx="60"
                cy="60"
                r="48"
                className="text-emerald-500 stroke-current transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - completionRate / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900">{completionRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đạt được</span>
            </div>
          </div>
        </div>

        {/* 4 Core Summary Metric Boxes */}
        <div id="progress-stats-boxes" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Box 1: Total */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Tổng số nhiệm vụ</span>
            </div>
            <p id="total-tasks-stat" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalTasks}
            </p>
            <span className="text-[11px] text-slate-400">100% nhiệm vụ giao</span>
          </div>

          {/* Box 2: Completed */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Nhiệm vụ đã hoàn thành</span>
            </div>
            <p id="completed-tasks-stat" className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {completedTasks.length}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Chiếm {completionRate}%</span>
          </div>

          {/* Box 3: In progress */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Đang thực hiện</span>
            </div>
            <p id="in-progress-tasks-stat" className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {inProgressTasks.length}
            </p>
            <span className="text-[11px] text-amber-600 font-medium">Chiếm {inProgressRate}%</span>
          </div>

          {/* Box 4: Incomplete / Chưa hoàn thành */}
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Nhiệm vụ chưa xong</span>
            </div>
            <p id="incomplete-tasks-stat" className="text-2xl sm:text-3xl font-extrabold text-rose-700">
              {incompleteCount}
            </p>
            <span className="text-[11px] text-rose-600 font-medium">Gồm chưa làm & đang làm</span>
          </div>
        </div>

        {/* Stacked Percentage Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Phân bổ tình trạng nhiệm vụ</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Đã xong ({completedTasks.length})
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Đang làm ({inProgressTasks.length})
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Chưa làm ({notStartedTasks.length})
              </span>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
              title={`Đã hoàn thành: ${completionRate}%`}
            ></div>
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${inProgressRate}%` }}
              title={`Đang làm: ${inProgressRate}%`}
            ></div>
            <div
              className="bg-slate-300 transition-all duration-500"
              style={{ width: `${notStartedRate}%` }}
              title={`Chưa làm: ${notStartedRate}%`}
            ></div>
          </div>
        </div>
      </div>

      {/* Subject-by-Subject Progress Breakdown */}
      <div id="subject-progress-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="subject-progress-heading" className="text-base sm:text-lg font-bold text-slate-900">
              Tiến độ theo từng môn học THPT
            </h3>
            <p className="text-xs text-slate-500">Chi tiết số lượng bài hoàn thành và tỷ lệ theo bộ môn</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {subjectBreakdown.length} môn học
          </span>
        </div>

        <div id="subject-progress-list" className="space-y-4">
          {subjectBreakdown.map((item) => {
            return (
              <div
                key={item.subject}
                id={`subject-progress-${item.subject}`}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h4 className="text-sm font-bold text-slate-900">{item.subject}</h4>
                    <span className="text-xs text-slate-500">
                      ({item.completed} / {item.total} bài hoàn thành)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      item.rate === 100 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.rate >= 50 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.rate}%
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.rate === 100 ? 'Xuất sắc' : item.rate >= 50 ? 'Khá tốt' : 'Cần đẩy nhanh'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.rate === 100 
                        ? 'bg-emerald-500' 
                        : item.rate >= 50 
                        ? 'bg-blue-600' 
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>

                {/* Detail small badges */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Hoàn thành: <strong className="text-emerald-700">{item.completed}</strong></span>
                  <span>•</span>
                  <span>Đang làm: <strong className="text-amber-700">{item.inProgress}</strong></span>
                  <span>•</span>
                  <span>Chưa làm: <strong className="text-slate-700">{item.notStarted}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
