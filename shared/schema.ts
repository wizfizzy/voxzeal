import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3B82F6"),
  textColor: text("text_color").notNull().default("#FFFFFF"),
  bgColor: text("bg_color").notNull().default("#EBF5FF"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  color: true,
  textColor: true,
  bgColor: true,
});

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  address: true,
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  priceUnit: text("price_unit").notNull().default("per person"),
  totalSpots: integer("total_spots").notNull(),
  availableSpots: integer("available_spots").notNull(),
  imageUrl: text("image_url").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  categoryId: integer("category_id").notNull(),
  locationId: integer("location_id").notNull(),
});

export const insertClassSchema = createInsertSchema(classes).pick({
  title: true,
  description: true,
  price: true,
  priceUnit: true,
  totalSpots: true,
  availableSpots: true,
  imageUrl: true,
  date: true,
  time: true,
  categoryId: true,
  locationId: true,
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  firstName: true,
  lastName: true,
  email: true,
  subject: true,
  message: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Combined class type with related data
export type ClassWithDetails = Class & {
  category: Category;
  location: Location;
};
