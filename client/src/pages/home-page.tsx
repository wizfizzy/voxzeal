import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { useQuery } from "@tanstack/react-query";
import { type Service, type Testimonial } from "@shared/schema";
import { Monitor, ShoppingCart, Mail, Code, Share2, FileText, ChevronRight, Check, Loader2 } from "lucide-react";

// Mapping from slug to icon
const ServiceIcons: Record<string, React.ElementType> = {
  "monitor": Monitor,
  "shopping-cart": ShoppingCart,
  "mail": Mail,
  "code": Code,
  "share-2": Share2,
  "file-text": FileText
};

export default function HomePage() {
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-20 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="text-center md:text-left md:w-2/3">
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl md:text-6xl">
                Transform Your Digital Presence
              </h1>
              <p className="mt-6 max-w-md mx-auto md:mx-0 text-lg text-blue-100 sm:max-w-3xl">
                Expert tech virtual assistants, ecommerce support, and digital marketing 
                services to elevate your business.
              </p>
              <div className="mt-10 max-w-sm mx-auto md:mx-0 sm:max-w-none sm:flex sm:justify-start">
                <div className="space-y-4 sm:space-y-0 sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link href="/services">
                    <Button size="lg" className="w-full sm:w-auto">Our Services</Button>
                  </Link>
                  <a href="https://calendly.com/voxzeal/book-a-call" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
                      Book a Consultation
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services section */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Our Services</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Solutions That Power Your Success
            </p>
            <p className="max-w-xl mt-5 mx-auto text-lg text-gray-500">
              Comprehensive digital services tailored to meet the unique needs of your business
            </p>
          </div>

          {servicesLoading ? (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative p-6 bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const ServiceIcon = ServiceIcons[service.icon] || Monitor;
                return (
                  <div key={service.id} className="relative p-6 bg-white hover:bg-gray-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                    <div className="text-primary w-12 h-12 mb-4">
                      <ServiceIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-500 mb-6">{service.description}</p>
                    <Link href={`/services/${service.slug}`} className="inline-flex items-center text-primary font-medium hover:text-primary-dark">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Choose Us section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Why Choose VOXZEAL</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:tracking-tight sm:text-4xl">
                Expertise That Delivers Results
              </p>
              <p className="max-w-xl mt-5 mx-auto text-lg text-gray-500">
                Trusted by businesses of all sizes to deliver exceptional digital solutions
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Proven Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our team consists of experienced professionals with specialized skills across various digital domains.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Tailored Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  We customize our services to match your specific business needs and objectives.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Measurable Results
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  We focus on delivering tangible outcomes that drive growth for your business.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials section */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Testimonials</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:tracking-tight sm:text-4xl">
              What Our Clients Say
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600 italic">"{testimonial.testimonial}"</p>
                  <div className="mt-6 flex items-center">
                    {testimonial.imageUrl && (
                      <img className="h-10 w-10 rounded-full" src={testimonial.imageUrl} alt={testimonial.name} />
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA section */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to grow your business?</span>
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
