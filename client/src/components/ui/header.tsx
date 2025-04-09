import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/voxzeal logo transparent.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, logoutMutation } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <img
                  className="h-14 w-auto"
                  src={logo}
                  alt="VOXZEAL"
                />
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer ${
                      isActive(item.path)
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
            <div className="flex items-center">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <div className="text-gray-600 hover:text-gray-900 mr-4 cursor-pointer">
                        Admin
                      </div>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
              )}
              <a 
                href="https://calendly.com/voxzeal/book-a-call" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-4"
              >
                <Button>Book a Call</Button>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer ${
                    isActive(item.path)
                      ? "border-primary text-primary-dark bg-primary-light"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </div>
              </Link>
            ))}

            {user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin">
                    <div
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 cursor-pointer"
                      onClick={closeMenu}
                    >
                      Admin
                    </div>
                  </Link>
                )}
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link href="/auth">
                <div
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 cursor-pointer"
                  onClick={closeMenu}
                >
                  Login
                </div>
              </Link>
            )}
            
            <a 
              href="https://calendly.com/voxzeal/book-a-call" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary-dark bg-primary-light cursor-pointer"
              onClick={closeMenu}
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </header>
  );
}