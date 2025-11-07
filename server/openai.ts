import OpenAI from "openai";
import { type TripRequest, itinerarySchema } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateItinerary(request: TripRequest) {
  const prompt = createPrompt(request);

  const completion = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a travel planner. Create a JSON itinerary. Return ONLY valid JSON, no other text.

Structure:
{
  "title": "Trip Name",
  "destination": "Location",
  "duration": "X Days", 
  "budget": "Budget Level",
  "travelType": "Travel Type",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"],
  "days": [
    {
      "day": 1,
      "title": "Day Theme",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Activity Name", 
          "description": "Activity description",
          "type": "activity"
        }
      ]
    }
  ]
}

RULES:
- Use "activity" for sightseeing, tours, shopping, entertainment
- Use "meal" for breakfast, lunch, dinner, food
- Use "rest" for hotel, sleep, travel time
- Keep JSON simple and valid
- No special characters in strings`
      },
      {
        role: "user", 
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Groq");
  }

  const parsed = JSON.parse(content);
  const validation = itinerarySchema.safeParse(parsed);
  
  if (!validation.success) {
    console.error("Invalid itinerary format from AI:", validation.error);
    throw new Error("AI generated invalid itinerary format");
  }

  return validation.data;
}

function createPrompt(request: TripRequest): string {
  return `Create a ${request.days}-day travel itinerary for ${request.destination}.

Trip Details:
- Budget: ${request.budget}
- Travel Type: ${request.travelType}
- Interests: ${request.interests.join(", ")}
- Pace: ${request.pace}
- Accommodation: ${request.accommodation}
- Transportation: ${request.transportation}
- Meal Preference: ${request.mealPreference}

Requirements:
- Create ${request.days} days of activities
- Include ${request.pace === "Packed" ? "5-7" : request.pace === "Balanced" ? "4-5" : "3-4"} activities per day
- Focus heavily on: ${request.interests.join(", ")}
- All meals should be ${request.mealPreference}
- Suggest ${request.accommodation} style accommodations
- Plan around ${request.transportation} transportation
- Match the ${request.budget} budget level
- Include breakfast, lunch, and dinner recommendations
- Add specific times for each activity
- Make it perfect for ${request.travelType} travelers

Generate a creative trip title and list 4-6 key highlights.`;
}
