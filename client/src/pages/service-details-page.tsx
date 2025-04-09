import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { type Service, type PortfolioItemWithService } from "@shared/schema";
import { 
  Headphones, 
  ShoppingCart, 
  MailPlus, 
  Code, 
  Share2, 
  Bot, 
  ArrowLeft, 
  Loader2 
} from "lucide-react";

// Service Icon component to render the appropriate icon
const ServiceIcon = ({ slug }: { slug: string }) => {
  switch (slug) {
    case "tech-virtual-assistant":
      return <Headphones className="w-20 h-20 text-white" />;
    case "ecommerce-support":
      return <ShoppingCart className="w-20 h-20 text-white" />;
    case "email-marketing":
      return <MailPlus className="w-20 h-20 text-white" />;
    case "web-design-development":
      return <Code className="w-20 h-20 text-white" />;
    case "social-media-management":
      return <Share2 className="w-20 h-20 text-white" />;
    case "ai-automation-development":
      return <Bot className="w-20 h-20 text-white" />;
    default:
      return <Headphones className="w-20 h-20 text-white" />;
  }
};

export default function ServiceDetailsPage() {
  const [, params] = useParams<{ slug: string }>();
  const slug = params?.slug;

  // Query the service by slug
  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: [`/api/services/slug/${slug}`],
    enabled: !!slug,
  });

  // Query related portfolio items
  const { data: portfolioItems = [], isLoading: portfolioLoading } = useQuery<PortfolioItemWithService[]>({
    queryKey: [`/api/portfolio`, { service: service?.id }],
    enabled: !!service?.id,
  });

  // Split the detailed description into paragraphs
  const descriptionParagraphs = service?.detailedDescription.split('. ') || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        {serviceLoading ? (
          <div className="bg-primary h-64 flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        ) : service ? (
          <div className="bg-primary">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="md:w-2/3">
                  <Link href="/services">
                    <div className="inline-flex items-center text-blue-100 mb-6 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Services
                    </div>
                  </Link>
                  <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{service.name}</h1>
                  <p className="mt-4 text-lg text-blue-100 max-w-3xl">
                    {service.description}
                  </p>
                  <div className="mt-8">
                    <a 
                      href="https://calendly.com/voxzeal/book-a-call" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary bg-white hover:bg-gray-50"
                    >
                      Schedule a Consultation
                    </a>
                  </div>
                </div>
                <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center">
                  <div className="bg-blue-800 p-6 rounded-full">
                    <ServiceIcon slug={service.slug} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Service Not Found</h1>
              <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
                Sorry, we couldn't find the service you were looking for.
              </p>
              <div className="mt-8">
                <Link href="/services">
                  <Button variant="outline" className="bg-white text-primary hover:bg-gray-50">
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Service Details Section */}
        {service && (
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About Our {service.name} Service</h2>
                <div className="prose prose-lg max-w-none">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-600">{paragraph.trim()}.</p>
                  ))}
                </div>
              </div>
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose Our {service.name} Service?</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">Expert team with proven track record</p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">Tailored strategies for your business</p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">Transparent reporting and communication</p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">Measurable results and ROI</p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link href="/contact">
                      <Button className="w-full">Contact Us</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Portfolio Items */}
        {service && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Our {service.name} Portfolio</h2>
              
              {portfolioLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : portfolioItems.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Link href={`/portfolio/${item.id}`}>
                          <Button variant="outline" className="w-full">View Case Study</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-600">No portfolio items available for this service yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-blue-100">Book a consultation today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a 
                  href="https://calendly.com/voxzeal/book-a-call" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                >
                  Book a Consultation
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/contact">
                  <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900">
                    Contact Us
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}