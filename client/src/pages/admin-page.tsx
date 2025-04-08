import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClassForm } from "@/components/admin/class-form";
import { CategoryForm } from "@/components/admin/category-form";
import { LocationForm } from "@/components/admin/location-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { ClassWithDetails, Category, Location, Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, MessageCircle, LayoutGrid, Tag, MapPin, Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("classes");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  
  // Edit states
  const [editingClass, setEditingClass] = useState<ClassWithDetails | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  // Fetch data
  const { data: classes = [], isLoading: isLoadingClasses } = useQuery<ClassWithDetails[]>({
    queryKey: ["/api/classes"],
  });
  
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });
  
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
  });
  
  // Filter based on search query
  const filteredClasses = classes.filter(cls => 
    cls.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle delete class
  const handleDeleteClass = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/classes/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({
        title: "Class deleted",
        description: "The class has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle delete category
  const handleDeleteCategory = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/categories/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle delete location
  const handleDeleteLocation = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/locations/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({
        title: "Location deleted",
        description: "The location has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating availability
  const handleUpdateAvailability = async (classId: number, currentAvailable: number, totalSpots: number) => {
    try {
      const newAvailableSpots = window.prompt("Enter new available spots:", currentAvailable.toString());
      
      if (newAvailableSpots === null) return;
      
      const availableSpots = parseInt(newAvailableSpots);
      
      if (isNaN(availableSpots) || availableSpots < 0 || availableSpots > totalSpots) {
        toast({
          title: "Invalid value",
          description: `Please enter a number between 0 and ${totalSpots}.`,
          variant: "destructive",
        });
        return;
      }
      
      await apiRequest("PUT", `/api/admin/classes/${classId}/availability`, { availableSpots });
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      
      toast({
        title: "Availability updated",
        description: "The class availability has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle opening edit dialogs
  const openEditClassDialog = (classItem: ClassWithDetails) => {
    setEditingClass(classItem);
    setClassDialogOpen(true);
  };
  
  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };
  
  const openEditLocationDialog = (location: Location) => {
    setEditingLocation(location);
    setLocationDialogOpen(true);
  };
  
  // Handle closing dialogs
  const closeClassDialog = () => {
    setEditingClass(null);
    setClassDialogOpen(false);
  };
  
  const closeCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(false);
  };
  
  const closeLocationDialog = () => {
    setEditingLocation(null);
    setLocationDialogOpen(false);
  };
  
  // Format date for messages
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow flex-col justify-center items-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your classes, categories, and locations</p>
            </div>
            <div className="w-full md:w-64">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="classes" className="flex gap-2 items-center">
                <LayoutGrid className="h-4 w-4" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex gap-2 items-center">
                <Tag className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex gap-2 items-center">
                <MapPin className="h-4 w-4" />
                Locations
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex gap-2 items-center">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>
            
            {/* Classes Tab */}
            <TabsContent value="classes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Classes & Workshops</CardTitle>
                    <CardDescription>
                      Manage your classes and update their availability.
                    </CardDescription>
                  </div>
                  <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingClass(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingClass ? 'Edit Class' : 'Add New Class'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingClass 
                            ? 'Update the details of your class or workshop.' 
                            : 'Add a new class or workshop to your offerings.'}
                        </DialogDescription>
                      </DialogHeader>
                      <ClassForm 
                        categories={categories} 
                        locations={locations} 
                        initialData={editingClass || undefined}
                        onSuccess={closeClassDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingClasses ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredClasses.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      {searchQuery ? "No classes match your search." : "No classes available."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Availability</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClasses.map((classItem) => (
                            <tr key={classItem.id} className="border-b">
                              <td className="px-4 py-3 text-sm text-gray-900">{classItem.title}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className="inline-block px-2 py-1 text-xs rounded-full"
                                  style={{
                                    backgroundColor: classItem.category.bgColor,
                                    color: classItem.category.textColor,
                                  }}
                                >
                                  {classItem.category.name}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{classItem.location.name}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <AvailabilityBadge 
                                    availableSpots={classItem.availableSpots}
                                    totalSpots={classItem.totalSpots}
                                  />
                                  <button 
                                    onClick={() => handleUpdateAvailability(
                                      classItem.id, 
                                      classItem.availableSpots, 
                                      classItem.totalSpots
                                    )}
                                    className="text-gray-500 hover:text-gray-700 text-xs underline"
                                  >
                                    {classItem.availableSpots}/{classItem.totalSpots} (Update)
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditClassDialog(classItem)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Class</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{classItem.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteClass(classItem.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Manage categories for your classes and workshops.
                    </CardDescription>
                  </div>
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCategory(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCategory 
                            ? 'Update the details of your category.' 
                            : 'Add a new category for your classes.'}
                        </DialogDescription>
                      </DialogHeader>
                      <CategoryForm 
                        initialData={editingCategory || undefined}
                        onSuccess={closeCategoryDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      {searchQuery ? "No categories match your search." : "No categories available."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCategories.map((category) => (
                        <div 
                          key={category.id} 
                          className="border rounded-md p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: category.bgColor,
                                color: category.textColor,
                              }}
                            >
                              {category.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditCategoryDialog(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{category.name}"? This will affect all classes that use this category.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Locations Tab */}
            <TabsContent value="locations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>
                      Manage locations for your classes and workshops.
                    </CardDescription>
                  </div>
                  <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingLocation(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingLocation ? 'Edit Location' : 'Add New Location'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingLocation 
                            ? 'Update the details of your location.' 
                            : 'Add a new location for your classes.'}
                        </DialogDescription>
                      </DialogHeader>
                      <LocationForm 
                        initialData={editingLocation || undefined}
                        onSuccess={closeLocationDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingLocations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredLocations.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      {searchQuery ? "No locations match your search." : "No locations available."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredLocations.map((location) => (
                        <div 
                          key={location.id} 
                          className="border rounded-md p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{location.name}</h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditLocationDialog(location)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Location</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{location.name}"? This will affect all classes that use this location.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteLocation(location.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          {location.address && (
                            <p className="text-gray-500 text-sm">{location.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>
                    View messages from users who have contacted you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      {searchQuery ? "No messages match your search." : "No messages available."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className="border rounded-md p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{message.subject}</h3>
                              <p className="text-sm text-gray-500">
                                From: {message.firstName} {message.lastName} ({message.email})
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2 whitespace-pre-line">{message.message}</p>
                          <div className="mt-3">
                            <a 
                              href={`mailto:${message.email}`} 
                              className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              Reply via Email
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
