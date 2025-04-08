import { users, type User, type InsertUser } from "@shared/schema";
import { categories, type Category, type InsertCategory } from "@shared/schema";
import { locations, type Location, type InsertLocation } from "@shared/schema";
import { classes, type Class, type InsertClass, type ClassWithDetails } from "@shared/schema";
import { messages, type Message, type InsertMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Location methods
  getAllLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;
  
  // Class methods
  getAllClasses(): Promise<ClassWithDetails[]>;
  getClass(id: number): Promise<ClassWithDetails | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: number): Promise<boolean>;
  updateClassAvailability(id: number, availableSpots: number): Promise<Class | undefined>;
  getClassesByCategory(categoryId: number): Promise<ClassWithDetails[]>;
  getClassesByLocation(locationId: number): Promise<ClassWithDetails[]>;
  searchClasses(query: string): Promise<ClassWithDetails[]>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private categoriesData: Map<number, Category>;
  private locationsData: Map<number, Location>;
  private classesData: Map<number, Class>;
  private messagesData: Map<number, Message>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private locationCurrentId: number;
  private classCurrentId: number;
  private messageCurrentId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersData = new Map();
    this.categoriesData = new Map();
    this.locationsData = new Map();
    this.classesData = new Map();
    this.messagesData = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.locationCurrentId = 1;
    this.classCurrentId = 1;
    this.messageCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.usersData.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesData.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesData.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categoriesData.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categoriesData.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory = { ...existingCategory, ...categoryData };
    this.categoriesData.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categoriesData.delete(id);
  }
  
  // Location methods
  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locationsData.values());
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locationsData.get(id);
  }
  
  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationCurrentId++;
    const location: Location = { ...insertLocation, id };
    this.locationsData.set(id, location);
    return location;
  }
  
  async updateLocation(id: number, locationData: Partial<InsertLocation>): Promise<Location | undefined> {
    const existingLocation = this.locationsData.get(id);
    if (!existingLocation) return undefined;
    
    const updatedLocation = { ...existingLocation, ...locationData };
    this.locationsData.set(id, updatedLocation);
    return updatedLocation;
  }
  
  async deleteLocation(id: number): Promise<boolean> {
    return this.locationsData.delete(id);
  }
  
  // Class methods
  async getAllClasses(): Promise<ClassWithDetails[]> {
    return Array.from(this.classesData.values()).map(cls => this.addClassDetails(cls));
  }
  
  async getClass(id: number): Promise<ClassWithDetails | undefined> {
    const cls = this.classesData.get(id);
    if (!cls) return undefined;
    return this.addClassDetails(cls);
  }
  
  async createClass(insertClass: InsertClass): Promise<Class> {
    const id = this.classCurrentId++;
    const cls: Class = { ...insertClass, id };
    this.classesData.set(id, cls);
    return cls;
  }
  
  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const existingClass = this.classesData.get(id);
    if (!existingClass) return undefined;
    
    const updatedClass = { ...existingClass, ...classData };
    this.classesData.set(id, updatedClass);
    return updatedClass;
  }
  
  async deleteClass(id: number): Promise<boolean> {
    return this.classesData.delete(id);
  }
  
  async updateClassAvailability(id: number, availableSpots: number): Promise<Class | undefined> {
    const existingClass = this.classesData.get(id);
    if (!existingClass) return undefined;
    
    const updatedClass = { ...existingClass, availableSpots };
    this.classesData.set(id, updatedClass);
    return updatedClass;
  }
  
  async getClassesByCategory(categoryId: number): Promise<ClassWithDetails[]> {
    return Array.from(this.classesData.values())
      .filter(cls => cls.categoryId === categoryId)
      .map(cls => this.addClassDetails(cls));
  }
  
  async getClassesByLocation(locationId: number): Promise<ClassWithDetails[]> {
    return Array.from(this.classesData.values())
      .filter(cls => cls.locationId === locationId)
      .map(cls => this.addClassDetails(cls));
  }
  
  async searchClasses(query: string): Promise<ClassWithDetails[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.classesData.values())
      .filter(cls => 
        cls.title.toLowerCase().includes(lowercaseQuery) || 
        cls.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(cls => this.addClassDetails(cls));
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.messagesData.set(id, message);
    return message;
  }
  
  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messagesData.values());
  }
  
  // Helper methods
  private addClassDetails(cls: Class): ClassWithDetails {
    const category = this.categoriesData.get(cls.categoryId);
    const location = this.locationsData.get(cls.locationId);
    
    if (!category || !location) {
      throw new Error(`Missing category or location for class ${cls.id}`);
    }
    
    return {
      ...cls,
      category,
      location
    };
  }
  
  // Initialize with sample data
  private initSampleData() {
    // Create admin user
    const adminUser: User = {
      id: this.userCurrentId++,
      username: "admin",
      password: "$2b$10$9C5CWJcV7vG5J4vB3Vhkv.YE7YJy8Gkb7gFLGsRdUgvHzwEKLm9q.", // "admin" - this will be hashed properly in auth.ts
      isAdmin: true
    };
    this.usersData.set(adminUser.id, adminUser);
    
    // Create categories
    const categories: InsertCategory[] = [
      { name: "Art & Crafts", color: "#3B82F6", textColor: "#1E40AF", bgColor: "#DBEAFE" },
      { name: "Cooking", color: "#F59E0B", textColor: "#92400E", bgColor: "#FEF3C7" },
      { name: "Fitness", color: "#10B981", textColor: "#065F46", bgColor: "#D1FAE5" },
      { name: "Technology", color: "#8B5CF6", textColor: "#5B21B6", bgColor: "#EDE9FE" },
      { name: "Languages", color: "#EC4899", textColor: "#9D174D", bgColor: "#FCE7F3" },
      { name: "Music", color: "#EF4444", textColor: "#991B1B", bgColor: "#FEE2E2" }
    ];
    
    categories.forEach(category => {
      this.categoriesData.set(this.categoryCurrentId, { ...category, id: this.categoryCurrentId });
      this.categoryCurrentId++;
    });
    
    // Create locations
    const locations: InsertLocation[] = [
      { name: "Downtown Studio", address: "123 Main St, Downtown" },
      { name: "Culinary Institute", address: "456 Chef Way, North End" },
      { name: "East Side Wellness Center", address: "789 Healthy Blvd, East Side" },
      { name: "Tech Hub Coworking", address: "321 Digital Lane, Innovation District" },
      { name: "City Park & Art Center", address: "654 Nature Path, Green District" },
      { name: "Waterfront Gallery", address: "987 Ocean View, Harborside" }
    ];
    
    locations.forEach(location => {
      this.locationsData.set(this.locationCurrentId, { ...location, id: this.locationCurrentId });
      this.locationCurrentId++;
    });
    
    // Create classes
    const classes: InsertClass[] = [
      {
        title: "Pottery Workshop for Beginners",
        description: "Learn the basics of pottery in this hands-on workshop perfect for beginners. All materials included.",
        price: 6500, // Storing prices in cents
        priceUnit: "per person",
        totalSpots: 12,
        availableSpots: 8,
        imageUrl: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Wed, June 15",
        time: "6:00 PM - 8:00 PM",
        categoryId: 1, // Art & Crafts
        locationId: 1 // Downtown Studio
      },
      {
        title: "Seasonal Farm-to-Table Cooking",
        description: "Learn to prepare delicious meals using fresh, seasonal ingredients from local farms. Includes dinner!",
        price: 8500,
        priceUnit: "per person",
        totalSpots: 10,
        availableSpots: 2,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Sat, June 18",
        time: "2:00 PM - 5:00 PM",
        categoryId: 2, // Cooking
        locationId: 2 // Culinary Institute
      },
      {
        title: "Yoga for Stress Relief",
        description: "A gentle yoga class focused on stress relief and relaxation. Perfect for all experience levels.",
        price: 1500,
        priceUnit: "per session",
        totalSpots: 20,
        availableSpots: 12,
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Every Monday",
        time: "7:00 PM - 8:00 PM",
        categoryId: 3, // Fitness
        locationId: 3 // East Side Wellness Center
      },
      {
        title: "Intro to Web Development",
        description: "Learn the basics of HTML, CSS, and JavaScript in this workshop designed for complete beginners.",
        price: 12000,
        priceUnit: "per person",
        totalSpots: 15,
        availableSpots: 0,
        imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Sat-Sun, June 25-26",
        time: "10:00 AM - 4:00 PM",
        categoryId: 4, // Technology
        locationId: 4 // Tech Hub Coworking
      },
      {
        title: "Urban Sketching Basics",
        description: "Learn to sketch urban scenes with simple techniques. All skill levels welcome. Materials provided.",
        price: 4500,
        priceUnit: "per person",
        totalSpots: 12,
        availableSpots: 10,
        imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Sun, June 19",
        time: "9:00 AM - 12:00 PM",
        categoryId: 1, // Art & Crafts
        locationId: 5 // City Park & Art Center
      },
      {
        title: "Photography Fundamentals",
        description: "Master the basics of composition, lighting and camera settings. Bring your own camera.",
        price: 8000,
        priceUnit: "per person",
        totalSpots: 8,
        availableSpots: 3,
        imageUrl: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        date: "Fri, June 24",
        time: "1:00 PM - 4:00 PM",
        categoryId: 1, // Art & Crafts
        locationId: 6 // Waterfront Gallery
      }
    ];
    
    classes.forEach(cls => {
      this.classesData.set(this.classCurrentId, { ...cls, id: this.classCurrentId });
      this.classCurrentId++;
    });
  }
}

export const storage = new MemStorage();
