import { z } from "zod";

export const tripRequestSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  days: z.number().min(1).max(30),
  budget: z.enum(["Low", "Moderate", "Luxury"]),
  travelType: z.enum(["Solo", "Couple", "Family", "Group"]),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  pace: z.enum(["Relaxed", "Balanced", "Packed"]),
  accommodation: z.enum(["Hotel", "Hostel", "Resort", "Homestay"]),
  transportation: z.enum(["Public Transport", "Rental Car", "Walk"]),
  mealPreference: z.enum(["Veg", "Non-Veg", "Vegan"])
});

export type TripRequest = z.infer<typeof tripRequestSchema>;

export const activitySchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["activity", "meal", "rest"])
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
