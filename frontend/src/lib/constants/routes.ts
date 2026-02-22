export const ROUTES = {
  LOGIN: '/login',
  ADMIN: {
    ROOT:      '/admin',
    DASHBOARD: '/admin/dashboard',
    COURSES:   '/admin/courses',
    QUESTIONS: '/admin/questions',
    QUIZZES:   '/admin/quizzes',
    BATCHES:   '/admin/batches',
  },
  FACULTY: {
    DASHBOARD: '/faculty/dashboard',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
  },
} as const;
