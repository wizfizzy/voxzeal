import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassWithDetails } from "@shared/schema";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { Loader2, MapPin, Clock, Calendar, DollarSign, Info } from "lucide-react";

export default function ClassDetails() {
  const { id } = useParams();
  
  const { data: classItem, isLoading, error } = useQuery<ClassWithDetails>({
    queryKey: [`/api/classes/${id}`],
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !classItem) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow flex-col justify-center items-center py-20">
          <Info className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-500 mb-6">The class you're looking for could not be found.</p>
          <Link href="/classes">
            <Button>Browse All Classes</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const {
    title,
    description,
    price,
    priceUnit,
    totalSpots,
    availableSpots,
    imageUrl,
    date,
    time,
    category,
    location
  } = classItem;
  
  // Format price as dollars
  const formattedPrice = `$${(price / 100).toFixed(2)}`;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/classes">
              <Button variant="ghost" className="pl-0">
                ← Back to Classes
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md" 
                />
                <div className="absolute top-4 right-4">
                  <AvailabilityBadge 
                    availableSpots={availableSpots} 
                    totalSpots={totalSpots} 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium" 
                    style={{ 
                      backgroundColor: category.bgColor, 
                      color: category.textColor 
                    }}
                  >
                    {category.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                <p className="text-gray-600 mb-6 whitespace-pre-line">{description}</p>
                
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Date</h3>
                        <p className="text-gray-600">{date}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Time</h3>
                        <p className="text-gray-600">{time}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Location</h3>
                        <p className="text-gray-600">{location.name}</p>
                        {location.address && (
                          <p className="text-gray-500 text-sm">{location.address}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Price</h3>
                        <p className="text-gray-600">{formattedPrice} {priceUnit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold text-primary mb-1">{formattedPrice}</p>
                    <p className="text-gray-500">{priceUnit}</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="font-medium text-gray-900 mb-1">Availability</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">
                        {availableSpots} of {totalSpots} spots left
                      </p>
                      <AvailabilityBadge 
                        availableSpots={availableSpots} 
                        totalSpots={totalSpots} 
                      />
                    </div>
                    
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ 
                          width: `${(availableSpots / totalSpots) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {availableSpots > 0 ? (
                      <Button className="w-full">Book Now</Button>
                    ) : (
                      <Button className="w-full" variant="outline">Join Waitlist</Button>
                    )}
                    <Button className="w-full" variant="outline">Contact Instructor</Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    <p className="mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Instant confirmation
                    </p>
                    <p>
                      <Info className="h-4 w-4 inline mr-1" />
                      Free cancellation up to 24 hours before class
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
