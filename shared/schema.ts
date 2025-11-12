import { z } from "zod";
import { pgTable, varchar, timestamp, text, integer } from "drizzle-orm/pg-core";

export const tripRequestSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  days: z.number().min(1).max(30),
  budget: z.enum(["Low", "Moderate", "Luxury"]),
  travelType: z.enum(["Solo", "Couple", "Family", "Group"]),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  pace: z.enum(["Relaxed", "Balanced", "Packed"]),
  accommodation: z.enum(["Hotel", "Hostel", "Resort", "Homestay"]),
  transportation: z.enum(["Public Transport", "Rental Car", "Walk"]),
  mealPreference: z.enum(["Veg", "Non-Veg", "No preference"]),
  startingLocation: z.string().min(1, "Starting location is required")
});

export type TripRequest = z.infer<typeof tripRequestSchema>;

export const activitySchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  details: z.string().optional()
});

export const dayPlanSchema = z.object({
  day: z.number(),
  title: z.string(),
  activities: z.array(activitySchema)
});

export const itinerarySchema = z.object({
  title: z.string(),
  destination: z.string(),
  duration: z.string(),
  budget: z.string(),
  travelType: z.string(),
  days: z.array(dayPlanSchema),
  highlights: z.array(z.string())
});

export type Activity = z.infer<typeof activitySchema>;
export type DayPlan = z.infer<typeof dayPlanSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;

// Database Tables
export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  name: varchar('name').notNull(),
  username: varchar('username').notNull().unique(),
  passwordHash: varchar('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const savedItineraries = pgTable('saved_itineraries', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').references(() => users.id),
  title: varchar('title').notNull(),
  destination: varchar('destination').notNull(),
  startingLocation: varchar('starting_location').notNull(),
  duration: varchar('duration').notNull(),
  budget: varchar('budget').notNull(),
  travelType: varchar('travel_type').notNull(),
  itineraryData: text('itinerary_data').notNull(), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
});

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SignupRequest = z.infer<typeof signupSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
