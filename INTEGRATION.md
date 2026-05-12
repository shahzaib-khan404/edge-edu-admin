# Integration Guide

This document explains how to connect the Edge Edu Admin Panel to a real backend and embed it into your main application.

---

## Overview

The admin panel is currently a standalone React SPA with all data held in-memory via `AppContext`. To integrate it into production you need to:

1. Replace mock data with real API calls
2. Wire up real authentication (JWT or session)
3. Embed or proxy the panel into your main app (monorepo, iframe, or subdomain)

---

## 1. Connecting to a Real API

### Where mock data lives

All mock data is in `src/data/mockData.ts` and is loaded into state in `src/context/AppContext.tsx`. The strategy is to swap those initial values and the `login` function for real API calls.

### Step-by-step

**a. Create an API service layer**

Create `src/services/api.ts` as a thin wrapper around your HTTP client:

```typescript
const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  getCourses:      ()              => request<Course[]>("/courses"),
  getUsers:        ()              => request<User[]>("/users"),
  getNotifications:()              => request<Notification[]>("/notifications"),
  getSettings:     ()              => request<PlatformSettings>("/settings"),
  updateCourse:    (id, data)      => request(`/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateUser:      (id, data)      => request(`/users/${id}`,   { method: "PATCH", body: JSON.stringify(data) }),
  login:           (email, pass)   => request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: pass }),
  }),
  // add more endpoints as needed
};
```

**b. Add environment variable**

Create `.env.local`:
```
VITE_API_URL=https://your-api.example.com/api/v1
```

> Vite only exposes variables prefixed with `VITE_` to the browser bundle.

**c. Replace AppContext initialization**

In `src/context/AppContext.tsx`, replace the static mock imports with API calls using `useEffect`:

```typescript
// Before (mock)
const [courses, setCourses] = useState<Course[]>(mockCourses);

// After (real API)
const [courses, setCourses] = useState<Course[]>([]);

useEffect(() => {
  if (!isLoggedIn) return;
  api.getCourses().then(setCourses).catch(console.error);
}, [isLoggedIn]);
```

Repeat for `users`, `notifications`, `settings`, and all library data (`skills`, `categories`, etc.).

**d. Replace write operations**

Every `setCourses(prev => ...)` call in the pages is an optimistic local update. Back each one with an API call:

```typescript
// Example: publishing a course in AdminCourses.tsx
async function handlePublish(courseId: string) {
  await api.updateCourse(courseId, { status: "pending_review" });
  setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: "pending_review" } : c));
}
```

If the API call fails, revert the optimistic update or show an error.

---

## 2. Authentication

### Replacing demo credentials

The current `login()` function in `AppContext.tsx` checks against `DEMO_CREDENTIALS` (a hardcoded object). Replace it with an API call:

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const { token, user } = await api.login(email, password);
    localStorage.setItem("auth_token", token);
    setCurrentUser(user);
    setIsLoggedIn(true);
    return true;
  } catch {
    return false;
  }
};

const logout = () => {
  localStorage.removeItem("auth_token");
  setIsLoggedIn(false);
  setCurrentUser(mockUsers[0]); // or a blank default
};
```

Add a `getToken` helper:
```typescript
export const getToken = () => localStorage.getItem("auth_token") ?? "";
```

### Persisting login across page refresh

Add a bootstrap check in `AppContext`:

```typescript
useEffect(() => {
  const token = getToken();
  if (!token) return;
  api.getCurrentUser()
    .then((user) => { setCurrentUser(user); setIsLoggedIn(true); })
    .catch(() => localStorage.removeItem("auth_token"));
}, []);
```

### Role mapping

The panel expects `currentRole` to be `"super_admin"` or `"admin"`. If your backend uses different role names, map them in `AppContext.tsx`:

```typescript
const currentRole: Role = currentUser.role === "super_admin" ? "super_admin" : "admin";
```

Adjust the condition to match your API's role values.

---

## 3. Student Progress API

The `AdminStudents.tsx` page manages per-student, per-lesson progress entirely in local state (`useState`). To persist it:

**Endpoints you need:**

```
GET  /enrollments?courseId=:id          → StudentEnrollment[]
POST /enrollments/:id/reset             → resets all lesson progress
POST /enrollments/:id/lessons/:lessonId/skip  → marks lesson as skipped
```

**Wire reset and skip:**

```typescript
// Reset
async function handleResetProgress() {
  await api.post(`/enrollments/${selected.id}/reset`);
  setStudents(prev => prev.map(s =>
    s.id !== selected.id ? s : { ...s, progress: 0, certificateIssued: false, modules: resetModules(s.modules) }
  ));
}

// Skip
async function handleSkipLesson() {
  await api.post(`/enrollments/${selected.id}/lessons/${skipTarget.lessonId}/skip`);
  // optimistic update (already implemented in the component)
}
```

---

## 4. Embedding in Your Main Application

Choose the approach that fits your architecture:

### Option A — Subdomain / Separate Deployment (simplest)

Deploy the admin panel independently and serve it at `admin.yourapp.com`. Share the same authentication by:
- Using a shared cookie domain (`.yourapp.com`)
- Or exchanging a short-lived token via URL parameter on redirect from the main app

**Pros:** Zero coupling, independent deploys  
**Cons:** Separate deployment pipeline, cross-origin cookie setup

### Option B — Sub-path Proxy (Nginx / Vercel)

Serve the admin panel at `/admin` on the same domain by proxying it:

```nginx
# nginx.conf example
location /admin/ {
  proxy_pass http://admin-panel-service/;
  proxy_set_header Host $host;
}
```

Or with Vercel rewrites in your main app's `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/admin/:path*", "destination": "https://edge-edu-admin.vercel.app/:path*" }
  ]
}
```

Set `VITE_API_URL` in the admin panel's environment to point to the shared API.

### Option C — Monorepo (tightest integration)

Copy or move this project into a monorepo alongside your main app:

```
my-monorepo/
├── apps/
│   ├── web/          ← your main user-facing app
│   └── admin/        ← this project (edge-edu-admin)
├── packages/
│   └── types/        ← shared TypeScript types (optional)
```

**Steps:**

1. Move `edge-edu-admin/` into `apps/admin/`
2. Set up a workspace in the root `package.json`:
   ```json
   { "workspaces": ["apps/*"] }
   ```
3. Extract shared types (`User`, `Course`, etc.) into `packages/types` if the main app also needs them
4. Point both apps at the same `VITE_API_URL`

### Option D — npm Package (advanced)

Publish the admin panel as a private npm package and import it into your main app as a route:

```typescript
// In your main app router
import { AdminPanel } from "@onedge/admin-panel";

<Route path="/admin/*" element={
  <AdminPanel apiUrl={process.env.API_URL} token={userToken} />
} />
```

This requires wrapping the admin panel to accept external props (apiUrl, token) instead of reading from env variables. Modify `AppContext.tsx` to accept these as props.

---

## 5. Key Files to Modify for Integration

| File | What to change |
|------|---------------|
| `src/context/AppContext.tsx` | Replace mock data with API calls; replace `login()` with real auth |
| `src/data/mockData.ts` | Can be removed once API is connected; keep as fallback during development |
| `src/pages/admin/AdminStudents.tsx` | Wire reset/skip handlers to API endpoints |
| `vite.config.ts` | Add proxy config for local API development (see below) |
| `.env.local` | Add `VITE_API_URL` and any other secrets |

### Vite dev proxy (avoids CORS during local development)

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

Then set `VITE_API_URL=/api` in `.env.local` so requests go through the proxy.

---

## 6. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes (production) | Base URL for the backend API |
| `GITHUB_PAGES` | CI only | Set to `true` to enable the `/edge-edu-admin/` base path for GitHub Pages |

---

## 7. TypeScript Types for the Backend Contract

If your backend uses a different shape, update `src/types/index.ts` to match. The critical types for integration are:

```typescript
// Auth response your API should return on POST /auth/login
interface AuthResponse {
  token: string;
  user: User;
}

// User shape your API should return on GET /users/:id
interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "user";
  department?: string;
  status: "active" | "suspended" | "invited";
  dateJoined: string;
}

// Course shape — see full definition in src/types/index.ts
// StudentEnrollment shape — see full definition in src/types/index.ts
```

If your API returns snake_case keys, add a transform layer in `src/services/api.ts` to convert them to camelCase before setting state.
