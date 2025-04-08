import { users, type User, type InsertUser } from "@shared/schema";
import { services, type Service, type InsertService } from "@shared/schema";
import { portfolioItems, type PortfolioItem, type InsertPortfolioItem, type PortfolioItemWithService } from "@shared/schema";
import { teamMembers, type TeamMember, type InsertTeamMember } from "@shared/schema";
import { testimonials, type Testimonial, type InsertTestimonial } from "@shared/schema";
import { messages, type Message, type InsertMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Portfolio methods
  getAllPortfolioItems(): Promise<PortfolioItemWithService[]>;
  getPortfolioItem(id: number): Promise<PortfolioItemWithService | undefined>;
  createPortfolioItem(portfolioItem: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, portfolioItem: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  getPortfolioItemsByService(serviceId: number): Promise<PortfolioItemWithService[]>;
  
  // Team members methods
  getAllTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private servicesData: Map<number, Service>;
  private portfolioItemsData: Map<number, PortfolioItem>;
  private teamMembersData: Map<number, TeamMember>;
  private testimonialsData: Map<number, Testimonial>;
  private messagesData: Map<number, Message>;
  
  private userCurrentId: number;
  private serviceCurrentId: number;
  private portfolioItemCurrentId: number;
  private teamMemberCurrentId: number;
  private testimonialCurrentId: number;
  private messageCurrentId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.usersData = new Map();
    this.servicesData = new Map();
    this.portfolioItemsData = new Map();
    this.teamMembersData = new Map();
    this.testimonialsData = new Map();
    this.messagesData = new Map();
    
    this.userCurrentId = 1;
    this.serviceCurrentId = 1;
    this.portfolioItemCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.testimonialCurrentId = 1;
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
  
  // Service methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.servicesData.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.servicesData.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.servicesData.values()).find(
      (service) => service.slug === slug
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const service: Service = { ...insertService, id };
    this.servicesData.set(id, service);
    return service;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.servicesData.get(id);
    if (!existingService) return undefined;
    
    const updatedService = { ...existingService, ...serviceData };
    this.servicesData.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.servicesData.delete(id);
  }
  
  // Portfolio methods
  async getAllPortfolioItems(): Promise<PortfolioItemWithService[]> {
    return Array.from(this.portfolioItemsData.values()).map(item => this.addPortfolioItemDetails(item));
  }
  
  async getPortfolioItem(id: number): Promise<PortfolioItemWithService | undefined> {
    const portfolioItem = this.portfolioItemsData.get(id);
    if (!portfolioItem) return undefined;
    return this.addPortfolioItemDetails(portfolioItem);
  }
  
  async createPortfolioItem(insertPortfolioItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.portfolioItemCurrentId++;
    const portfolioItem: PortfolioItem = { ...insertPortfolioItem, id };
    this.portfolioItemsData.set(id, portfolioItem);
    return portfolioItem;
  }
  
  async updatePortfolioItem(id: number, portfolioItemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const existingPortfolioItem = this.portfolioItemsData.get(id);
    if (!existingPortfolioItem) return undefined;
    
    const updatedPortfolioItem = { ...existingPortfolioItem, ...portfolioItemData };
    this.portfolioItemsData.set(id, updatedPortfolioItem);
    return updatedPortfolioItem;
  }
  
  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItemsData.delete(id);
  }
  
  async getPortfolioItemsByService(serviceId: number): Promise<PortfolioItemWithService[]> {
    return Array.from(this.portfolioItemsData.values())
      .filter(item => item.serviceId === serviceId)
      .map(item => this.addPortfolioItemDetails(item));
  }
  
  // Team members methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembersData.values());
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembersData.get(id);
  }
  
  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const teamMember: TeamMember = { ...insertTeamMember, id };
    this.teamMembersData.set(id, teamMember);
    return teamMember;
  }
  
  async updateTeamMember(id: number, teamMemberData: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const existingTeamMember = this.teamMembersData.get(id);
    if (!existingTeamMember) return undefined;
    
    const updatedTeamMember = { ...existingTeamMember, ...teamMemberData };
    this.teamMembersData.set(id, updatedTeamMember);
    return updatedTeamMember;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembersData.delete(id);
  }
  
  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsData.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonialsData.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonialsData.set(id, testimonial);
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonialsData.get(id);
    if (!existingTestimonial) return undefined;
    
    const updatedTestimonial = { ...existingTestimonial, ...testimonialData };
    this.testimonialsData.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonialsData.delete(id);
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
  private addPortfolioItemDetails(portfolioItem: PortfolioItem): PortfolioItemWithService {
    const service = this.servicesData.get(portfolioItem.serviceId);
    
    if (!service) {
      throw new Error(`Missing service for portfolio item ${portfolioItem.id}`);
    }
    
    return {
      ...portfolioItem,
      service
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
    
    // Create services
    const services: InsertService[] = [
      { 
        name: "Tech Virtual Assistant", 
        slug: "tech-virtual-assistant", 
        description: "Professional remote assistance for all your technical needs and administrative tasks.",
        icon: "monitor",
        detailedDescription: "Our Tech Virtual Assistants provide comprehensive remote support for businesses of all sizes. From managing your digital presence to handling technical tasks, our experienced professionals help you focus on growing your business while we handle the technical details."
      },
      { 
        name: "Ecommerce Support", 
        slug: "ecommerce-support", 
        description: "Complete management and optimization services for your online store.",
        icon: "shopping-cart",
        detailedDescription: "VOXZEAL provides end-to-end ecommerce support including store setup, product listing, inventory management, order processing, and customer service. We help businesses establish and grow their online presence with optimized product listings and streamlined operations."
      },
      { 
        name: "Email Marketing", 
        slug: "email-marketing", 
        description: "Strategic email campaigns that drive engagement and convert prospects into customers.",
        icon: "mail",
        detailedDescription: "Our email marketing services include campaign strategy, content creation, design, automation, and performance analysis. We create personalized email journeys that nurture leads, retain customers, and drive revenue with data-driven approaches and continuous optimization."
      },
      { 
        name: "Web Design & Development", 
        slug: "web-design-development", 
        description: "Custom, responsive websites that deliver exceptional user experiences.",
        icon: "code",
        detailedDescription: "VOXZEAL creates stunning, functional websites that reflect your brand and meet your business objectives. From simple landing pages to complex e-commerce platforms, our team delivers modern, mobile-responsive websites with intuitive user interfaces and robust backends."
      },
      { 
        name: "Social Media Management", 
        slug: "social-media-management", 
        description: "Comprehensive management of your brand's presence across social platforms.",
        icon: "share-2",
        detailedDescription: "Our social media experts develop and execute strategies that build your online presence, engage your audience, and drive business growth. Services include content creation, community management, paid advertising, and performance analytics across all major platforms."
      },
      { 
        name: "Content Writing", 
        slug: "content-writing", 
        description: "Engaging, SEO-optimized content that resonates with your target audience.",
        icon: "file-text",
        detailedDescription: "VOXZEAL's professional writers create compelling content that engages your audience and drives conversions. From blog posts and website copy to whitepapers and case studies, our content is strategically crafted to enhance your brand voice and improve search engine rankings."
      }
    ];
    
    services.forEach(service => {
      this.servicesData.set(this.serviceCurrentId, { ...service, id: this.serviceCurrentId });
      this.serviceCurrentId++;
    });
    
    // Create team members
    const teamMembers: InsertTeamMember[] = [
      {
        name: "Jessica Thompson",
        role: "CEO & Founder",
        bio: "Jessica has 10+ years of experience in digital marketing and business development. She founded VOXZEAL with a vision to help businesses grow through innovative digital solutions.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "Michael Chen",
        role: "Technical Director",
        bio: "Michael oversees all technical aspects of client projects. With a background in software engineering, he ensures all solutions are robust, scalable and future-proof.",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "Sarah Johnson",
        role: "Creative Director",
        bio: "Sarah leads our design team with her exceptional eye for aesthetics and user experience. She transforms client visions into visually stunning, functional designs.",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "David Rodriguez",
        role: "Marketing Strategist",
        bio: "David crafts data-driven marketing strategies that deliver measurable results. His analytical approach helps clients maximize their marketing ROI.",
        imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      }
    ];
    
    teamMembers.forEach(member => {
      this.teamMembersData.set(this.teamMemberCurrentId, { ...member, id: this.teamMemberCurrentId });
      this.teamMemberCurrentId++;
    });
    
    // Create testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Emily Roberts",
        company: "Bloom Boutique",
        testimonial: "VOXZEAL transformed our online presence completely. Their ecommerce support and social media management have increased our sales by 40% in just three months!",
        imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "James Wilson",
        company: "Tech Innovations Ltd",
        testimonial: "The web development team at VOXZEAL delivered a site that exceeded our expectations. Their attention to detail and technical expertise is unmatched.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "Sophia Martinez",
        company: "Culinary Creations",
        testimonial: "Their email marketing campaigns have revolutionized how we connect with customers. We've seen a 25% increase in repeat business since working with VOXZEAL.",
        imageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      }
    ];
    
    testimonials.forEach(testimonial => {
      this.testimonialsData.set(this.testimonialCurrentId, { ...testimonial, id: this.testimonialCurrentId });
      this.testimonialCurrentId++;
    });
    
    // Create portfolio items
    const portfolioItems: InsertPortfolioItem[] = [
      {
        title: "E-commerce Transformation",
        description: "Complete redesign and optimization of an online fashion store, resulting in a 65% increase in conversion rate.",
        imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        client: "Urban Style Apparel",
        serviceId: 2, // Ecommerce Support
        result: "65% increase in conversion rate, 40% reduction in cart abandonment",
        testimonial: "VOXZEAL completely transformed our online store. The new design is not only beautiful but incredibly functional, leading to significant improvements in our sales metrics.",
        testimonialAuthor: "Amanda Lewis, Marketing Director"
      },
      {
        title: "Email Automation Campaign",
        description: "Developed and implemented a multi-touchpoint email nurture sequence for a SaaS company.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        client: "CloudSoft Solutions",
        serviceId: 3, // Email Marketing
        result: "32% increase in trial conversions, 22% improvement in customer retention",
        testimonial: "The email campaign VOXZEAL created has been a game-changer for our customer journey. From onboarding to retention, every message feels perfectly timed and relevant.",
        testimonialAuthor: "Mark Johnson, CEO"
      },
      {
        title: "Corporate Website Redesign",
        description: "Complete overhaul of a financial services company website with focus on user experience and lead generation.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        client: "Meridian Financial Advisors",
        serviceId: 4, // Web Design & Development
        result: "85% increase in inquiry form submissions, 40% reduction in bounce rate",
        testimonial: "Our new website perfectly represents our brand while delivering measurable business results. The VOXZEAL team was responsive, creative, and technically excellent throughout the project.",
        testimonialAuthor: "Robert Chen, Marketing Manager"
      },
      {
        title: "Social Media Growth Strategy",
        description: "Comprehensive social media strategy and content creation for a wellness brand entering a competitive market.",
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        client: "Serene Living Co.",
        serviceId: 5, // Social Media Management
        result: "210% growth in social following over 6 months, 45% increase in website traffic from social channels",
        testimonial: "VOXZEAL's social media team understood our brand voice immediately and created content that truly resonated with our audience. The growth we've seen has been phenomenal.",
        testimonialAuthor: "Olivia Parker, Founder"
      }
    ];
    
    portfolioItems.forEach(item => {
      this.portfolioItemsData.set(this.portfolioItemCurrentId, { ...item, id: this.portfolioItemCurrentId });
      this.portfolioItemCurrentId++;
    });
  }
}

export const storage = new MemStorage();