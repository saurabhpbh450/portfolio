import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AdminField, AdminInput } from "../../components/admin/FormControls.jsx";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toastError, toastInfo, toastSuccess } = useToast();

  const [payload, setPayload] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await signIn(payload);
      if (response.user?.role === "admin") {
        toastSuccess("Welcome back. Redirecting to dashboard...");
        navigate("/admin/dashboard", { replace: true });
      } else {
        toastInfo("Logged in successfully, but only admin can access dashboard you are currently user.");
      }
    } catch (error) {
      toastError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-page py-12 sm:py-20">
        <div className="mx-auto max-w-xl card p-6 sm:p-8">
          <div className="text-xs font-semibold text-secondaryText">Hidden admin panel</div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Admin Sign In
          </h1>
          <p className="mt-3 text-sm text-secondaryText">
            Sign in with your account. Dashboard access is allowed only to admin.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
            <AdminField label="Email">
              <AdminInput
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={payload.email}
                onChange={(event) =>
                  setPayload((current) => ({ ...current, email: event.target.value }))
                }
              />
            </AdminField>

            <AdminField label="Password">
              <AdminInput
                type="password"
                autoComplete="current-password"
                placeholder="At least 8 characters"
                value={payload.password}
                onChange={(event) =>
                  setPayload((current) => ({ ...current, password: event.target.value }))
                }
              />
            </AdminField>

            <button className="btn-primary justify-center" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-secondaryText ring-1 ring-white/10">
            No account yet? <Link to="/admin/signup" className="text-goldLight hover:underline">Create one</Link>.
            
          </div>
        </div>
      </div>
    </div>
  );
}
