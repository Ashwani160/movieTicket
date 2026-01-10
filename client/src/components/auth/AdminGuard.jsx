// src/components/auth/AdminGuard.jsx
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useAppContext } from "@/context/AppContext";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  const { isAdmin } = useAppContext();

  return (
    <>
      <SignedOut>
        <div className="flex h-screen items-center justify-center">
          <SignInButton mode="modal">
            <button className="px-6 py-3 rounded-lg bg-black text-white">
              Sign in to access Admin
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {isAdmin ? children : <Navigate to="/" replace />}
      </SignedIn>
    </>
  );
};

export default AdminGuard;
