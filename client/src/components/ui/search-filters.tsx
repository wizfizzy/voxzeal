import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Location } from "@shared/schema";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onLocationChange: (locationId: string) => void;
  onAvailabilityChange: (availability: string) => void;
}

export function SearchFilters({
  onSearch,
  onCategoryChange,
  onLocationChange,
  onAvailabilityChange
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Get locations
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });
  
  // Handle search input with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, onSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-grow">
          <Input
            type="text"
            className="pl-10 pr-4"
            placeholder="Search for classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={onLocationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Any Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Location</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={onAvailabilityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Any Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="limited">Limited Spots</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
