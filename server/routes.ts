import type { Express } from "express";
import { createServer, type Server } from "http";
import { tripRequestSchema } from "@shared/schema";
import { generateItinerary } from "./openai";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/itinerary", async (req, res) => {
    try {
      const validatedData = tripRequestSchema.parse(req.body);
      
      const itinerary = await generateItinerary(validatedData);
      
      res.json(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Invalid request data",
          details: error.errors
        });
      } else if (error instanceof Error) {
        if (error.message.includes("AI generated invalid") || error.message.includes("No response from OpenAI")) {
          res.status(502).json({ 
            error: "AI service error. Please try again.",
            message: error.message
          });
        } else {
          res.status(500).json({ 
            error: "Server error. Please try again later.",
            message: error.message
          });
        }
      } else {
        res.status(500).json({ 
          error: "An unexpected error occurred" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
