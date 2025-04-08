import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ClassCard } from "@/components/ui/class-card";
import { SearchFilters } from "@/components/ui/search-filters";
import { ClassWithDetails } from "@shared/schema";
import { Loader2, Search } from "lucide-react";

export default function AllClasses() {
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
      
      <main className="flex-grow">
        {/* Page header */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">All Classes & Workshops</h1>
            <p className="mt-2 text-gray-600">Browse and filter through all available classes</p>
          </div>
        </div>
        
        {/* Search Filters */}
        <SearchFilters 
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onLocationChange={setSelectedLocation}
          onAvailabilityChange={setAvailability}
        />
        
        {/* Class listings */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <>
                <p className="text-sm text-gray-500 mb-6">Showing {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredClasses.map((classItem) => (
                    <ClassCard key={classItem.id} classItem={classItem} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
