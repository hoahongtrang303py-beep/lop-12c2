import { AppState } from '../types';
import { INITIAL_STUDENTS, INITIAL_TASKS, INITIAL_SCORES } from '../data/initialData';

const STORAGE_KEY = 'thpt_pvd_lms_state_v1';

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return {
      students: INITIAL_STUDENTS,
      currentStudentId: INITIAL_STUDENTS[0].id,
      tasks: INITIAL_TASKS,
      scores: INITIAL_SCORES,
      soundEnabled: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        students: INITIAL_STUDENTS,
        currentStudentId: INITIAL_STUDENTS[0].id,
        tasks: INITIAL_TASKS,
        scores: INITIAL_SCORES,
        soundEnabled: true,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      students: parsed.students && parsed.students.length ? parsed.students : INITIAL_STUDENTS,
      currentStudentId: parsed.currentStudentId || INITIAL_STUDENTS[0].id,
      tasks: parsed.tasks && parsed.tasks.length ? parsed.tasks : INITIAL_TASKS,
      scores: parsed.scores && parsed.scores.length ? parsed.scores : INITIAL_SCORES,
      soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {
      students: INITIAL_STUDENTS,
      currentStudentId: INITIAL_STUDENTS[0].id,
      tasks: INITIAL_TASKS,
      scores: INITIAL_SCORES,
      soundEnabled: true,
    };
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function resetAppState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return {
    students: INITIAL_STUDENTS,
    currentStudentId: INITIAL_STUDENTS[0].id,
    tasks: INITIAL_TASKS,
    scores: INITIAL_SCORES,
    soundEnabled: true,
  };
}
