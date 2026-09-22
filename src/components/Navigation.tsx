import React from 'react';
import { Home, User, CheckSquare, BarChart3, Award } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  pendingTasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  pendingTasksCount,
}) => {
  const tabs = [
    {
      id: 'trang_chu' as NavigationTab,
      label: '1. Trang chủ',
      shortLabel: 'Trang chủ',
      icon: Home,
      description: 'Tổng quan học tập',
    },
    {
      id: 'ho_so' as NavigationTab,
      label: '2. Hồ sơ học sinh',
      shortLabel: 'Hồ sơ',
      icon: User,
      description: 'Thông tin cá nhân',
    },
    {
      id: 'nhiem_vu' as NavigationTab,
      label: '3. Nhiệm vụ học tập',
      shortLabel: 'Nhiệm vụ',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      description: 'Bài tập & hạn nộp',
    },
    {
      id: 'tien_do' as NavigationTab,
      label: '4. Theo dõi tiến độ',
      shortLabel: 'Tiến độ',
      icon: BarChart3,
      description: 'Biểu đồ hoàn thành',
    },
    {
      id: 'ket_qua' as NavigationTab,
      label: '5. Kết quả / Điểm số',
      shortLabel: 'Điểm số',
      icon: Award,
      description: 'Bảng điểm & nhận xét',
    },
  ];

  return (
    <nav id="main-navigation-bar" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div id="nav-tabs-list" className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all select-none relative shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.badge !== undefined && (
                  <span
                    id={`nav-badge-${tab.id}`}
                    className={`ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
