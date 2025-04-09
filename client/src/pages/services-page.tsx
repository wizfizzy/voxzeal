import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { type Service } from "@shared/schema";
import { 
  Workflow, 
  ShoppingCart, 
  MailPlus, 
  Code, 
  Share2, 
  Bot, 
  ChevronRight, 
  Loader2, 
  HeadphonesIcon 
} from "lucide-react";

// Mapping from slug to icon
const ServiceIcons: Record<string, React.ElementType> = {
  "tech-virtual-assistant": HeadphonesIcon,
  "ecommerce-support": ShoppingCart,
  "email-marketing": MailPlus,
  "web-design-development": Code,
  "social-media-management": Share2,
  "ai-automation-development": Bot
};

export default function ServicesPage() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Our Services
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
              Comprehensive digital solutions to help your business grow and succeed in the online marketplace.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-12">
              {services.map((service, index) => {
                const ServiceIcon = ServiceIcons[service.slug] || HeadphonesIcon;
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={service.id} 
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                  >
                    <div className="md:w-1/2">
                      <div className="bg-primary bg-opacity-10 p-8 rounded-lg inline-block mb-4">
                        <ServiceIcon className="w-16 h-16 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.name}</h2>
                      <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                      <Link href={`/services/${service.slug}`}>
                        <Button className="flex items-center">
                          Learn More <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg shadow-inner">
                      <h3 className="font-medium text-gray-900 mb-4">Key Features:</h3>
                      <div className="space-y-3 text-gray-700">
                        {service.detailedDescription.split('. ').slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="ml-2">{item}.</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to elevate your business?</span>
              <span className="block text-primary">Get started with our services today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a 
                  href="https://calendly.com/voxzeal/book-a-call" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  Book a Consultation
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/contact">
                  <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
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