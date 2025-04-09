import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";

// Sample blog posts data - in a real application, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: "5 Ways AI Automation Can Transform Your Business",
    slug: "ai-automation-transform-business",
    excerpt: "Discover how implementing AI automation solutions can streamline your operations, reduce costs, and drive growth in today's competitive market.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "Sarah Johnson",
    date: "April 5, 2023",
    readTime: "5 min read",
    category: "AI Automation",
    imageUrl: "https://images.unsplash.com/photo-1677442135073-c841d2aad08e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
  },
  {
    id: 2,
    title: "The Ultimate Guide to E-commerce Success in 2023",
    slug: "ecommerce-success-guide-2023",
    excerpt: "Learn the latest strategies, tools, and best practices to take your e-commerce business to the next level and stay ahead of the competition.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "Michael Chen",
    date: "March 18, 2023",
    readTime: "8 min read",
    category: "E-commerce",
    imageUrl: "https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 3,
    title: "How to Create an Effective Email Marketing Campaign",
    slug: "effective-email-marketing-campaign",
    excerpt: "Explore proven techniques for designing, implementing, and measuring the success of email marketing campaigns that drive engagement and conversions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "Jessica Williams",
    date: "February 22, 2023",
    readTime: "6 min read",
    category: "Email Marketing",
    imageUrl: "https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 4,
    title: "The Power of Social Media Management for Brand Growth",
    slug: "social-media-management-brand-growth",
    excerpt: "Find out how strategic social media management can help build your brand, connect with your audience, and drive meaningful business results.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "David Rodriguez",
    date: "January 10, 2023",
    readTime: "7 min read",
    category: "Social Media",
    imageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 5,
    title: "Web Design Trends to Watch in 2023",
    slug: "web-design-trends-2023",
    excerpt: "Stay ahead of the curve with these cutting-edge web design trends that are shaping the digital landscape and enhancing user experiences.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "Emily Parker",
    date: "December 15, 2022",
    readTime: "4 min read",
    category: "Web Design",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 6,
    title: "Virtual Assistant Services That Save You Time and Money",
    slug: "virtual-assistant-services-benefits",
    excerpt: "Discover how tech virtual assistants can help streamline your operations, increase productivity, and allow you to focus on growing your business.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquam nisl, nec aliquam nisl nisl nec aliquam.",
    author: "Alex Turner",
    date: "November 8, 2022",
    readTime: "5 min read",
    category: "Virtual Assistant",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  }
];

// Array of categories for the filter dropdown
const categories = [
  "All Categories",
  "AI Automation",
  "E-commerce",
  "Email Marketing",
  "Social Media",
  "Web Design",
  "Virtual Assistant"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter posts based on category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              VOXZEAL Blog
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
              Insights, tips, and trends on digital marketing, e-commerce, web design, and business growth strategies.
            </p>
          </div>
        </div>
        
        {/* Search and Filter section */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Blog posts grid */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex-grow">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 flex items-center justify-center"
                        >
                          Read More <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
        
        {/* Newsletter subscription */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Stay updated with our latest insights, industry trends, and exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}