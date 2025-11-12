import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import Hero from "@/components/Hero";

interface User {
  id: string;
  email: string;
  username: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing auth token on page load
    const token = localStorage.getItem("auth-token");
    const userData = localStorage.getItem("user-data");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-data");
      }
    }
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user-data", JSON.stringify(userData));
    setShowAuthModal(false);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Get personalized itineraries powered by AI, tailored to your interests and budget.
          </p>
          
          {user ? (
            <Link href="/plan">
              <Button size="lg" className="text-lg px-8 py-4" data-testid="button-plan-trip">
                Plan My Trip
              </Button>
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Please login or create an account to start planning your trip
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-4" 
                onClick={() => setShowAuthModal(true)}
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}