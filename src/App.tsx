/**
 * QUẢN TRỊ HỌC TẬP THPT PHẠM VĂN ĐỒNG
 * Giáo viên phụ trách: DIỆP THỊ LINH
 * Trường: THPT PHẠM VĂN ĐỒNG
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppState, 
  NavigationTab, 
  Student, 
  Task, 
  TaskStatus,
  SubjectScore 
} from './types';
import { loadAppState, saveAppState, resetAppState } from './utils/storage';
import { playSuccessChime, playSoftClick } from './utils/sound';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { TasksView } from './components/TasksView';
import { ProgressView } from './components/ProgressView';
import { GradesView } from './components/GradesView';
import { School, Sparkles } from 'lucide-react';
import { TEACHER_INFO } from './data/initialData';

export default function App() {
  // Primary application state with persistence
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('trang_chu');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Current active student
  const currentStudent = useMemo(() => {
    return (
      state.students.find((s) => s.id === state.currentStudentId) ||
      state.students[0]
    );
  }, [state.students, state.currentStudentId]);

  // Pending tasks count for navigation badge
  const pendingTasksCount = useMemo(() => {
    return state.tasks.filter((t) => t.status !== 'hoan_thanh').length;
  }, [state.tasks]);

  // Tab change handler
  const handleTabChange = (tab: NavigationTab) => {
    playSoftClick(state.soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle task status
  const handleToggleTaskStatus = (taskId: string) => {
    setState((prev) => {
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id === taskId) {
          const nextStatus: TaskStatus = task.status === 'hoan_thanh' ? 'dang_lam' : 'hoan_thanh';
          if (nextStatus === 'hoan_thanh') {
            playSuccessChime(prev.soundEnabled);
          } else {
            playSoftClick(prev.soundEnabled);
          }
          return {
            ...task,
            status: nextStatus,
            completedDate: nextStatus === 'hoan_thanh' ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return task;
      });
      return { ...prev, tasks: updatedTasks };
    });
  };

  // Add new task
  const handleAddTask = (newTask: Task) => {
    playSuccessChime(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  // Update existing task
  const handleUpdateTask = (updatedTask: Task) => {
    playSoftClick(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    playSoftClick(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Update student profile
  const handleUpdateStudent = (updatedStudent: Student) => {
    playSuccessChime(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
  };

  // Select another student
  const handleSelectStudent = (studentId: string) => {
    playSoftClick(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      currentStudentId: studentId,
    }));
  };

  // Update subject score
  const handleUpdateScore = (updatedScore: SubjectScore) => {
    playSuccessChime(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((s) => (s.id === updatedScore.id ? updatedScore : s)),
    }));
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextVal = !state.soundEnabled;
    setState((prev) => ({ ...prev, soundEnabled: nextVal }));
    if (nextVal) {
      playSuccessChime(true);
    }
  };

  // Reset to default sample data
  const handleConfirmReset = () => {
    const fresh = resetAppState();
    setState(fresh);
    setShowResetConfirm(false);
    playSuccessChime(state.soundEnabled);
  };

  // Open task detail from Home
  const handleViewTaskDetailFromHome = (task: Task) => {
    playSoftClick(state.soundEnabled);
    setSelectedTaskForDetail(task);
    setCurrentTab('nhiem_vu');
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* 1. Header with branding & student switcher */}
      <Header
        students={state.students}
        currentStudent={currentStudent}
        onSelectStudent={handleSelectStudent}
        soundEnabled={state.soundEnabled}
        onToggleSound={handleToggleSound}
        onResetData={() => setShowResetConfirm(true)}
        onNavigateHome={() => handleTabChange('trang_chu')}
      />

      {/* 2. Main Navigation Bar with 5 features */}
      <Navigation
        currentTab={currentTab}
        onTabChange={handleTabChange}
        pendingTasksCount={pendingTasksCount}
      />

      {/* 3. Main Content View Area */}
      <main id="app-main-viewport" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'trang_chu' && (
          <HomeView
            student={currentStudent}
            tasks={state.tasks}
            scores={state.scores}
            onNavigate={handleTabChange}
            onToggleTaskStatus={handleToggleTaskStatus}
            onViewTaskDetail={handleViewTaskDetailFromHome}
          />
        )}

        {currentTab === 'ho_so' && (
          <ProfileView
            student={currentStudent}
            allStudents={state.students}
            onSelectStudent={handleSelectStudent}
            onUpdateStudent={handleUpdateStudent}
            onBackToHome={() => handleTabChange('trang_chu')}
            tasks={state.tasks}
            scores={state.scores}
          />
        )}

        {currentTab === 'nhiem_vu' && (
          <TasksView
            tasks={state.tasks}
            onToggleStatus={handleToggleTaskStatus}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onBackToHome={() => handleTabChange('trang_chu')}
            selectedTaskForDetail={selectedTaskForDetail}
            onCloseDetailModal={() => setSelectedTaskForDetail(null)}
          />
        )}

        {currentTab === 'tien_do' && (
          <ProgressView
            tasks={state.tasks}
            student={currentStudent}
            onBackToHome={() => handleTabChange('trang_chu')}
          />
        )}

        {currentTab === 'ket_qua' && (
          <GradesView
            scores={state.scores}
            student={currentStudent}
            onUpdateScore={handleUpdateScore}
            onBackToHome={() => handleTabChange('trang_chu')}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer id="app-main-footer" className="bg-white border-t border-slate-200 mt-auto py-6 px-4 sm:px-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">QUẢN TRỊ HỌC TẬP THPT PHẠM VĂN ĐỒNG</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Giáo viên phụ trách: <strong>{TEACHER_INFO.name}</strong></span>
            <span>•</span>
            <span>Email: <strong>{TEACHER_INFO.email}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Hệ thống hỗ trợ học tập trực quan • THPT Phạm Văn Đồng</span>
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div id="reset-confirm-modal" className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Khôi phục dữ liệu mẫu ban đầu?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thao tác này sẽ thiết lập lại danh sách 7 học sinh mẫu, các nhiệm vụ học tập và bảng điểm chuẩn từ giáo viên Diệp Thị Linh để phục vụ việc trình chiếu và sử dụng thử.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
