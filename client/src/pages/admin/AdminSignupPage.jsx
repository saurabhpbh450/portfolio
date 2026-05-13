import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AdminField, AdminInput } from "../../components/admin/FormControls.jsx";

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toastError, toastSuccess } = useToast();

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await signUp(payload);
      toastSuccess("Signup complete.");
      navigate("/admin", { replace: true });
    } catch (error) {
      toastError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-page py-12 sm:py-20">
        <div className="mx-auto max-w-xl card p-6 sm:p-8">
          <div className="text-xs font-semibold text-secondaryText">Create admin account candidate</div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Admin Sign Up
          </h1>
          <p className="mt-3 text-sm text-secondaryText">
            user sign up
          </p>

          <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
            <AdminField label="Name">
              <AdminInput
                placeholder="Saurabh Mishra"
                value={payload.name}
                onChange={(event) =>
                  setPayload((current) => ({ ...current, name: event.target.value }))
                }
              />
            </AdminField>

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

            <AdminField label="Password" hint="Minimum 8 characters">
              <AdminInput
                type="password"
                autoComplete="new-password"
                placeholder="Strong password"
                value={payload.password}
                onChange={(event) =>
                  setPayload((current) => ({ ...current, password: event.target.value }))
                }
              />
            </AdminField>

            <button className="btn-primary justify-center" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-secondaryText ring-1 ring-white/10">
            Already have an account? <Link to="/admin" className="text-goldLight hover:underline">Sign in</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
