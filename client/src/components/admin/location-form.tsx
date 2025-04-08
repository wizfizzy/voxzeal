import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertLocationSchema, Location } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extend the insert schema with validation
const locationFormSchema = insertLocationSchema;

// Create a type for the form values
type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  initialData?: Location;
  onSuccess?: () => void;
}

export function LocationForm({ initialData, onSuccess }: LocationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize default values
  const defaultValues: LocationFormValues = initialData
    ? { ...initialData }
    : {
        name: "",
        address: "",
      };

  // Setup form
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
  });

  // Setup mutation
  const mutation = useMutation({
    mutationFn: async (values: LocationFormValues) => {
      if (initialData) {
        // Update existing location
        const res = await apiRequest(
          "PUT", 
          `/api/admin/locations/${initialData.id}`, 
          values
        );
        return await res.json();
      } else {
        // Create new location
        const res = await apiRequest("POST", "/api/admin/locations", values);
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Location updated" : "Location created",
        description: initialData
          ? "Your location has been updated successfully!"
          : "Your location has been created successfully!",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      
      // Reset form if creating new location
      if (!initialData) {
        form.reset(defaultValues);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit handler
  function onSubmit(values: LocationFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown Studio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full address..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : initialData ? "Update Location" : "Create Location"}
        </Button>
      </form>
    </Form>
  );
}
