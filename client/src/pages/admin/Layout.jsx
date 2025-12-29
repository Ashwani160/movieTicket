import React from 'react';
import AdminNavbar from '@/components/custom/admin/AdminNavbar.jsx';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/custom/admin/AdminSidebar';

const Layout = () => {
  return (
    // Removed bg-gray-900 so it doesn't force a background color
    <div className="min-h-screen">
        {/* Fixed Navbar at the top */}
        <AdminNavbar />

        {/* Fixed Sidebar on the left */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="p-4 sm:ml-64">
           <div className="p-4 mt-14">
              <Outlet />
           </div>
        </div>
    </div>
  );
}

export default Layout;