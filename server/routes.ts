import type { Express } from "express";
import { createServer, type Server } from "http";
import { tripRequestSchema, signupSchema, loginSchema } from "@shared/schema";
import { generateItinerary } from "./openai";
import { createUser, authenticateUser, verifyToken } from "./auth";
import { initializeDatabase, db } from "./database";
import { savedItineraries } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database
  await initializeDatabase();

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const user = await createUser(validatedData);
      
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Invalid input data",
          details: error.errors
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          error: error.message
        });
      } else {
        res.status(500).json({
          error: "Internal server error"
        });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, token } = await authenticateUser(validatedData);
      
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Invalid input data",
          details: error.errors
        });
      } else if (error instanceof Error) {
        res.status(401).json({
          error: error.message
        });
      } else {
        res.status(500).json({
          error: "Internal server error"
        });
      }
    }
  });

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

  // Save itinerary
  app.post("/api/itinerary/save", async (req, res) => {
    try {
      const { userId, itinerary, startingLocation } = req.body;

      if (!userId || !itinerary) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const savedItinerary = {
        id: randomUUID(),
        userId,
        title: itinerary.title,
        destination: itinerary.destination,
        startingLocation: startingLocation || "",
        duration: itinerary.duration,
        budget: itinerary.budget,
        travelType: itinerary.travelType,
        itineraryData: JSON.stringify(itinerary),
      };

      await db.insert(savedItineraries).values(savedItinerary);

      res.status(201).json({
        message: "Itinerary saved successfully",
        id: savedItinerary.id
      });
    } catch (error) {
      console.error("Error saving itinerary:", error);
      res.status(500).json({ error: "Failed to save itinerary" });
    }
  });

  // Get user's saved itineraries
  app.get("/api/itinerary/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const userItineraries = await db
        .select()
        .from(savedItineraries)
        .where(eq(savedItineraries.userId, userId));

      const parsedItineraries = userItineraries.map(item => ({
        ...item,
        itineraryData: JSON.parse(item.itineraryData),
      }));

      res.json(parsedItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      res.status(500).json({ error: "Failed to fetch itineraries" });
    }
  });

  // Get single itinerary
  app.get("/api/itinerary/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [itinerary] = await db
        .select()
        .from(savedItineraries)
        .where(eq(savedItineraries.id, id));

      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }

      res.json({
        ...itinerary,
        itineraryData: JSON.parse(itinerary.itineraryData),
      });
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
