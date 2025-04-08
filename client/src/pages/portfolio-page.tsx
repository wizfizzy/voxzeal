import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { type PortfolioItemWithService, type Service } from "@shared/schema";
import { Loader2, Filter } from "lucide-react";

export default function PortfolioPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Fetch all services for the filter
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Fetch portfolio items with optional service filter
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItemWithService[]>({
    queryKey: ['/api/portfolio', selectedService ? { service: selectedService } : {}],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Our Portfolio
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
              Explore our case studies and success stories showcasing our expertise across a range of industries and services.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Filter by Service:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedService === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedService(null)}
              >
                All
              </Button>
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant={selectedService === service.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedService(service.id)}
                >
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">No portfolio items found.</p>
            </div>
          ) : (
            <div className="grid gap-12">
              {portfolioItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
                >
                  <div className="md:w-1/2">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-72 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-light text-primary">
                      {item.service.name}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">{item.title}</h2>
                    <p className="mt-3 text-lg text-gray-600">{item.description}</p>
                    
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium text-gray-900">Client</dt>
                      <dd className="mt-1 text-sm text-gray-600">{item.client}</dd>
                    </div>
                    
                    <div className="mt-6">
                      <dt className="text-base font-medium text-gray-900">Results</dt>
                      <dd className="mt-1 text-sm text-gray-600">{item.result}</dd>
                    </div>
                    
                    <div className="mt-6">
                      <Link href={`/portfolio/${item.id}`}>
                        <Button>
                          View Case Study
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 mt-16">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to start your project?</span>
              <span className="block text-primary">Let's discuss your requirements.</span>
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