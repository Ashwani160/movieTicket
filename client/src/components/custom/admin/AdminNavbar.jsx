import React from 'react';
import { assets } from "@/assets/assets.js";
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    // Maintained dark background for the navbar itself so it's visible
    <nav className="bg-gray-900 border-b border-gray-700 fixed w-full z-30 top-0 left-0 h-16 text-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            {/* Mobile Sidebar Toggle Button */}
            <button 
              data-drawer-target="logo-sidebar" 
              data-drawer-toggle="logo-sidebar" 
              aria-controls="logo-sidebar" 
              type="button" 
              className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                 <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5A.75.75 0 012.75 14h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14.75z"></path>
              </svg>
            </button>
            
            {/* Logo Section */}
            <Link to="/admin" className="flex ms-2 md:me-24">
              <img src={assets.logo} className="h-8 me-3" alt="Admin Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Right Side User Menu */}
          <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold cursor-pointer border border-gray-600">
                  A
                </div>
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;