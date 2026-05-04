import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useApp, DEMO_CREDENTIALS } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a brief async call
    setTimeout(() => {
      const success = login(email.trim(), password);
      setLoading(false);
      if (success) {
        // navigate based on role — login() sets currentUser, but we need to know the role
        const cred = DEMO_CREDENTIALS[email.trim().toLowerCase()];
        const isSA = cred?.userId === "u1";
        navigate(isSA ? "/sa/overview" : "/admin/overview", { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 600);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12103a] via-[#1e1a4a] to-[#0f0d2e] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Edge Edu</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel — Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@onedge.co"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                autoFocus
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full justify-center py-2.5 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demo accounts</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemo("sarah@onedge.co")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">SJ</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-400">sarah@onedge.co · Super Admin</p>
                </div>
                <span className="badge bg-brand-100 text-brand-700 text-xs shrink-0">SA</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("ahmed@onedge.co")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">AK</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Ahmed Khan</p>
                  <p className="text-xs text-gray-400">ahmed@onedge.co · Admin · Healthcare</p>
                </div>
                <span className="badge bg-blue-100 text-blue-700 text-xs shrink-0">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("priya@onedge.co")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">PS</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Priya Sharma</p>
                  <p className="text-xs text-gray-400">priya@onedge.co · Admin · AI & Tech</p>
                </div>
                <span className="badge bg-blue-100 text-blue-700 text-xs shrink-0">Admin</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Password for all accounts: <span className="font-mono font-semibold text-gray-600">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
