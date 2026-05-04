export type Role = "super_admin" | "admin";

export type CourseStatus = "draft" | "pending_review" | "live";

export type UserStatus = "active" | "suspended" | "invited";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | "user";
  department?: string;
  status: UserStatus;
  dateJoined: string;
  avatar?: string;
  loginHistory?: string[];
  enrolledCourses?: string[];
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  email: string;
  linkedin?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Department {
  id: string;
  name: string;
  adminIds: string[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "quiz" | "text" | "document" | "scenario";
  duration?: number;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  about?: string;
  thumbnail?: string;
  status: CourseStatus;
  createdBy: string;
  department?: string;
  category?: string;
  badge?: string;
  instructor?: string;
  language?: string;
  totalHours?: string;
  skills: string[];
  whatYoullLearn: string[];
  courseIncludes: string[];
  modules: Module[];
  enrollments: number;
  completionRate: number;
  avgQuizScore?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isTopCourse?: boolean;
  isWebinar?: boolean;
  isComingSoon?: boolean;
  hasCertificate?: boolean;
  createdAt: string;
  rejectionNote?: string;
}

export interface Notification {
  id: string;
  type: "approval" | "rejection" | "enrollment" | "completion";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  approvalWorkflow: boolean;
  quizPassThreshold: number;
  mcqPassThreshold: number;
  scenarioPassThreshold: number;
  diagnosticPassThreshold: number;
}
