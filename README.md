# Edge Edu — Admin Panel

A role-based learning management admin panel built with React 19, TypeScript, and Tailwind CSS. Supports two admin roles — **Super Admin** (platform-wide) and **Department Admin** (course-scoped) — with dashboards, course authoring, student tracking, analytics, and platform configuration.

---

## Live Demo

Deployed on GitHub Pages and Vercel. All data is in-memory (no backend required).

**Demo Credentials**

| Email | Password | Role | Department |
|-------|----------|------|------------|
| sarah@onedge.co | admin123 | Super Admin | Platform |
| ahmed@onedge.co | admin123 | Dept. Admin | Healthcare |
| priya@onedge.co | admin123 | Dept. Admin | AI & Tech |
| james@onedge.co | admin123 | Dept. Admin | Compliance |

---

## Features

### Super Admin
- **Platform Dashboard** — KPIs: total enrollments, active users, completion rate, pending approvals
- **Course Approval Queue** — Review, approve, or reject courses submitted by department admins
- **Course Flags** — Mark courses as Featured, Trending, Top Course, Webinar, or Coming Soon
- **User Management** — Invite admins by email, suspend/unsuspend users, assign roles and departments
- **Library** — Full CRUD for Skills, Categories, Languages, Badges, Instructors, and Departments
- **Platform Analytics** — Enrollment trends, completion funnel, admin performance, skill distribution charts
- **Settings & Logs** — Configure quiz pass thresholds, toggle approval workflow, view audit logs, manage notification templates

### Department Admin
- **Admin Dashboard** — Personal KPIs: my courses, enrolled students, completions, pending reviews
- **Course Authoring** — 5-step wizard: basic info → metadata → outcomes → visibility → module builder
- **Publish Workflow** — Draft → Submit for Review → Live; super admin approves or rejects with notes
- **Student Progress** — Per-student lesson completion, quiz scores, time spent, certificate status
- **Admin Controls** — Reset a student's progress or skip individual lessons (with confirmation dialogs)
- **Manual Enrollment** — Enroll students by email directly into a course
- **Analytics** — Per-course enrollment trends, lesson drop-off, quiz performance

### Shared
- **Notification Drawer** — Real-time notifications for approvals, rejections, enrollments, completions
- **Mobile Responsive** — Collapsible sidebar drawer, responsive grids, touch-friendly controls
- **Search & Filter** — Search across courses, students, and users; filter by status, role, and department

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router v7 |
| State | React Context API |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Linting | ESLint 10 + typescript-eslint |

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/shahzaib-khan404/edge-edu-admin.git
cd edge-edu-admin
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with any demo credential above.

### Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Type-check + production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
edge-edu-admin/
├── src/
│   ├── context/
│   │   └── AppContext.tsx          # Global state, auth, all data setters
│   ├── data/
│   │   └── mockData.ts             # All mock data (users, courses, analytics, etc.)
│   ├── layouts/
│   │   ├── AppLayout.tsx           # App shell: sidebar + topbar + content
│   │   ├── Sidebar.tsx             # Role-aware navigation with dark purple theme
│   │   └── TopBar.tsx              # Header with notification drawer
│   ├── pages/
│   │   ├── Login.tsx               # Authentication page
│   │   ├── super-admin/
│   │   │   ├── SAOverview.tsx      # Platform dashboard
│   │   │   ├── SALibrary.tsx       # Master data CRUD
│   │   │   ├── SACourses.tsx       # Course approval & flagging
│   │   │   ├── SAUsers.tsx         # User management
│   │   │   ├── SAAnalytics.tsx     # Platform analytics
│   │   │   └── SASettings.tsx      # Platform settings & audit logs
│   │   ├── admin/
│   │   │   ├── AdminOverview.tsx   # Admin dashboard
│   │   │   ├── AdminCourses.tsx    # Course list & publish controls
│   │   │   ├── AdminStudents.tsx   # Student progress & admin controls
│   │   │   └── AdminAnalytics.tsx  # Course-scoped analytics
│   │   └── shared/
│   │       └── CourseWizard.tsx    # 5-step course creation/edit wizard
│   ├── components/
│   │   └── ui/
│   │       ├── Modal.tsx           # Reusable modal (sm/md/lg/xl)
│   │       ├── ConfirmDialog.tsx   # Destructive action confirmation
│   │       ├── SearchInput.tsx     # Search field with icon
│   │       └── EmptyState.tsx      # Empty table/list placeholder
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces and types
│   ├── App.tsx                     # Router config and protected routes
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Tailwind + custom component classes
│   └── App.css
├── public/
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                     # SPA rewrite rule for Vercel
└── .github/workflows/deploy.yml   # GitHub Pages CI/CD
```

---

## Data Models

### Core Types (`src/types/index.ts`)

```typescript
// User roles
type Role = "super_admin" | "admin";
type UserStatus = "active" | "suspended" | "invited";

// Course lifecycle
type CourseStatus = "draft" | "pending_review" | "live";

// Student progress
type LessonStatus = "not_started" | "in_progress" | "completed" | "skipped";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role | "user";
  department?: string;
  status: UserStatus;
  dateJoined: string;
}

interface Course {
  id: string;
  title: string;
  status: CourseStatus;
  createdBy: string;        // userId
  modules: Module[];
  enrollments: number;
  completionRate: number;
  // ...flags, metadata
}

interface StudentEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;         // 0–100, derived from lesson statuses
  certificateIssued: boolean;
  modules: ModuleProgress[];
}

interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  quizScore?: number;
  timeSpent?: number;       // minutes
  skippedAt?: string;       // ISO timestamp set when admin skips
}
```

---

## State Management

All state lives in `AppContext` (`src/context/AppContext.tsx`). The context exposes:

- `courses` / `setCourses` — full course list
- `users` / `setUsers` — all platform users
- `notifications` / `setNotifications` — notification feed
- `settings` / `setSettings` — platform config
- `skills`, `categories`, `languages`, `badges`, `instructors`, `departments` — library data with setters
- `currentUser`, `currentRole`, `isLoggedIn` — auth state
- `login(email, password)` → `boolean`
- `logout()`
- `unreadCount` — derived from unread notifications

Access it anywhere with:
```typescript
import { useApp } from "../context/AppContext";
const { courses, setCourses, currentUser } = useApp();
```

---

## Routing

Routes are protected by a `ProtectedRoute` wrapper in `App.tsx` that checks `isLoggedIn` and `currentRole`.

```
/login                  → Login page (public)
/sa/overview            → Super Admin dashboard
/sa/library             → Library management
/sa/courses             → Course approvals
/sa/users               → User management
/sa/analytics           → Platform analytics
/sa/settings            → Platform settings
/admin/overview         → Dept. Admin dashboard
/admin/courses          → My courses
/admin/students         → My students
/admin/analytics        → My analytics
*                       → Redirects to /login
```

---

## Theming

Custom brand color scale defined in `tailwind.config.js`:

```
brand-50  #f0edff  ←  lightest
brand-400 #8b5cf6
brand-500 #7c3aed  ←  primary
brand-600 #6d28d9  ←  buttons / active states
brand-900 #2e1065  ←  darkest
```

Custom utility classes in `src/index.css`:

| Class | Usage |
|-------|-------|
| `.card` | White rounded card with subtle shadow |
| `.btn-primary` | Purple gradient button |
| `.btn-secondary` | White/gray outlined button |
| `.btn-danger` | Red gradient button |
| `.badge-live` | Green badge |
| `.badge-pending` | Amber badge |
| `.badge-draft` | Gray badge |
| `.input` / `.select` | Form controls |
| `.table-header` / `.table-cell` / `.table-row` | Table elements |
| `.sidebar-link` | Nav link with active gradient state |

---

## Deployment

### Vercel

1. Import the repo in [vercel.com](https://vercel.com)
2. Framework: **Vite** (auto-detected)
3. Build command: `npm run build`
4. Output directory: `dist`
5. `vercel.json` handles SPA routing automatically

### GitHub Pages

Automated via `.github/workflows/deploy.yml` — pushes to `main` trigger a build and deploy.

```bash
# Manual build for GitHub Pages
GITHUB_PAGES=true npm run build
```

The `GITHUB_PAGES=true` env var sets the Vite `base` to `/edge-edu-admin/` so assets load correctly on the `/<repo-name>/` sub-path.

---

## Integration Guide

See [INTEGRATION.md](./INTEGRATION.md) for a step-by-step guide on connecting this panel to a real backend, replacing mock data with API calls, and embedding it into your main application.
