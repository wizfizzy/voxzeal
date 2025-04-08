import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ClassCard } from "@/components/ui/class-card";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SearchFilters } from "@/components/ui/search-filters";
import { ClassWithDetails } from "@shared/schema";
import { Loader2, Search, Check, Clock } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availability, setAvailability] = useState("");
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append("search", searchQuery);
  if (selectedCategory) queryParams.append("category", selectedCategory);
  if (selectedLocation) queryParams.append("location", selectedLocation);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  // Fetch classes with filters
  const { data: classes = [], isLoading } = useQuery<ClassWithDetails[]>({
    queryKey: [`/api/classes${queryString}`],
  });
  
  // Filter by availability on client-side
  const filteredClasses = availability
    ? classes.filter(cls => {
        if (availability === "available") return cls.availableSpots > 0;
        if (availability === "limited") return cls.availableSpots > 0 && cls.availableSpots <= cls.totalSpots * 0.2;
        return true;
      })
    : classes;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Discover local classes</span>
                  <span className="block text-indigo-200">with real-time availability</span>
                </h1>
                <p className="mt-3 text-base text-blue-50 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Find and book workshops, classes, and learning experiences in your area. Browse by category, check real-time availability, and book your spot instantly.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#class-listings" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Explore Classes
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/classes">
                      <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                        How It Works
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
            alt="People in a workshop" 
          />
        </div>
      </div>
      
      {/* Search Filters */}
      <SearchFilters 
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
        onAvailabilityChange={setAvailability}
      />
      
      {/* Featured Classes */}
      <section id="class-listings" className="py-12 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Classes & Workshops</h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
              Discover our most popular workshops and classes with real-time availability.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClasses.slice(0, 8).map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/classes">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                View All Classes
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
              Discover and book local classes and workshops in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Discover Classes</h3>
              <p className="text-gray-600 text-center">
                Browse through our curated selection of local classes and workshops. Filter by category, location, or date to find the perfect fit.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 mx-auto">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Check Availability</h3>
              <p className="text-gray-600 text-center">
                See real-time availability for each class. No more calling or emailing to check if spots are available.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Book Instantly</h3>
              <p className="text-gray-600 text-center">
                Book your spot with just a few clicks. Receive instant confirmation and all the details you need to attend.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Discover Local Classes?
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Join thousands of students finding the perfect workshops and classes in their area.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link href="/classes">
                <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                  Browse Classes
                </a>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link href="/contact">
                <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70">
                  Contact Us
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
