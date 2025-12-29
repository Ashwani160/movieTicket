import { assets } from '@/assets/assets.js';
import React from 'react';
import { NavLink } from 'react-router-dom';

// Icons ... (Keeping your existing icons object)
const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ),
  add: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
  ),
  list: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ),
  ticket: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
  )
};

const adminMenu = [
  { path: "/admin", label: "Dashboard", icon: icons.dashboard, end: true },
  { path: "/admin/add-shows", label: "Add Shows", icon: icons.add },
  { path: "/admin/list-shows", label: "List Shows", icon: icons.list },
  { path: "/admin/list-bookings", label: "List Bookings", icon: icons.ticket },
];

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastname: "User",
    imageUrl: assets.profile
  };

  return (
    <aside 
      id="logo-sidebar" 
      className="fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform -translate-x-full bg-gray-900 border-r border-gray-700 sm:translate-x-0" 
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-900 flex flex-col">
        
        {/* --- User Profile Section --- */}
        <div className="flex items-center p-4 mb-6 rounded-xl bg-gray-800/50 border border-gray-700">
           <img 
            src={user.imageUrl} 
            alt="Admin Profile" 
            className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover"
           />
           <div className="ms-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-xs text-pink-500 font-medium">Administrator</p>
           </div>
        </div>

        <ul className="space-y-2 font-medium flex-1">
          {adminMenu.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                end={item.end} 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg group transition-colors duration-200 ${
                    isActive 
                      ? "bg-pink-900/20 text-pink-500" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white" 
                  }`
                }
              >
                <span className="flex-shrink-0 transition duration-75">
                  {item.icon}
                </span>
                <span className="ms-3">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        {/* Logout Button */}
        <div className="mt-auto pb-4">
           <button className="flex items-center p-3 w-full text-gray-300 rounded-lg hover:bg-gray-800 hover:text-red-400 group transition-colors duration-200">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap text-left">Sign Out</span>
           </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;