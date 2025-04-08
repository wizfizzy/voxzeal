import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCategorySchema, insertLocationSchema, insertClassSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

// Custom middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Public API routes
  
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Locations routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching locations" });
    }
  });

  // Classes routes
  app.get("/api/classes", async (req, res) => {
    try {
      const category = req.query.category ? Number(req.query.category) : undefined;
      const location = req.query.location ? Number(req.query.location) : undefined;
      const search = req.query.search as string | undefined;

      let classes;
      if (category) {
        classes = await storage.getClassesByCategory(category);
      } else if (location) {
        classes = await storage.getClassesByLocation(location);
      } else if (search) {
        classes = await storage.searchClasses(search);
      } else {
        classes = await storage.getAllClasses();
      }
      
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching classes" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      const classItem = await storage.getClass(id);
      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      res.json(classItem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching class" });
    }
  });

  // Contact/Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating message" });
      }
    }
  });

  // Admin API routes
  
  // Admin Categories routes
  app.post("/api/admin/categories", isAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating category" });
      }
    }
  });

  app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating category" });
      }
    }
  });

  app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Admin Locations routes
  app.post("/api/admin/locations", isAdmin, async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid location data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating location" });
      }
    }
  });

  app.put("/api/admin/locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid location data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating location" });
      }
    }
  });

  app.delete("/api/admin/locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const success = await storage.deleteLocation(id);
      if (!success) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting location" });
    }
  });

  // Admin Classes routes
  app.post("/api/admin/classes", isAdmin, async (req, res) => {
    try {
      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(classData);
      const classWithDetails = await storage.getClass(newClass.id);
      res.status(201).json(classWithDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid class data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating class" });
      }
    }
  });

  app.put("/api/admin/classes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      const classData = insertClassSchema.partial().parse(req.body);
      const updatedClass = await storage.updateClass(id, classData);
      
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      const classWithDetails = await storage.getClass(updatedClass.id);
      res.json(classWithDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid class data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating class" });
      }
    }
  });

  app.put("/api/admin/classes/:id/availability", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      const { availableSpots } = req.body;
      if (typeof availableSpots !== 'number' || availableSpots < 0) {
        return res.status(400).json({ message: "Invalid available spots value" });
      }
      
      const updatedClass = await storage.updateClassAvailability(id, availableSpots);
      
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      const classWithDetails = await storage.getClass(updatedClass.id);
      res.json(classWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Error updating class availability" });
    }
  });

  app.delete("/api/admin/classes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      const success = await storage.deleteClass(id);
      if (!success) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting class" });
    }
  });

  // Admin Messages routes
  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
