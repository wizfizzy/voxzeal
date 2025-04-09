import { 
  Headphones, 
  ShoppingCart, 
  MailPlus, 
  Code, 
  Share2, 
  Bot
} from "lucide-react";

// Component to render service icons by slug
export function ServiceIcon({ 
  slug, 
  size = "medium", 
  color = "primary" 
}: { 
  slug: string; 
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" 
}) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-20 h-20"
  };
  
  const colorClass = color === "white" ? "text-white" : "text-primary";
  const className = `${sizeClasses[size]} ${colorClass}`;
  
  switch (slug) {
    case "tech-virtual-assistant":
      return <Headphones className={className} />;
    case "ecommerce-support":
      return <ShoppingCart className={className} />;
    case "email-marketing":
      return <MailPlus className={className} />;
    case "web-design-development":
      return <Code className={className} />;
    case "social-media-management":
      return <Share2 className={className} />;
    case "ai-automation-development":
      return <Bot className={className} />;
    default:
      return <Headphones className={className} />;
  }
}
