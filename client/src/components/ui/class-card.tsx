import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClassWithDetails } from "@shared/schema";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { MapPin, Clock } from "lucide-react";

interface ClassCardProps {
  classItem: ClassWithDetails;
}

export function ClassCard({ classItem }: ClassCardProps) {
  const {
    id,
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
    <Card className="class-card overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-md hover:-translate-y-1">
      <div className="relative">
        <img className="h-48 w-full object-cover" src={imageUrl} alt={title} />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <AvailabilityBadge availableSpots={availableSpots} totalSpots={totalSpots} />
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <span 
              className="inline-block px-2 py-1 leading-none rounded-full font-semibold uppercase tracking-wide text-xs" 
              style={{ 
                backgroundColor: category.bgColor, 
                color: category.textColor 
              }}
            >
              {category.name}
            </span>
            <h3 className="mt-2 text-lg font-semibold leading-tight text-gray-900">{title}</h3>
          </div>
          <div className="text-right">
            <span className="font-bold text-primary">{formattedPrice}</span>
            <span className="block text-sm text-gray-500">{priceUnit}</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          {location.name}
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          {date} • {time}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <div>
            {availableSpots === 0 ? (
              <span className="text-sm text-gray-500">Waitlist available</span>
            ) : (
              <span className="text-sm text-gray-500">
                {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} left
              </span>
            )}
          </div>
          <Link href={`/classes/${id}`}>
            {availableSpots === 0 ? (
              <Button variant="outline">Join Waitlist</Button>
            ) : (
              <Button>View Details</Button>
            )}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
