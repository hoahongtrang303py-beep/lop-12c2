import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  GraduationCap, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';
import { Student, SubjectScore, Task } from '../types';

interface ProfileViewProps {
  student: Student;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onBackToHome: () => void;
  tasks: Task[];
  scores: SubjectScore[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  student,
  allStudents,
  onSelectStudent,
  onUpdateStudent,
  onBackToHome,
  tasks,
  scores,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Student>({ ...student });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync formData when student changes
  React.useEffect(() => {
    setFormData({ ...student });
    setIsEditing(false);
  }, [student]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...student });
    setIsEditing(false);
  };

  const completedTasksCount = tasks.filter((t) => t.status === 'hoan_thanh').length;
  const averageScore = scores.length > 0 
    ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)
    : '0.0';

  return (
    <div id="profile-view-container" className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            id="profile-back-to-home-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          <div>
            <h2 id="profile-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
              Hồ sơ học sinh THPT
            </h2>
            <p className="text-xs text-slate-500">Quản lý và hiển thị thông tin học sinh trường THPT Phạm Văn Đồng</p>
          </div>
        </div>

        {/* Quick Student Switcher Pill */}
        <div id="profile-student-switcher" className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-slate-500 font-medium">Hồ sơ khác:</span>
          <select
            id="profile-select-student"
            value={student.id}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {allStudents.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.classId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div id="profile-save-alert" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công thông tin học sinh vào hệ thống!</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Badges */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="text-center space-y-3">
            <div id="student-avatar-badge" className="w-24 h-24 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center text-3xl font-bold shadow-md shadow-blue-500/20">
              {student.name.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <h3 id="student-display-name" className="text-xl font-bold text-slate-900">{student.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mã HS: <span className="font-semibold text-slate-700">{student.studentCode}</span></p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Lớp {student.classId}</span>
              <span>•</span>
              <span>{student.academicYear}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Quick learning process highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng quan quá trình học tập
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Nhiệm vụ xong</span>
                <p className="text-lg font-bold text-emerald-600">{completedTasksCount} / {tasks.length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Điểm trung bình</span>
                <p className="text-lg font-bold text-blue-600">{averageScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs space-y-1.5 text-blue-900">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <School className="w-4 h-4" />
              <span>Đơn vị trường THPT</span>
            </div>
            <p className="font-semibold">{student.school}</p>
            <p className="text-blue-700">GV phụ trách: {student.homeroomTeacher}</p>
          </div>
        </div>

        {/* Right Column: Detailed Info & Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Chỉnh sửa thông tin học sinh' : 'Thông tin chi tiết học sinh'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing 
                  ? 'Cập nhật lại các trường thông tin bên dưới và bấm Lưu thay đổi' 
                  : 'Giáo viên và học sinh có thể cập nhật thông tin bất cứ lúc nào'}
              </p>
            </div>
            {!isEditing ? (
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="cancel-profile-btn"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Hủy</span>
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            /* View Mode */
            <div id="profile-view-details" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Họ và tên học sinh</span>
                  <p id="profile-name-value" className="text-sm font-bold text-slate-800">{student.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Lớp học</span>
                  <p id="profile-class-value" className="text-sm font-bold text-slate-800">Lớp {student.classId}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Mã định danh học sinh</span>
                  <p id="profile-code-value" className="text-sm font-bold text-slate-800">{student.studentCode}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Niên khóa</span>
                  <p id="profile-year-value" className="text-sm font-bold text-slate-800">{student.academicYear}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email học đường</span>
                  </span>
                  <p id="profile-email-value" className="text-sm font-bold text-slate-800">{student.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Số điện thoại liên hệ</span>
                  </span>
                  <p id="profile-phone-value" className="text-sm font-bold text-slate-800">{student.phone}</p>
                </div>
              </div>

              {/* Bio / Student Notes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Đặc điểm & Ghi chú rèn luyện</span>
                </span>
                <p id="profile-bio-value" className="text-sm text-slate-700 leading-relaxed font-normal">
                  {student.bio || 'Học sinh tích cực tham gia các hoạt động giáo dục tại trường THPT Phạm Văn Đồng.'}
                </p>
              </div>

              {/* Educational message */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <h5 className="font-bold flex items-center gap-1 text-emerald-800">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Lời nhắn từ Giáo viên Diệp Thị Linh:</span>
                </h5>
                <p className="leading-relaxed">
                  "Chúc em {student.name} luôn giữ vững ngọn lửa đam mê học hỏi, hoàn thành tốt các nhiệm vụ chuyên đề và đạt kết quả cao trong các kỳ thi sắp tới."
                </p>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form id="profile-edit-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-student-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên học sinh *
                  </label>
                  <input
                    id="input-student-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="input-student-class" className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp học *
                  </label>
                  <input
                    id="input-student-class"
                    type="text"
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Ví dụ: 11A2"
                  />
                </div>

                <div>
                  <label htmlFor="input-student-code" className="block text-xs font-bold text-slate-700 mb-1">
                    Mã học sinh *
                  </label>
                  <input
                    id="input-student-code"
                    type="text"
                    required
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="input-student-year" className="block text-xs font-bold text-slate-700 mb-1">
                    Niên khóa
                  </label>
                  <input
                    id="input-student-year"
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="input-student-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email học đường
                  </label>
                  <input
                    id="input-student-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="input-student-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    id="input-student-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-student-bio" className="block text-xs font-bold text-slate-700 mb-1">
                  Đặc điểm & Ghi chú rèn luyện
                </label>
                <textarea
                  id="input-student-bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Ghi chú sở thích, thế mạnh môn học hoặc năng khiếu..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="cancel-edit-form-btn"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi hồ sơ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
