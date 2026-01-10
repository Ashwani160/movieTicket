import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // ✅ ADMIN CHECK
  const fetchIsAdmin = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    try {
      setAdminLoading(true);
      const token = await getToken();

      await axios.get("/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // SUCCESS = ADMIN
      setIsAdmin(true);
    } catch (error) {
      // ERROR = NOT ADMIN
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  // ✅ FETCH SHOWS
  const fetchShows = async () => {
    try {
      const res = await axios.get("/shows/all");
      if (res.data.success) {
        setShows(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching shows:", err);
    }
  };

  // ✅ FETCH FAVORITES
  const fetchFavoriteMovies = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      const res = await axios.get("/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFavoriteMovies(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching favorite movies:", err);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user]);

  const value = {
    axios,
    user,
    getToken,

    isAdmin,
    adminLoading,

    shows,
    favoriteMovies,

    fetchIsAdmin,
    fetchFavoriteMovies,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
