import React from 'react';
import { School, Volume2, VolumeX, RotateCcw, UserCheck, Sparkles } from 'lucide-react';
import { Student } from '../types';
import { TEACHER_INFO } from '../data/initialData';

interface HeaderProps {
  students: Student[];
  currentStudent: Student;
  onSelectStudent: (studentId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  students,
  currentStudent,
  onSelectStudent,
  soundEnabled,
  onToggleSound,
  onResetData,
  onNavigateHome,
}) => {
  return (
    <header id="app-main-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top institution bar */}
      <div id="school-sub-header" className="bg-blue-900 text-blue-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">TRƯỜNG THPT PHẠM VĂN ĐỒNG</span>
            <span className="hidden sm:inline text-blue-300">•</span>
            <span className="hidden sm:inline text-blue-200">Năm học 2025 - 2026</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <span>Giáo viên phụ trách: <strong className="text-white font-semibold">{TEACHER_INFO.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div id="main-header-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & System Name */}
          <div 
            id="brand-container" 
            onClick={onNavigateHome}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div id="brand-logo-badge" className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 id="system-title" className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                QUẢN TRỊ HỌC TẬP THPT PHẠM VĂN ĐỒNG
              </h1>
              <p id="system-subtitle" className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Hệ thống theo dõi nhiệm vụ, tiến độ & kết quả học tập THPT</span>
              </p>
            </div>
          </div>

          {/* Quick controls: Student switcher, sound toggle, reset */}
          <div id="header-controls" className="flex items-center flex-wrap gap-2.5">
            {/* Student Switcher dropdown */}
            <div id="student-selector-wrapper" className="flex items-center gap-1.5 bg-slate-100/90 rounded-lg p-1 border border-slate-200 text-xs">
              <UserCheck className="w-4 h-4 text-blue-600 ml-1.5 shrink-0" />
              <span className="hidden sm:inline text-slate-600 font-medium">Học sinh:</span>
              <select
                id="student-select-dropdown"
                value={currentStudent.id}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-md py-1 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title="Chọn học sinh để xem dữ liệu"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} - Lớp {st.classId} ({st.studentCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
              }`}
              title={soundEnabled ? 'Âm thanh phản hồi: Đang BẬT' : 'Âm thanh phản hồi: Đang TẮT'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline font-medium">{soundEnabled ? 'Âm thanh' : 'Tắt âm'}</span>
            </button>

            {/* Reset data */}
            <button
              id="reset-sample-data-btn"
              onClick={onResetData}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-xs flex items-center gap-1.5"
              title="Khôi phục dữ liệu mẫu ban đầu để trình chiếu"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline font-medium">Dữ liệu mẫu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
