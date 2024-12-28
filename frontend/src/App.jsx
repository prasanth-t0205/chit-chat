import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./hooks/useTheme";
import { useChat } from "./hooks/useChat";
import SearchPage from "./pages/SearchPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();
  const { theme } = useTheme();
  const { selectedUser } = useChat();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    checkAuth();
    document.documentElement.setAttribute("data-theme", theme);
  }, [checkAuth, theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowMargin =
    authUser &&
    (!selectedUser || !isMobile || selectedUser._id === authUser._id);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <main className={shouldShowMargin ? "ml-[55px]" : ""}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={authUser ? <SearchPage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster />
      </main>
    </div>
  );
};

export default App;
