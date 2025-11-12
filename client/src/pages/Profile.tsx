import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePDF } from "@/lib/pdfGenerator";
import { 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Download,
  Eye,
  ArrowLeft
} from "lucide-react";
import type { Itinerary } from "@shared/schema";

interface SavedItinerary {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startingLocation: string;
  duration: string;
  budget: string;
  travelType: string;
  itineraryData: Itinerary;
  createdAt: string;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<SavedItinerary | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user-data");
    if (!userData) {
      setLocation("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch saved itineraries
    fetchSavedItineraries(parsedUser.id);
  }, []);

  const fetchSavedItineraries = async (userId: string) => {
    try {
      const response = await fetch(`/api/itinerary/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedItineraries(data);
      }
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = (itinerary: Itinerary) => {
    generatePDF(itinerary);
  };

  const handleViewItinerary = (saved: SavedItinerary) => {
    setSelectedItinerary(saved);
  };

  const handleBackToList = () => {
    setSelectedItinerary(null);
  };

  if (!user) {
    return null;
  }

  // Show full itinerary view
  if (selectedItinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            onClick={handleBackToList}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Saved Itineraries
          </Button>

          <Card className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {selectedItinerary.itineraryData.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedItinerary.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedItinerary.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {selectedItinerary.budget}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedItinerary.travelType}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleDownloadPDF(selectedItinerary.itineraryData)}
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Trip Highlights */}
            {selectedItinerary.itineraryData.highlights && selectedItinerary.itineraryData.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Trip Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedItinerary.itineraryData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Detailed Itinerary</h2>
              {selectedItinerary.itineraryData.days.map((day) => (
                <Card key={day.day} className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Day {day.day}</h3>
                      <p className="text-muted-foreground">{day.title}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex gap-4 border-l-2 border-primary/30 pl-4">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="font-mono">
                            {activity.time}
                          </Badge>
                        </div>

                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{activity.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {activity.description}
                          </p>
                          {activity.details && (
                            <div className="bg-muted/30 p-3 rounded-md border-l-4 border-primary/30">
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                <strong>More Details:</strong> {activity.details}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show profile overview and saved itineraries list
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* User Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge variant="secondary" className="text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {savedItineraries.length} Saved Itineraries
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Itineraries Section */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Itineraries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : savedItineraries.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No saved itineraries yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your trips and save them here!
                </p>
                <Button onClick={() => setLocation("/plan")}>
                  Plan a Trip
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedItineraries.map((itinerary) => (
                  <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {itinerary.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{itinerary.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{itinerary.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>{itinerary.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{itinerary.travelType}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewItinerary(itinerary)}
                          variant="default"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDownloadPDF(itinerary.itineraryData)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Saved on {new Date(itinerary.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
