import type {
  User, Course, Instructor, Category, Skill, Language, Badge,
  Department, Notification, AuditLog, PlatformSettings,
} from "../types";

export const mockUsers: User[] = [
  { id: "u1", name: "Sarah Johnson", email: "sarah@onedge.co", role: "super_admin", status: "active", dateJoined: "2024-01-10", department: "Platform" },
  { id: "u2", name: "Ahmed Khan", email: "ahmed@onedge.co", role: "admin", status: "active", dateJoined: "2024-02-15", department: "Healthcare" },
  { id: "u3", name: "Priya Sharma", email: "priya@onedge.co", role: "admin", status: "active", dateJoined: "2024-03-01", department: "AI & Tech" },
  { id: "u4", name: "James Lee", email: "james@onedge.co", role: "admin", status: "invited", dateJoined: "2024-04-20", department: "Compliance" },
  { id: "u5", name: "Fatima Ali", email: "fatima@onedge.co", role: "user", status: "active", dateJoined: "2024-03-10" },
  { id: "u6", name: "Carlos Ruiz", email: "carlos@onedge.co", role: "user", status: "active", dateJoined: "2024-04-05" },
  { id: "u7", name: "Nina Patel", email: "nina@onedge.co", role: "user", status: "suspended", dateJoined: "2024-02-28" },
  { id: "u8", name: "Omar Hassan", email: "omar@onedge.co", role: "user", status: "active", dateJoined: "2024-05-01" },
];

export const mockInstructors: Instructor[] = [
  { id: "i1", name: "Dr. Aisha Malik", bio: "Senior medical professional with 15 years experience", email: "aisha@expert.com", linkedin: "linkedin.com/in/aishamalik" },
  { id: "i2", name: "Prof. Raza Ahmed", bio: "AI researcher and educator at MIT", email: "raza@mit.edu", linkedin: "linkedin.com/in/razaahmed" },
  { id: "i3", name: "Sarah Mitchell", bio: "Compliance and risk management specialist", email: "sarah@consulting.com" },
  { id: "i4", name: "David Chen", bio: "Full-stack engineer and tech educator", email: "david@techcorp.com" },
];

export const mockCategories: Category[] = [
  { id: "c1", name: "Healthcare", icon: "🏥", color: "#10b981" },
  { id: "c2", name: "Artificial Intelligence", icon: "🤖", color: "#8b5cf6" },
  { id: "c3", name: "Compliance", icon: "📋", color: "#f59e0b" },
  { id: "c4", name: "Leadership", icon: "🎯", color: "#3b82f6" },
  { id: "c5", name: "Data Science", icon: "📊", color: "#ec4899" },
];

export const mockSkills: Skill[] = [
  { id: "s1", name: "Clinical Assessment", category: "Healthcare" },
  { id: "s2", name: "Patient Communication", category: "Healthcare" },
  { id: "s3", name: "Machine Learning", category: "AI" },
  { id: "s4", name: "Prompt Engineering", category: "AI" },
  { id: "s5", name: "GDPR Compliance", category: "Compliance" },
  { id: "s6", name: "Risk Analysis", category: "Compliance" },
  { id: "s7", name: "Team Leadership", category: "Leadership" },
  { id: "s8", name: "Python", category: "Data Science" },
];

export const mockLanguages: Language[] = [
  { id: "l1", name: "English", code: "en" },
  { id: "l2", name: "Urdu", code: "ur" },
  { id: "l3", name: "Arabic", code: "ar" },
  { id: "l4", name: "French", code: "fr" },
];

export const mockBadges: Badge[] = [
  { id: "b1", name: "Healthcare Champion", description: "Awarded for completing all healthcare modules" },
  { id: "b2", name: "AI Pioneer", description: "Completed advanced AI certification" },
  { id: "b3", name: "Compliance Expert", description: "Mastered regulatory compliance" },
  { id: "b4", name: "Rising Star", description: "Completed first course with distinction" },
];

export const mockDepartments: Department[] = [
  { id: "d1", name: "Healthcare", adminIds: ["u2"] },
  { id: "d2", name: "AI & Tech", adminIds: ["u3"] },
  { id: "d3", name: "Compliance", adminIds: ["u4"] },
  { id: "d4", name: "Platform", adminIds: [] },
];

export const mockCourses: Course[] = [
  {
    id: "cr1", title: "Advanced Clinical Assessment", subtitle: "Master patient evaluation techniques",
    description: "A comprehensive course on clinical assessment protocols for modern healthcare professionals.",
    about: "Deep dive into evidence-based assessment methods used in top hospitals worldwide.",
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=225&fit=crop",
    status: "live", createdBy: "u2", department: "Healthcare", category: "c1",
    badge: "b1", instructor: "i1", language: "l1", totalHours: "24",
    skills: ["s1", "s2"], whatYoullLearn: ["Perform accurate clinical assessments", "Apply diagnostic frameworks", "Document patient findings"],
    courseIncludes: ["57 video lectures", "12 quizzes", "Case study scenarios"],
    modules: [
      { id: "m1", title: "Introduction to Assessment", description: "Fundamentals", lessons: [
        { id: "ls1", title: "Course Overview", type: "video", duration: 8 },
        { id: "ls2", title: "Assessment Basics Quiz", type: "quiz" },
      ], order: 1 },
      { id: "m2", title: "Diagnostic Frameworks", description: "Advanced techniques", lessons: [
        { id: "ls3", title: "SOAP Method", type: "video", duration: 15 },
        { id: "ls4", title: "Case Study: ER Patient", type: "scenario" },
      ], order: 2 },
    ],
    enrollments: 342, completionRate: 78, avgQuizScore: 82, isFeatured: true, isTopCourse: true,
    hasCertificate: true, createdAt: "2024-02-01",
  },
  {
    id: "cr2", title: "AI in Healthcare", subtitle: "Applying machine learning to medical data",
    description: "Learn how artificial intelligence is transforming modern medicine.",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop",
    status: "live", createdBy: "u2", department: "Healthcare", category: "c2",
    badge: "b2", instructor: "i2", language: "l1", totalHours: "18",
    skills: ["s3", "s1"], whatYoullLearn: ["Understand AI applications in medicine", "Use diagnostic AI tools"],
    courseIncludes: ["40 video lectures", "8 quizzes"],
    modules: [], enrollments: 215, completionRate: 65, avgQuizScore: 74,
    isTrending: true, hasCertificate: true, createdAt: "2024-03-15",
  },
  {
    id: "cr3", title: "GDPR & Data Privacy Fundamentals", subtitle: "Compliance made simple",
    description: "Everything you need to know about GDPR compliance for your organization.",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop",
    status: "pending_review", createdBy: "u4", department: "Compliance", category: "c3",
    instructor: "i3", language: "l1", totalHours: "12",
    skills: ["s5", "s6"], whatYoullLearn: ["Navigate GDPR requirements", "Build compliant processes"],
    courseIncludes: ["25 video lectures", "5 assessments"],
    modules: [], enrollments: 0, completionRate: 0, createdAt: "2024-04-18",
  },
  {
    id: "cr4", title: "Prompt Engineering Mastery", subtitle: "Get the most out of AI models",
    description: "Master the art of crafting effective prompts for large language models.",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=225&fit=crop",
    status: "draft", createdBy: "u3", department: "AI & Tech", category: "c2",
    instructor: "i2", language: "l1", totalHours: "10",
    skills: ["s4"], whatYoullLearn: ["Write effective prompts", "Understand LLM behavior"],
    courseIncludes: ["20 video lectures", "10 exercises"],
    modules: [], enrollments: 0, completionRate: 0, createdAt: "2024-04-25",
  },
  {
    id: "cr5", title: "Leadership in the Digital Age", subtitle: "Lead teams through technological change",
    description: "Develop the leadership skills needed to navigate modern organizational challenges.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    status: "live", createdBy: "u3", department: "AI & Tech", category: "c4",
    instructor: "i4", language: "l1", totalHours: "16",
    skills: ["s7"], whatYoullLearn: ["Lead with empathy", "Drive digital transformation"],
    courseIncludes: ["35 video lectures", "7 workshops"],
    modules: [], enrollments: 189, completionRate: 71, avgQuizScore: 88,
    hasCertificate: true, createdAt: "2024-03-05",
  },
];

export const mockNotifications: Notification[] = [
  { id: "n1", type: "approval", title: "Course Approved", message: "Your course 'Advanced Clinical Assessment' has been approved and is now live.", read: false, createdAt: "2024-04-20T10:30:00Z" },
  { id: "n2", type: "enrollment", title: "New Enrollment", message: "Fatima Ali enrolled in 'AI in Healthcare'.", read: false, createdAt: "2024-04-20T09:15:00Z" },
  { id: "n3", type: "completion", title: "Course Completed", message: "Carlos Ruiz completed 'Advanced Clinical Assessment'.", read: true, createdAt: "2024-04-19T16:00:00Z" },
  { id: "n4", type: "rejection", title: "Course Rejected", message: "Your course 'GDPR Basics' was returned to draft. Note: Please add more practical examples to Module 2.", read: true, createdAt: "2024-04-18T11:00:00Z" },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "a1", user: "Sarah Johnson", action: "Approved Course", resource: "Advanced Clinical Assessment", ip: "192.168.1.100", timestamp: "2024-04-20T10:30:00Z" },
  { id: "a2", user: "Ahmed Khan", action: "Created Course", resource: "AI in Healthcare", ip: "192.168.1.102", timestamp: "2024-04-19T14:20:00Z" },
  { id: "a3", user: "Sarah Johnson", action: "Invited Admin", resource: "james@onedge.co", ip: "192.168.1.100", timestamp: "2024-04-18T09:00:00Z" },
  { id: "a4", user: "Sarah Johnson", action: "Suspended User", resource: "Nina Patel", ip: "192.168.1.100", timestamp: "2024-04-17T15:45:00Z" },
  { id: "a5", user: "Priya Sharma", action: "Published Course", resource: "Leadership in the Digital Age", ip: "192.168.1.105", timestamp: "2024-04-16T11:30:00Z" },
];

export const mockSettings: PlatformSettings = {
  platformName: "Edge Edu",
  supportEmail: "support@onedge.co",
  approvalWorkflow: true,
  quizPassThreshold: 67,
  mcqPassThreshold: 70,
  scenarioPassThreshold: 60,
  diagnosticPassThreshold: 67,
};

export const enrollmentOverTime = [
  { month: "Nov", enrollments: 120, newUsers: 45, returning: 75 },
  { month: "Dec", enrollments: 185, newUsers: 80, returning: 105 },
  { month: "Jan", enrollments: 210, newUsers: 95, returning: 115 },
  { month: "Feb", enrollments: 290, newUsers: 130, returning: 160 },
  { month: "Mar", enrollments: 345, newUsers: 148, returning: 197 },
  { month: "Apr", enrollments: 420, newUsers: 172, returning: 248 },
];

export const completionFunnel = [
  { stage: "Enrolled", count: 1246 },
  { stage: "Started", count: 987 },
  { stage: "50% Done", count: 654 },
  { stage: "Completed", count: 431 },
];

export const adminPerformance = [
  { name: "Ahmed Khan", dept: "Healthcare", courses: 3, students: 557, completion: 74, avgQuiz: 79 },
  { name: "Priya Sharma", dept: "AI & Tech", courses: 2, students: 189, completion: 71, avgQuiz: 85 },
  { name: "James Lee", dept: "Compliance", courses: 1, students: 0, completion: 0, avgQuiz: 0 },
];

export const revenueData = [
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 6750 },
];

export const userGrowth = [
  { month: "Nov", newUsers: 45, returning: 75, total: 120 },
  { month: "Dec", newUsers: 80, returning: 105, total: 185 },
  { month: "Jan", newUsers: 95, returning: 115, total: 210 },
  { month: "Feb", newUsers: 130, returning: 160, total: 290 },
  { month: "Mar", newUsers: 148, returning: 197, total: 345 },
  { month: "Apr", newUsers: 172, returning: 248, total: 420 },
];

export const categoryDistribution = [
  { name: "Healthcare", courses: 2, enrollments: 557, color: "#10b981" },
  { name: "AI & Tech", courses: 2, enrollments: 215, color: "#8b5cf6" },
  { name: "Compliance", courses: 1, enrollments: 0, color: "#f59e0b" },
  { name: "Leadership", courses: 1, enrollments: 189, color: "#3b82f6" },
  { name: "Data Science", courses: 0, enrollments: 0, color: "#ec4899" },
];

export const skillsEnrollment = [
  { skill: "Clinical Assessment", enrollments: 342 },
  { skill: "Patient Comms", enrollments: 310 },
  { skill: "Machine Learning", enrollments: 215 },
  { skill: "Team Leadership", enrollments: 189 },
  { skill: "Prompt Engineering", enrollments: 120 },
  { skill: "GDPR Compliance", enrollments: 95 },
  { skill: "Risk Analysis", enrollments: 88 },
  { skill: "Python", enrollments: 64 },
];

export const lessonDropoffSA = [
  { lesson: "Intro", pct: 100 },
  { lesson: "Lesson 2", pct: 91 },
  { lesson: "Lesson 3", pct: 82 },
  { lesson: "Quiz 1", pct: 74 },
  { lesson: "Lesson 5", pct: 63 },
  { lesson: "Lesson 6", pct: 52 },
  { lesson: "Lesson 7", pct: 44 },
  { lesson: "Final Quiz", pct: 35 },
];

export const quizScoresPerCourse = [
  { course: "Clinical Assessment", avgScore: 82, passRate: 88, attempts: 342 },
  { course: "AI in Healthcare", avgScore: 74, passRate: 79, attempts: 215 },
  { course: "Leadership", avgScore: 88, passRate: 93, attempts: 189 },
  { course: "Prompt Engineering", avgScore: 71, passRate: 75, attempts: 0 },
  { course: "GDPR Fundamentals", avgScore: 0, passRate: 0, attempts: 0 },
];

export const activeLearnersData = [
  { week: "W1", active: 210 },
  { week: "W2", active: 248 },
  { week: "W3", active: 305 },
  { week: "W4", active: 289 },
  { week: "W5", active: 342 },
  { week: "W6", active: 378 },
];

// Mini sparklines for KPI cards (last 6 months)
export const enrollmentSparkline  = [120, 185, 210, 290, 345, 420];
export const userSparkline        = [18, 22, 26, 30, 35, 40];
export const completionSparkline  = [62, 64, 67, 70, 72, 74];
export const pendingSparkline     = [2, 4, 1, 3, 2, 1];

export const departmentStats = [
  { name: "Healthcare",  courses: 2, live: 2, students: 557, completion: 74, color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  { name: "AI & Tech",   courses: 2, live: 1, students: 215, completion: 65, color: "#8b5cf6", bg: "bg-brand-50",   text: "text-brand-700",   border: "border-brand-100"   },
  { name: "Compliance",  courses: 1, live: 0, students: 0,   completion: 0,  color: "#f59e0b", bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100"  },
  { name: "Leadership",  courses: 1, live: 1, students: 189, completion: 71, color: "#3b82f6", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100"   },
];

// Admin-scoped sparklines
export const adminEnrollSparkline    = [28, 45, 62, 85, 104, 120];
export const adminCompletionSparkline = [55, 60, 63, 68, 72, 74];
export const adminQuizSparkline      = [74, 76, 78, 79, 81, 82];
export const adminStudentSparkline   = [12, 18, 22, 28, 34, 38];

export const adminActivityFeed = [
  { id: "a1", type: "enrollment",  actor: "Fatima Ali",   action: "enrolled in",  target: "Advanced Clinical Assessment", time: "2 min ago",   course: "cr1" },
  { id: "a2", type: "completion",  actor: "Carlos Ruiz",  action: "completed",    target: "Advanced Clinical Assessment", time: "1 hr ago",    course: "cr1" },
  { id: "a3", type: "approval",    actor: "Sarah Johnson",action: "approved",     target: "AI in Healthcare",             time: "3 hrs ago",   course: "cr2" },
  { id: "a4", type: "enrollment",  actor: "Omar Hassan",  action: "enrolled in",  target: "AI in Healthcare",             time: "5 hrs ago",   course: "cr2" },
  { id: "a5", type: "quiz",        actor: "James Lee",    action: "scored 92% on","target": "Clinical Assessment Quiz 2", time: "Yesterday",   course: "cr1" },
  { id: "a6", type: "completion",  actor: "Nina Patel",   action: "completed",    target: "AI in Healthcare",             time: "Yesterday",   course: "cr2" },
  { id: "a7", type: "enrollment",  actor: "Aisha Malik",  action: "enrolled in",  target: "Advanced Clinical Assessment", time: "2 days ago",  course: "cr1" },
  { id: "a8", type: "milestone",   actor: "System",       action: "Course hit 300 enrollments —", target: "Advanced Clinical Assessment", time: "2 days ago", course: "cr1" },
];

export const topStudents = [
  { id: "ts1", name: "Carlos Ruiz",  email: "carlos@onedge.co", progress: 100, quizAvg: 91, courseTitle: "Advanced Clinical Assessment", certified: true  },
  { id: "ts2", name: "Fatima Ali",   email: "fatima@onedge.co", progress: 85,  quizAvg: 84, courseTitle: "Advanced Clinical Assessment", certified: false },
  { id: "ts3", name: "James Lee",    email: "james@onedge.co",  progress: 78,  quizAvg: 88, courseTitle: "Advanced Clinical Assessment", certified: false },
  { id: "ts4", name: "Omar Hassan",  email: "omar@onedge.co",   progress: 45,  quizAvg: 72, courseTitle: "AI in Healthcare",            certified: false },
  { id: "ts5", name: "Nina Patel",   email: "nina@onedge.co",   progress: 100, quizAvg: 79, courseTitle: "AI in Healthcare",            certified: true  },
];

export const courseWeeklyEnrollments = [
  { week: "W1", cr1: 28, cr2: 14 },
  { week: "W2", cr1: 45, cr2: 22 },
  { week: "W3", cr1: 62, cr2: 38 },
  { week: "W4", cr1: 55, cr2: 30 },
  { week: "W5", cr1: 88, cr2: 45 },
  { week: "W6", cr1: 72, cr2: 51 },
];

export const skillsCompleted = [
  { skill: "Clinical Assessment", completions: 268, pct: 78 },
  { skill: "Patient Communication", completions: 210, pct: 61 },
  { skill: "Machine Learning", completions: 140, pct: 65 },
  { skill: "Diagnostic Frameworks", completions: 195, pct: 57 },
];

export const adminTasks = [
  { id: "t1", label: "Add thumbnail to 'AI in Healthcare' edit screen", priority: "high",   done: false },
  { id: "t2", label: "Review quiz scores for Module 2",                  priority: "medium", done: false },
  { id: "t3", label: "Update course description for Clinical Assessment", priority: "low",   done: true  },
  { id: "t4", label: "Respond to student query on Lesson 5",             priority: "high",   done: false },
];

export const activityFeed = [
  { id: "af1", type: "enrollment",  actor: "Fatima Ali",     action: "enrolled in",         target: "Advanced Clinical Assessment", time: "2 min ago",   dept: "Healthcare" },
  { id: "af2", type: "submit",      actor: "James Lee",      action: "submitted for review", target: "GDPR & Data Privacy Fundamentals", time: "18 min ago",  dept: "Compliance" },
  { id: "af3", type: "completion",  actor: "Carlos Ruiz",    action: "completed",            target: "Advanced Clinical Assessment", time: "1 hr ago",    dept: "Healthcare" },
  { id: "af4", type: "new_admin",   actor: "Sarah Johnson",  action: "invited",              target: "james@onedge.co as Admin",     time: "3 hrs ago",   dept: "Platform"   },
  { id: "af5", type: "enrollment",  actor: "Omar Hassan",    action: "enrolled in",          target: "AI in Healthcare",             time: "5 hrs ago",   dept: "Healthcare" },
  { id: "af6", type: "publish",     actor: "Priya Sharma",   action: "published",            target: "Leadership in the Digital Age","time": "Yesterday", dept: "AI & Tech"  },
  { id: "af7", type: "completion",  actor: "Nina Patel",     action: "completed",            target: "AI in Healthcare",             time: "Yesterday",   dept: "Healthcare" },
  { id: "af8", type: "new_user",    actor: "System",         action: "5 new users joined",   target: "",                             time: "2 days ago",  dept: ""           },
];
