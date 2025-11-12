import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import Home from "@/pages/Home";
import Plan from "@/pages/Plan";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plan" component={Plan} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for existing auth token on app load
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user-data");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', checkAuth);

    // Listen for custom auth event (for same-tab updates)
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user-data", JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");
    setUser(null);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    // Redirect to homepage
    setLocation("/");
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="tripcraft-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="fixed top-4 right-4 z-50">
            <UserMenu 
              user={user} 
              onLogin={() => setShowAuthModal(true)}
              onLogout={handleLogout}
            />
          </div>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
