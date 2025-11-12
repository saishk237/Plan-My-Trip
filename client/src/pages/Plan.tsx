import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import TripForm from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import LoadingState from "@/components/LoadingState";
import { generatePDF } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import type { TripRequest, Itinerary } from "@shared/schema";

export default function Plan() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [formData, setFormData] = useState<TripRequest | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");
      
      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for auth changes
    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleAuthSuccess = (userData: any, token: string) => {
    localStorage.setItem("user-data", JSON.stringify(userData));
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleFormSubmit = async (data: TripRequest) => {
    setFormData(data);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate itinerary');
      }

      const generatedItinerary = await response.json();
      setItinerary(generatedItinerary);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (formData) {
      handleFormSubmit(formData);
    }
  };

  const handleEdit = () => {
    setItinerary(null);
  };

  const handleDownload = () => {
    if (itinerary) {
      generatePDF(itinerary);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;

    setIsSaving(true);
    try {
      const userData = localStorage.getItem("user-data");
      if (!userData) {
        toast({
          title: "Not logged in",
          description: "Please log in to save itineraries",
          variant: "destructive",
        });
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch("/api/itinerary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          itinerary,
          startingLocation: formData?.startingLocation || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save itinerary");
      }

      toast({
        title: "Success!",
        description: "Itinerary saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show authentication required message if not logged in
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground mb-6">
                Please log in to access the trip planning feature.
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (itinerary) {
    return (
      <ItineraryDisplay
        itinerary={itinerary}
        onRegenerate={handleRegenerate}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onSave={handleSave}
        isRegenerating={isLoading}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <TripForm onSubmit={handleFormSubmit} initialData={formData || undefined} isLoading={isLoading} />
      </div>
    </div>
  );
}
