import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const travelTips = [
  "Planning the perfect adventure for you...",
  "Finding hidden gems and local favorites...",
  "Optimizing your daily schedule...",
  "Selecting the best experiences for your interests...",
  "Creating unforgettable memories..."
];

export default function LoadingState() {
  const randomTip = travelTips[Math.floor(Math.random() * travelTips.length)];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="p-12 text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold mb-3">Crafting Your Itinerary</h2>
        <p className="text-muted-foreground">{randomTip}</p>
      </Card>
    </div>
  );
}
