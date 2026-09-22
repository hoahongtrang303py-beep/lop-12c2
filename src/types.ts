export type TaskStatus = 'chua_lam' | 'dang_lam' | 'hoan_thanh';

export type TaskPriority = 'Bình thường' | 'Quan trọng' | 'Khẩn cấp';

export type NavigationTab = 'trang_chu' | 'ho_so' | 'nhiem_vu' | 'tien_do' | 'ket_qua';

export interface Student {
  id: string;
  name: string;
  classId: string;
  studentCode: string;
  email: string;
  phone: string;
  academicYear: string;
  bio: string;
  homeroomTeacher: string;
  school: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  shortDescription: string;
  detailedInstructions: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  teacherNote: string;
  assignedBy: string;
  completedDate?: string;
  studentId?: string; // If specific to student, otherwise applies to class/all
}

export interface SubjectScore {
  id: string;
  studentId: string;
  subject: string;
  completedCount: number;
  totalCount: number;
  score: number;
  teacherComment: string;
  lastUpdated: string;
}

export interface AppState {
  students: Student[];
  currentStudentId: string;
  tasks: Task[];
  scores: SubjectScore[];
  soundEnabled: boolean;
}
