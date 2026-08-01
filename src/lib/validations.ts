import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"], { required_error: "Choose a role" }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const bookingSchema = z.object({
  scheduledAt: z.string().min(1, "Pick a date and time"),
  address: z.string().min(5, "Enter a full address (min 5 characters)"),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, "Pick a star rating").max(5),
  comment: z.string().max(500, "Keep it under 500 characters").optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Choose a category"),
  location: z.string().optional(),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  experience: z.coerce.number().int().min(0, "Cannot be negative").optional(),
  location: z.string().optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(200).optional(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  isAvailable: z.boolean().default(true),
});
export const availabilitySchema = z.object({
  slots: z.array(availabilitySlotSchema).min(1, "Add at least one time slot"),
});
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
