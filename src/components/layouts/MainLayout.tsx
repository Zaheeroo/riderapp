"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  User, 
  Menu, 
  X, 
  Home, 
  Phone, 
  Info, 
  LogIn,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Get user role
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          setUserRole(data.role);
        }
      }
      
      setLoading(false);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Get user role
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (!error && data) {
            setUserRole(data.role);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
    { href: '/about', label: 'About', icon: <Info className="h-5 w-5 mr-2" /> },
    { href: '/contact', label: 'Contact', icon: <Phone className="h-5 w-5 mr-2" /> },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Car className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">RiderApp</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      {userRole === 'admin' && (
                        <Link
                          href="/admin"
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            pathname.startsWith('/admin')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Admin
                        </Link>
                      )}
                      
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="flex items-center"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button variant="default" className="flex items-center">
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              
              {!loading && (
                <>
                  {user ? (
                    <>
                      {userRole === 'admin' && (
                        <Link
                          href="/admin"
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            pathname.startsWith('/admin')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Admin
                        </Link>
                      )}
                      
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full justify-start px-3 py-2"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow">{children}</main>
      
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">RiderApp</span>
              </div>
              <p className="text-gray-400">
                The modern solution for ride-sharing and transportation services.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic text-gray-400 space-y-2">
                <p>123 RiderApp Street</p>
                <p>San Francisco, CA 94103</p>
                <p>Email: contact@riderapp.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RiderApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 