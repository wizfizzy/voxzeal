import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Settings } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">ClassFinder</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/" className={`${location === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Explore
              </Link>
              <Link href="/classes" className={`${location === '/classes' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                All Classes
              </Link>
              <Link href="/contact" className={`${location === '/contact' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <>
                    <span className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                      Hello, {user.username}
                    </span>
                    {user.isAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Settings className="h-4 w-4 mr-1" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      onClick={() => logoutMutation.mutate()} 
                      variant="ghost" 
                      size="sm"
                      disabled={logoutMutation.isPending}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button size="sm" className="ml-2">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
