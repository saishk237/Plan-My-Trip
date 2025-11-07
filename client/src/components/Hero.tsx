import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroImage from "@assets/images/Cappadocia_hot_air_balloons_sunrise.png";

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Your Perfect Journey,
          <br />
          Crafted by AI
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          From bucket-list destinations to hidden gems, create personalized day-by-day itineraries tailored to your style, budget, and interests.
        </p>
        
        <Button
          size="lg"
          className="px-8 py-6 text-lg bg-primary/90 backdrop-blur-md border border-primary-border hover-elevate active-elevate-2"
          onClick={() => setLocation("/plan")}
          data-testid="button-plan-trip"
        >
          Plan My Trip
        </Button>
        
        <p className="mt-6 text-sm text-white/70">
          Powered by AI • Thousands of trips planned
        </p>
      </div>
    </section>
  );
}
