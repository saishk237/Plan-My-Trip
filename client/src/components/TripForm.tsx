import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import InterestChips from "./InterestChips";
import BudgetSelector from "./BudgetSelector";
import { Loader2 } from "lucide-react";
import type { TripRequest } from "@shared/schema";

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  initialData?: Partial<TripRequest>;
  isLoading?: boolean;
}

export default function TripForm({ onSubmit, initialData, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripRequest>({
    destination: initialData?.destination || "",
    startingLocation: initialData?.startingLocation || "",
    days: initialData?.days || 7,
    budget: initialData?.budget || "Moderate",
    travelType: initialData?.travelType || "Solo",
    interests: initialData?.interests || [],
    pace: initialData?.pace || "Balanced",
    accommodation: initialData?.accommodation || "Hotel",
    transportation: initialData?.transportation || "Public Transport",
    mealPreference: initialData?.mealPreference || "No preference"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Plan Your Perfect Trip</h1>
        <p className="text-muted-foreground">Tell us about your dream destination and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startingLocation" className="text-base font-semibold mb-2 block">
                Starting Location
              </Label>
              <Input
                id="startingLocation"
                type="text"
                placeholder="e.g., New York, London, Mumbai"
                value={formData.startingLocation}
                onChange={(e) => setFormData({ ...formData, startingLocation: e.target.value })}
                required
                className="h-12"
                data-testid="input-starting-location"
              />
            </div>
            <div>
              <Label htmlFor="destination" className="text-base font-semibold mb-2 block">
                Destination
              </Label>
              <Input
                id="destination"
                type="text"
                placeholder="e.g., Paris, Tokyo, Bali"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
                className="h-12"
                data-testid="input-destination"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="days" className="text-base font-semibold mb-2 block">
              Number of Days: {formData.days}
            </Label>
            <Slider
              id="days"
              min={1}
              max={30}
              step={1}
              value={[formData.days]}
              onValueChange={([value]) => setFormData({ ...formData, days: value })}
              className="py-4"
              data-testid="slider-days"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 day</span>
              <span>30 days</span>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Budget</Label>
            <BudgetSelector
              value={formData.budget}
              onChange={(budget) => setFormData({ ...formData, budget: budget as TripRequest['budget'] })}
            />
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Interests</Label>
            <InterestChips
              selected={formData.interests}
              onChange={(interests) => setFormData({ ...formData, interests })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="travelType" className="text-base font-semibold mb-2 block">
                Travel Type
              </Label>
              <Select
                value={formData.travelType}
                onValueChange={(value) => setFormData({ ...formData, travelType: value as TripRequest['travelType'] })}
              >
                <SelectTrigger id="travelType" className="h-12" data-testid="select-travel-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Couple">Couple</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pace" className="text-base font-semibold mb-2 block">
                Pace
              </Label>
              <Select
                value={formData.pace}
                onValueChange={(value) => setFormData({ ...formData, pace: value as TripRequest['pace'] })}
              >
                <SelectTrigger id="pace" className="h-12" data-testid="select-pace">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Packed">Packed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="accommodation" className="text-base font-semibold mb-2 block">
                Accommodation
              </Label>
              <Select
                value={formData.accommodation}
                onValueChange={(value) => setFormData({ ...formData, accommodation: value as TripRequest['accommodation'] })}
              >
                <SelectTrigger id="accommodation" className="h-12" data-testid="select-accommodation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Hostel">Hostel</SelectItem>
                  <SelectItem value="Resort">Resort</SelectItem>
                  <SelectItem value="Homestay">Homestay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transportation" className="text-base font-semibold mb-2 block">
                Transportation
              </Label>
              <Select
                value={formData.transportation}
                onValueChange={(value) => setFormData({ ...formData, transportation: value as TripRequest['transportation'] })}
              >
                <SelectTrigger id="transportation" className="h-12" data-testid="select-transportation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public Transport">Public Transport</SelectItem>
                  <SelectItem value="Rental Car">Rental Car</SelectItem>
                  <SelectItem value="Walk">Walk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="mealPreference" className="text-base font-semibold mb-2 block">
              Meal Preference
            </Label>
            <Select
              value={formData.mealPreference}
              onValueChange={(value) => setFormData({ ...formData, mealPreference: value as TripRequest['mealPreference'] })}
            >
              <SelectTrigger id="mealPreference" className="h-12" data-testid="select-meal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No preference">No Preference</SelectItem>
                <SelectItem value="Veg">Vegetarian</SelectItem>
                <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12"
          disabled={isLoading || !formData.destination || formData.interests.length === 0}
          data-testid="button-generate"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Your Itinerary...
            </>
          ) : (
            "Generate My Itinerary"
          )}
        </Button>
      </form>
    </div>
  );
}
