import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedAdminRoute() {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="container-page py-20 text-sm text-secondaryText">Checking session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="container-page py-20">
          <div className="card p-8">
            <h1 className="text-2xl font-extrabold text-white">Access denied</h1>
            <p className="mt-3 text-secondaryText">
              You are signed in, but this dashboard is available only for admin role.
              Update role manually in MongoDB if this account should be admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
