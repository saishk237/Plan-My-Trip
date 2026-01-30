import { GoogleGenerativeAI } from "@google/generative-ai";
import { type TripRequest, itinerarySchema } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateItineraryWithGemini(request: TripRequest) {
  // Try up to 2 times if JSON parsing fails
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.1,
        }
      });

      const systemPrompt = `You are a travel itinerary generator. You MUST respond with ONLY valid JSON, no other text before or after.

Create a travel itinerary in JSON format. Return ONLY valid JSON.

Example format:
{
  "title": "Amazing Trip",
  "destination": "Paris",
  "duration": "3 Days",
  "budget": "Moderate", 
  "travelType": "Solo",
  "highlights": ["Eiffel Tower", "Louvre Museum", "Seine River", "Local Cuisine"],
  "days": [
    {
      "day": 1,
      "title": "Arrival Day",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Hotel Check-in",
          "description": "Check into hotel and rest",
          "type": "accommodation",
          "details": "Upon arrival, complete check-in procedures and take time to freshen up. Most hotels offer early check-in if rooms are available. Use this time to familiarize yourself with hotel amenities and plan your day."
        },
        {
          "time": "12:00 PM", 
          "title": "Lunch at Cafe",
          "description": "Try local food",
          "type": "lunch",
          "details": "Experience authentic local cuisine at a popular neighborhood cafe. Ask for recommendations from locals or hotel staff. This is a great opportunity to try regional specialties and get a taste of the local food culture."
        },
        {
          "time": "2:00 PM",
          "title": "City Walk",
          "description": "Explore the city center", 
          "type": "sightseeing",
          "details": "Take a leisurely walking tour through the historic city center. Look for architectural highlights, street art, and local shops. Bring comfortable walking shoes and a camera. Consider joining a free walking tour or using a self-guided tour app."
        }
      ]
    }
  ]
}

CRITICAL JSON FORMATTING RULES:
1. ALL strings MUST be in double quotes (") - NEVER use single quotes or backticks
2. ALL time values MUST be quoted strings: "9:00 AM" NOT 9:00 AM
3. NO apostrophes (') in any text - use straight quotes only
4. NO line breaks (\n) inside string values
5. NO special characters or escape sequences in strings
6. ALL property names must be in double quotes
7. Use simple, clean text without formatting

CONTENT RULES:
- Use descriptive types: "sightseeing", "adventure", "culture", "breakfast", "lunch", "dinner", "hotel", "transport"
- Each activity MUST include a "details" field with 2-3 sentences
- Keep all text simple and avoid apostrophes (use "do not" instead of "don't")
- Make descriptions informative but concise

VALIDATION:
- Your response must be valid JSON that can be parsed by JSON.parse()
- Test each string value - it must not contain unescaped quotes or special characters`;

      const userPrompt = `Create a ${request.days}-day itinerary from ${request.startingLocation} to ${request.destination}. 
        
Budget: ${request.budget}
Travel type: ${request.travelType}  
Starting location: ${request.startingLocation}
Destination: ${request.destination}
User is interested in: ${request.interests.join(", ")} activities
Pace: Include ${request.pace === "Packed" ? "many" : request.pace === "Balanced" ? "moderate" : "few"} activities per day
Meal preference: ${request.mealPreference === "No preference" ? "Include both vegetarian and non-vegetarian options without specifying restaurant type" : `Focus on ${request.mealPreference} restaurants and food`}

For the "type" field, use natural, descriptive categories like:
- Sightseeing: "sightseeing", "temple", "museum", "landmark"
- Adventure: "adventure", "hiking", "water-sports", "trekking"
- Culture: "culture", "art", "history", "local-experience"
- Food: "breakfast", "lunch", "dinner", "street-food", "cooking-class"
- Shopping: "shopping", "market", "souvenirs"
- Relaxation: "spa", "beach", "relaxation", "wellness"
- Accommodation: "hotel", "check-in", "check-out"
- Transport: "transport", "travel", "transfer"

Focus heavily on the user's interests: ${request.interests.join(", ")}. 

IMPORTANT: 
- Day 1 must start from ${request.startingLocation} with travel arrangements to ${request.destination}
- Include travel time and transportation details from starting location
- Create a natural flow of activities, meals, and rest periods
- Add detailed descriptions for each activity explaining what makes it special and what to expect`;

      const result = await model.generateContent([systemPrompt, userPrompt]);
      const response = result.response;
      let content = response.text();

      if (!content) {
        throw new Error("No response from Gemini");
      }

      // Clean up the response - remove markdown code blocks if present
      content = content.trim();
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      // Try to parse the JSON
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error(`Attempt ${attempt}: JSON parse error:`, parseError);
        console.error("Raw content:", content);
        lastError = new Error("Failed to parse AI response as JSON");
        continue; // Try again
      }

      // Validate against schema
      const validation = itinerarySchema.safeParse(parsed);
      
      if (!validation.success) {
        console.error(`Attempt ${attempt}: Schema validation failed:`, validation.error);
        lastError = new Error("AI generated invalid itinerary format");
        continue; // Try again
      }

      // Success! Return the validated data
      return validation.data;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error as Error;
      
      // If it's a Gemini API error (not our validation error), don't retry
      if (error instanceof Error && (
        error.message.includes("API key") || 
        error.message.includes("quota") ||
        error.message.includes("permission")
      )) {
        throw error;
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error("Failed to generate itinerary after multiple attempts");
}

