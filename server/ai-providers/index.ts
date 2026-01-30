import { type TripRequest } from "@shared/schema";
import { generateItineraryWithGroq } from "./groq";
import { generateItineraryWithGemini } from "./gemini";

export type AIProvider = "groq" | "gemini" | "auto";

/**
 * Generate itinerary using the specified AI provider with automatic failover
 * 
 * @param request - Trip request parameters
 * @param provider - AI provider to use ("groq", "gemini", or "auto" for automatic selection)
 * @returns Generated itinerary
 */
export async function generateItinerary(
  request: TripRequest,
  provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || "auto"
) {
  console.log(`🤖 AI Provider requested: ${provider}`);

  // Auto mode: try providers in order based on availability
  if (provider === "auto") {
    const providers: Array<{ name: string; fn: typeof generateItineraryWithGroq; key: string }> = [];
    
    // Check which providers are configured
    if (process.env.GEMINI_API_KEY) {
      providers.push({ name: "gemini", fn: generateItineraryWithGemini, key: "GEMINI_API_KEY" });
    }
    if (process.env.GROQ_API_KEY) {
      providers.push({ name: "groq", fn: generateItineraryWithGroq, key: "GROQ_API_KEY" });
    }

    if (providers.length === 0) {
      throw new Error("No AI provider configured. Please set GEMINI_API_KEY or GROQ_API_KEY environment variable.");
    }

    console.log(`🔄 Auto mode: Available providers: ${providers.map(p => p.name).join(", ")}`);

    // Try each provider in order
    let lastError: Error | null = null;
    for (const { name, fn } of providers) {
      try {
        console.log(`🚀 Trying provider: ${name}`);
        const result = await fn(request);
        console.log(`✅ Success with provider: ${name}`);
        return result;
      } catch (error) {
        console.error(`❌ Provider ${name} failed:`, error instanceof Error ? error.message : error);
        lastError = error as Error;
        // Continue to next provider
      }
    }

    // All providers failed
    throw new Error(
      `All AI providers failed. Last error: ${lastError?.message || "Unknown error"}`
    );
  }

  // Specific provider requested
  switch (provider) {
    case "gemini":
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }
      console.log("🚀 Using Gemini AI");
      return generateItineraryWithGemini(request);

    case "groq":
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY environment variable is not set");
      }
      console.log("🚀 Using Groq AI");
      return generateItineraryWithGroq(request);

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

/**
 * Get the current AI provider configuration
 */
export function getAIProviderInfo() {
  const configured = [];
  
  if (process.env.GEMINI_API_KEY) {
    configured.push("gemini");
  }
  if (process.env.GROQ_API_KEY) {
    configured.push("groq");
  }

  const selected = (process.env.AI_PROVIDER as AIProvider) || "auto";

  return {
    selected,
    configured,
    available: configured.length > 0,
  };
}

