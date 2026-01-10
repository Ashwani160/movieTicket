import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

import AdminNavbar from "@/components/custom/admin/AdminNavbar.jsx";
import AdminSidebar from "@/components/custom/admin/AdminSidebar";

const Layout = () => {
  const { isAdmin, adminLoading } = useAppContext();

  // ⏳ Still checking admin
  if (adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Checking admin access...</p>
      </div>
    );
  }

  // ❌ Not admin → redirect
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin UI
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <AdminSidebar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
