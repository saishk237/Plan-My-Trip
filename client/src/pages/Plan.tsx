import { useState } from "react";
import { useLocation } from "wouter";
import TripForm from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import LoadingState from "@/components/LoadingState";
import { generateItineraryPDF } from "@/lib/pdfGenerator";
import type { TripRequest, Itinerary } from "@shared/schema";

export default function Plan() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [formData, setFormData] = useState<TripRequest | null>(null);

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
      generateItineraryPDF(itinerary);
    }
  };

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
        isRegenerating={isLoading}
      />
    );
  }

  return <TripForm onSubmit={handleFormSubmit} initialData={formData || undefined} isLoading={isLoading} />;
}
