import React, { useState } from 'react';
import { 
  Award, 
  ArrowLeft, 
  Edit3, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  X, 
  Check, 
  MessageSquareHeart,
  BarChart2
} from 'lucide-react';
import { SubjectScore, Student } from '../types';
import { TEACHER_INFO } from '../data/initialData';

interface GradesViewProps {
  scores: SubjectScore[];
  student: Student;
  onUpdateScore: (updatedScore: SubjectScore) => void;
  onBackToHome: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  scores,
  student,
  onUpdateScore,
  onBackToHome,
}) => {
  const [editingScore, setEditingScore] = useState<SubjectScore | null>(null);
  const [scoreForm, setScoreForm] = useState<Partial<SubjectScore>>({});

  // Summary computations
  const totalSubjects = scores.length;
  const averageScore = totalSubjects > 0 
    ? (scores.reduce((sum, s) => sum + s.score, 0) / totalSubjects).toFixed(2)
    : '0.00';
  const numAverage = parseFloat(averageScore);

  const academicRank = numAverage >= 9.0 
    ? 'Học lực Xuất sắc' 
    : numAverage >= 8.0 
    ? 'Học lực Giỏi' 
    : numAverage >= 6.5 
    ? 'Học lực Khá' 
    : 'Học lực Đạt';

  // Highest score subject
  const bestSubject = [...scores].sort((a, b) => b.score - a.score)[0];

  const handleOpenEdit = (item: SubjectScore) => {
    setEditingScore(item);
    setScoreForm({ ...item });
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScore && scoreForm.score !== undefined) {
      onUpdateScore({
        ...editingScore,
        score: Math.min(10, Math.max(0, parseFloat(scoreForm.score.toString()) || 0)),
        completedCount: scoreForm.completedCount || 0,
        totalCount: scoreForm.totalCount || 1,
        teacherComment: scoreForm.teacherComment || 'Tiếp tục cố gắng và phát huy nhé!',
        lastUpdated: new Date().toISOString().split('T')[0],
      });
      setEditingScore(null);
    }
  };

  return (
    <div id="grades-view-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="grades-back-to-home-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          <div>
            <h2 id="grades-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
              Kết quả & Điểm số học tập
            </h2>
            <p className="text-xs text-slate-500">
              Học sinh: <strong className="text-slate-700">{student.name}</strong> - Lớp {student.classId}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Overview Summary Banner */}
      <div id="grades-summary-banner" className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>BẢNG TỔNG HỢP KẾT QUẢ THPT</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Điểm trung bình chung: {averageScore} / 10.0
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              Xếp loại: <strong className="text-amber-300">{academicRank}</strong>. Em duy trì phong độ học tập rất tích cực, nghiêm túc trong các bài kiểm tra và luôn hoàn thành bài tập đúng hạn.
            </p>
            {bestSubject && (
              <p className="text-xs text-blue-200 pt-1">
                ⭐ Môn học nổi bật: <strong>{bestSubject.subject}</strong> ({bestSubject.score} điểm)
              </p>
            )}
          </div>

          {/* Quick GPA display badge */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <Award className="w-8 h-8 text-amber-300 mb-1" />
            <span className="text-3xl sm:text-4xl font-black text-white">{averageScore}</span>
            <span className="text-xs font-semibold text-blue-100 mt-1 uppercase tracking-wider">{academicRank}</span>
            <span className="text-[11px] text-blue-200 mt-2">Tổng số {totalSubjects} môn học</span>
          </div>
        </div>
      </div>

      {/* Simple Visual Score Comparison Bar Chart */}
      <div id="grades-visual-chart" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h3 id="grades-chart-heading" className="text-base font-bold text-slate-900">
              Biểu đồ so sánh điểm số các môn học
            </h3>
          </div>
          <span className="text-xs text-slate-400">Thang điểm 10.0</span>
        </div>

        <div className="space-y-3 pt-2">
          {scores.map((item) => {
            const percentage = (item.score / 10) * 100;
            const isHigh = item.score >= 9.0;
            const isGood = item.score >= 8.0;

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{item.subject}</span>
                    <span className="text-slate-400 font-normal">({item.completedCount}/{item.totalCount} bài)</span>
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                    isHigh ? 'bg-emerald-100 text-emerald-800' : isGood ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.score.toFixed(1)} đ
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-emerald-500' : isGood ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Subject Scores & Encouraging Remarks */}
      <div id="grades-details-section" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="grades-table-heading" className="text-base font-bold text-slate-900">
              Chi tiết điểm số & Nhận xét từ Giáo viên
            </h3>
            <p className="text-xs text-slate-500">Giáo viên: {TEACHER_INFO.name} • Trường THPT Phạm Văn Đồng</p>
          </div>
          <span className="text-xs text-slate-400">Bấm nút bút chì để sửa điểm / nhận xét</span>
        </div>

        <div id="grades-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scores.map((item) => {
            const isHigh = item.score >= 9.0;
            const isGood = item.score >= 8.0;

            return (
              <div
                key={item.id}
                id={`score-card-${item.id}`}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/40 hover:bg-white flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.subject}</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      Đã hoàn thành: <strong className="text-slate-700">{item.completedCount}/{item.totalCount}</strong> bài
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-base font-black px-2.5 py-1 rounded-lg ${
                      isHigh 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isGood 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.score.toFixed(1)}
                    </span>
                    <button
                      id={`edit-score-btn-${item.id}`}
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Chỉnh sửa điểm hoặc nhận xét"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Positive / Constructive Remarks */}
                <div className="p-3 bg-white rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Nhận xét của cô Diệp Thị Linh:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{item.teacherComment}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Score Modal */}
      {editingScore && (
        <div id="score-edit-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div id="score-edit-modal-card" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setEditingScore(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              Cập nhật điểm & nhận xét: {editingScore.subject}
            </h3>

            <form onSubmit={handleSaveScore} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm số (thang 10) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={scoreForm.score ?? ''}
                    onChange={(e) => setScoreForm({ ...scoreForm, score: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số bài đã hoàn thành
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scoreForm.completedCount ?? 0}
                    onChange={(e) => setScoreForm({ ...scoreForm, completedCount: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhận xét tích cực / động viên học sinh *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhận xét khích lệ, ghi nhận nỗ lực của học sinh..."
                  value={scoreForm.teacherComment || ''}
                  onChange={(e) => setScoreForm({ ...scoreForm, teacherComment: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingScore(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu điểm & Nhận xét</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
