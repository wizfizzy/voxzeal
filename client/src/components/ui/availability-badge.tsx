import { Badge } from "@/components/ui/badge";

interface AvailabilityBadgeProps {
  availableSpots: number;
  totalSpots: number;
}

export function AvailabilityBadge({ availableSpots, totalSpots }: AvailabilityBadgeProps) {
  if (availableSpots === 0) {
    return <Badge variant="full">Full</Badge>;
  } else if (availableSpots <= totalSpots * 0.2) { // 20% or less spots available
    return <Badge variant="limited">Limited Spots</Badge>;
  } else {
    return <Badge variant="available">Available</Badge>;
  }
}
