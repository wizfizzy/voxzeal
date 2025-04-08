import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { type PortfolioItemWithService } from "@shared/schema";
import { ArrowLeft, Quote, Loader2 } from "lucide-react";

export default function PortfolioItemPage() {
  // Get the portfolio item ID from the URL
  const [, params] = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id) : null;

  // Fetch the portfolio item details
  const { data: portfolioItem, isLoading } = useQuery<PortfolioItemWithService>({
    queryKey: [`/api/portfolio/${id}`],
    enabled: !!id,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !portfolioItem ? (
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Case Study Not Found
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We couldn't find the case study you were looking for.
            </p>
            <div className="mt-8">
              <Link href="/portfolio">
                <Button>View All Case Studies</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Hero section */}
            <div className="bg-primary">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Link href="/portfolio">
                  <div className="inline-flex items-center text-blue-100 mb-6 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Portfolio
                  </div>
                </Link>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                  {portfolioItem.title}
                </h1>
                <div className="mt-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-800 text-white">
                  {portfolioItem.service.name}
                </div>
              </div>
            </div>

            {/* Case Study Content */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <img 
                    src={portfolioItem.imageUrl} 
                    alt={portfolioItem.title} 
                    className="w-full h-96 object-cover rounded-lg shadow-md mb-8"
                  />
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Project</h2>
                  <p className="text-lg text-gray-600 mb-8">{portfolioItem.description}</p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">The Challenge</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {portfolioItem.client} needed to enhance their digital presence and reach more customers effectively. 
                    They were facing challenges with {portfolioItem.service.name.toLowerCase()} and needed a partner who could provide expertise and guidance.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Approach</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Our team at VOXZEAL worked closely with {portfolioItem.client} to understand their unique needs and business goals. 
                    We developed a customized solution leveraging our expertise in {portfolioItem.service.name}.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>
                  <p className="text-lg text-gray-600 mb-8">{portfolioItem.result}</p>
                  
                  {portfolioItem.testimonial && (
                    <div className="bg-gray-50 rounded-lg p-8 my-8">
                      <div className="flex items-start">
                        <Quote className="w-8 h-8 text-primary mr-4 flex-shrink-0" />
                        <div>
                          <p className="text-lg italic text-gray-600 mb-4">"{portfolioItem.testimonial}"</p>
                          <p className="font-medium text-gray-900">{portfolioItem.testimonialAuthor}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <dt className="font-medium text-gray-900">Client</dt>
                      <dd className="mt-1 text-gray-600">{portfolioItem.client}</dd>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <dt className="font-medium text-gray-900">Service</dt>
                      <dd className="mt-1 text-gray-600">{portfolioItem.service.name}</dd>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <dt className="font-medium text-gray-900">Results</dt>
                      <dd className="mt-1 text-gray-600">{portfolioItem.result}</dd>
                    </div>
                    
                    <div className="mt-8">
                      <Link href={`/services/${portfolioItem.service.slug}`}>
                        <Button variant="outline" className="w-full mb-4">
                          Learn More About This Service
                        </Button>
                      </Link>
                      <a 
                        href="https://calendly.com/voxzeal/book-a-call" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          Book a Consultation
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Related Projects Section - Would appear here in a full implementation */}

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to achieve similar results?</span>
              <span className="block text-blue-100">Get started with VOXZEAL today.</span>
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