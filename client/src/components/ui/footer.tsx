import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@assets/voxzeal logo transparent.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and About */}
          <div className="col-span-2">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img
                  className="h-10 w-auto"
                  src={logo}
                  alt="VOXZEAL"
                />
              </div>
            </Link>
            <p className="mt-4 text-gray-300">
              VOXZEAL is a full-service agency providing comprehensive digital solutions to help businesses thrive in today's competitive market.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/">
                  <div className="text-gray-300 hover:text-white cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <div className="text-gray-300 hover:text-white cursor-pointer">Services</div>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <div className="text-gray-300 hover:text-white cursor-pointer">Portfolio</div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-gray-300 hover:text-white cursor-pointer">About</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-gray-300 hover:text-white cursor-pointer">Contact</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services/tech-virtual-assistant">
                  <div className="text-gray-300 hover:text-white cursor-pointer">
                    Tech Virtual Assistant
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services/ecommerce-support">
                  <div className="text-gray-300 hover:text-white cursor-pointer">
                    Ecommerce Support
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services/email-marketing">
                  <div className="text-gray-300 hover:text-white cursor-pointer">
                    Email Marketing
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services/web-development">
                  <div className="text-gray-300 hover:text-white cursor-pointer">
                    Web Development
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services/social-media-management">
                  <div className="text-gray-300 hover:text-white cursor-pointer">
                    Social Media Management
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3 text-gray-300">
                  info@voxzeal.com
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3 text-gray-300">
                  (123) 456-7890
                </div>
              </li>
              <li>
                <a 
                  href="https://calendly.com/voxzeal/book-a-call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  Book a Consultation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-base text-gray-400">
            © {currentYear} VOXZEAL. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy-policy">
              <div className="text-gray-400 hover:text-white cursor-pointer">
                Privacy Policy
              </div>
            </Link>
            <Link href="/terms-of-service">
              <div className="text-gray-400 hover:text-white cursor-pointer">
                Terms of Service
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}