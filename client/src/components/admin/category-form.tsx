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
import { insertCategorySchema, Category } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extend the insert schema with validation
const categoryFormSchema = insertCategorySchema;

// Create a type for the form values
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize default values
  const defaultValues: CategoryFormValues = initialData
    ? { ...initialData }
    : {
        name: "",
        color: "#3B82F6", // Default blue
        textColor: "#FFFFFF", // Default white
        bgColor: "#EBF5FF", // Default light blue
      };

  // Setup form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  // Setup mutation
  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (initialData) {
        // Update existing category
        const res = await apiRequest(
          "PUT", 
          `/api/admin/categories/${initialData.id}`, 
          values
        );
        return await res.json();
      } else {
        // Create new category
        const res = await apiRequest("POST", "/api/admin/categories", values);
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Category updated" : "Category created",
        description: initialData
          ? "Your category has been updated successfully!"
          : "Your category has been created successfully!",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      
      // Reset form if creating new category
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
  function onSubmit(values: CategoryFormValues) {
    mutation.mutate(values);
  }

  // Preview style for the category badge
  const previewStyle = {
    backgroundColor: form.watch("bgColor"),
    color: form.watch("textColor"),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Art & Crafts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Color</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input type="color" {...field} className="w-12 h-8 p-1" />
                  </FormControl>
                  <Input 
                    type="text" 
                    value={field.value} 
                    onChange={field.onChange}
                    className="flex-1"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input type="color" {...field} className="w-12 h-8 p-1" />
                  </FormControl>
                  <Input 
                    type="text" 
                    value={field.value} 
                    onChange={field.onChange}
                    className="flex-1"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input type="color" {...field} className="w-12 h-8 p-1" />
                  </FormControl>
                  <Input 
                    type="text" 
                    value={field.value} 
                    onChange={field.onChange}
                    className="flex-1"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div 
            className="inline-block px-3 py-1 rounded-full font-medium text-sm"
            style={previewStyle}
          >
            {form.watch("name") || "Category"}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}
