import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Clock, Download, RefreshCw, Edit, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Itinerary } from "@shared/schema";

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onSave?: () => void;
  isRegenerating?: boolean;
  isSaving?: boolean;
}

export default function ItineraryDisplay({
  itinerary,
  onRegenerate,
  onEdit,
  onDownload,
  onSave,
  isRegenerating,
  isSaving
}: ItineraryDisplayProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <Utensils className="w-4 h-4" />;
      case "activity":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-itinerary-title">
          {itinerary.title}
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Destination</p>
            <p className="font-semibold" data-testid="text-destination">{itinerary.destination}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="font-semibold">{itinerary.duration}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Budget</p>
            <p className="font-semibold">{itinerary.budget}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Travel Type</p>
            <p className="font-semibold">{itinerary.travelType}</p>
          </Card>
        </div>

        {itinerary.highlights && itinerary.highlights.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="font-semibold mb-3">Trip Highlights</h2>
            <div className="flex flex-wrap gap-2">
              {itinerary.highlights.map((highlight, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {highlight}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Button
            onClick={onRegenerate}
            variant="default"
            disabled={isRegenerating}
            data-testid="button-regenerate"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Itinerary
              </>
            )}
          </Button>
          <Button onClick={onEdit} variant="secondary" data-testid="button-edit">
            <Edit className="w-4 h-4 mr-2" />
            Edit Preferences
          </Button>
          <Button onClick={onSave} variant="secondary" disabled={isSaving} data-testid="button-save">
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Itinerary
              </>
            )}
          </Button>
          <Button onClick={onDownload} variant="secondary" data-testid="button-download">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <Card key={day.day} className="p-6 md:p-8" data-testid={`card-day-${day.day}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                {day.day}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{day.title}</h3>
                <p className="text-sm text-muted-foreground">Day {day.day}</p>
              </div>
            </div>

            <div className="space-y-4">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="flex gap-4" data-testid={`activity-${day.day}-${idx}`}>
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="px-3 py-1 text-xs whitespace-nowrap">
                      {activity.time}
                    </Badge>
                    <div className="w-px h-full bg-border" />
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getActivityIcon(activity.type)}
                      <h4 className="font-semibold">{activity.title}</h4>
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
    </div>
  );
}
