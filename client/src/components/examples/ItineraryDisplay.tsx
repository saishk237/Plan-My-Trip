import ItineraryDisplay from '../ItineraryDisplay';

export default function ItineraryDisplayExample() {
  const mockItinerary = {
    title: "Tokyo Adventure: Culture & Cuisine",
    destination: "Tokyo, Japan",
    duration: "5 Days",
    budget: "Moderate",
    travelType: "Couple",
    highlights: ["Cherry Blossoms", "Sushi Master Class", "Ancient Temples", "Modern Architecture"],
    days: [
      {
        day: 1,
        title: "Arrival & Shibuya Exploration",
        activities: [
          {
            time: "10:00 AM",
            title: "Arrive at Haneda Airport",
            description: "Clear customs and take the monorail to central Tokyo. Check into your hotel in Shibuya.",
            type: "activity" as const
          },
          {
            time: "1:00 PM",
            title: "Lunch at Ichiran Ramen",
            description: "Experience authentic tonkotsu ramen at this famous chain known for individual booths.",
            type: "meal" as const
          },
          {
            time: "3:00 PM",
            title: "Shibuya Crossing & Shopping",
            description: "Visit the world's busiest intersection, explore Shibuya 109, and climb to the observation deck.",
            type: "activity" as const
          },
          {
            time: "7:00 PM",
            title: "Dinner in Harajuku",
            description: "Explore trendy restaurants and cafes in the Harajuku district.",
            type: "meal" as const
          }
        ]
      },
      {
        day: 2,
        title: "Traditional Tokyo",
        activities: [
          {
            time: "8:00 AM",
            title: "Tsukiji Outer Market",
            description: "Browse fresh seafood, street food, and kitchenware at this historic market.",
            type: "activity" as const
          },
          {
            time: "11:00 AM",
            title: "Senso-ji Temple",
            description: "Visit Tokyo's oldest temple in Asakusa, walk through Nakamise shopping street.",
            type: "activity" as const
          },
          {
            time: "1:00 PM",
            title: "Traditional Japanese Lunch",
            description: "Enjoy tempura or unagi near the temple district.",
            type: "meal" as const
          }
        ]
      }
    ]
  };

  const handleRegenerate = () => console.log('Regenerate clicked');
  const handleEdit = () => console.log('Edit clicked');
  const handleDownload = () => console.log('Download clicked');

  return (
    <ItineraryDisplay 
      itinerary={mockItinerary}
      onRegenerate={handleRegenerate}
      onEdit={handleEdit}
      onDownload={handleDownload}
    />
  );
}
