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
import { insertClassSchema, Class, Category, Location } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extend the insert schema with validation
const classFormSchema = insertClassSchema
  .extend({
    // Override price to be a string for the form, we'll convert it to number
    price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  })
  .refine((data) => Number(data.totalSpots) >= Number(data.availableSpots), {
    message: "Available spots cannot exceed total spots",
    path: ["availableSpots"],
  });

// Create a type for the form values
type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  categories: Category[];
  locations: Location[];
  initialData?: Class;
  onSuccess?: () => void;
}

export function ClassForm({ 
  categories, 
  locations, 
  initialData,
  onSuccess
}: ClassFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize default values
  const defaultValues: Partial<ClassFormValues> = initialData
    ? {
        ...initialData,
        price: (initialData.price / 100).toFixed(2), // Convert cents to dollars for display
        categoryId: initialData.categoryId.toString(),
        locationId: initialData.locationId.toString(),
      }
    : {
        title: "",
        description: "",
        price: "",
        priceUnit: "per person",
        totalSpots: "10",
        availableSpots: "10",
        imageUrl: "",
        date: "",
        time: "",
        categoryId: "",
        locationId: "",
      };

  // Setup form
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues,
  });

  // Setup mutation
  const mutation = useMutation({
    mutationFn: async (values: ClassFormValues) => {
      // Convert string values to the correct types
      const processedValues = {
        ...values,
        price: Math.round(parseFloat(values.price) * 100), // Convert dollars to cents
        totalSpots: Number(values.totalSpots),
        availableSpots: Number(values.availableSpots),
        categoryId: Number(values.categoryId),
        locationId: Number(values.locationId),
      };

      if (initialData) {
        // Update existing class
        const res = await apiRequest(
          "PUT", 
          `/api/admin/classes/${initialData.id}`, 
          processedValues
        );
        return await res.json();
      } else {
        // Create new class
        const res = await apiRequest("POST", "/api/admin/classes", processedValues);
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Class updated" : "Class created",
        description: initialData
          ? "Your class has been updated successfully!"
          : "Your class has been created successfully!",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      
      // Reset form if creating new class
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
  function onSubmit(values: ClassFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Class title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your class..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="per person">Per person</SelectItem>
                    <SelectItem value="per session">Per session</SelectItem>
                    <SelectItem value="per class">Per class</SelectItem>
                    <SelectItem value="per hour">Per hour</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Spots</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Spots</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mon, June 15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 6:00 PM - 8:00 PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : initialData ? "Update Class" : "Create Class"}
        </Button>
      </form>
    </Form>
  );
}
