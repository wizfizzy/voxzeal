import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/voxzeal logo transparent.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
        <div className="flex justify-between items-center h-20">
          {/* Logo on left */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img
                  className="h-16 w-auto"
                  src={logo}
                  alt="VOXZEAL"
                />
              </div>
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1">
            <nav className="flex space-x-12">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`inline-flex items-center px-2 pt-1 border-b-2 text-base font-medium cursor-pointer ${
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
          </div>

          {/* Book a call button - right */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://calendly.com/voxzeal/book-a-call" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button>Book a Call</Button>
            </a>
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