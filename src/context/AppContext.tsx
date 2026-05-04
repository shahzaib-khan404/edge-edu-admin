import React, { createContext, useContext, useState } from "react";
import type { Role, Course, User, Notification, PlatformSettings, Skill, Category, Language, Badge, Instructor, Department } from "../types";
import {
  mockCourses, mockUsers, mockNotifications, mockSettings,
  mockSkills, mockCategories, mockLanguages, mockBadges, mockInstructors, mockDepartments,
} from "../data/mockData";

// Demo credentials — email → { password, userId }
export const DEMO_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "sarah@onedge.co":  { password: "admin123", userId: "u1" },
  "ahmed@onedge.co":  { password: "admin123", userId: "u2" },
  "priya@onedge.co":  { password: "admin123", userId: "u3" },
  "james@onedge.co":  { password: "admin123", userId: "u4" },
};

interface AppContextType {
  currentRole: Role;
  currentUser: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  settings: PlatformSettings;
  setSettings: React.Dispatch<React.SetStateAction<PlatformSettings>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  languages: Language[];
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  instructors: Instructor[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<PlatformSettings>(mockSettings);
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [languages, setLanguages] = useState<Language[]>(mockLanguages);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);

  const currentRole: Role = currentUser.role === "super_admin" ? "super_admin" : "admin";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const login = (email: string, password: string): boolean => {
    const cred = DEMO_CREDENTIALS[email.toLowerCase()];
    if (!cred || cred.password !== password) return false;
    const user = mockUsers.find((u) => u.id === cred.userId);
    if (!user) return false;
    setCurrentUser(user);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(mockUsers[0]);
  };

  return (
    <AppContext.Provider value={{
      currentRole, currentUser, isLoggedIn, login, logout,
      courses, setCourses, users, setUsers,
      notifications, setNotifications, settings, setSettings,
      skills, setSkills, categories, setCategories,
      languages, setLanguages, badges, setBadges,
      instructors, setInstructors, departments, setDepartments,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
