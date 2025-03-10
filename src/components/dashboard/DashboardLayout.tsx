"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Home, LogOut, Menu, Users, Calendar, X, MessageSquare, ArrowLeft, ClipboardList, Bell, BellOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "../../../contexts";
import { useNotifications } from "../../../contexts/NotificationContext";
import Cookies from 'js-cookie';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "admin" | "driver" | "customer";
  showMobileHeader?: boolean;
}

// Define the navigation item type
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function DashboardLayout({ children, userType, showMobileHeader = true }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { pendingRequests, soundEnabled, toggleSound } = useNotifications();

  // Check if current page is a subpage
  const isSubpage = pathname?.split('/').length > 2;

  // Get parent route for back navigation
  const parentRoute = pathname?.split('/').slice(0, -1).join('/');

  const navigation: Record<string, NavigationItem[]> = {
    admin: [
      { name: "Dashboard", href: "/admin", icon: Home },
      { name: "Rides", href: "/admin/rides", icon: Calendar },
      { name: "Drivers", href: "/admin/drivers", icon: Car },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Messages", href: "/admin/messages", icon: MessageSquare },
      { name: "Contact Requests", href: "/admin/contact-requests", icon: ClipboardList, badge: pendingRequests },
    ],
    driver: [
      { name: "Dashboard", href: "/driver", icon: Home },
      { name: "My Rides", href: "/driver/rides", icon: Car },
      { name: "Earnings", href: "/driver/earnings", icon: Users },
      { name: "Messages", href: "/driver/messages", icon: MessageSquare },
    ],
    customer: [
      { name: "Dashboard", href: "/customer", icon: Home },
      { name: "My Rides", href: "/customer/rides", icon: Users },
      { name: "Messages", href: "/customer/messages", icon: MessageSquare },
    ],
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear role from localStorage
      localStorage.removeItem('userRole');
      
      // Clear role cookie
      Cookies.remove('userRole', { path: '/' });
      
      // Call Supabase signOut
      await signOut();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Image
              src="/logo.svg"
              alt="Jaco Rides Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation[userType].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-x-3">
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                {userType === 'admin' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-x-3 mb-2"
                    onClick={toggleSound}
                  >
                    {soundEnabled ? (
                      <>
                        <Bell className="h-6 w-6 shrink-0" />
                        Notifications On
                      </>
                    ) : (
                      <>
                        <BellOff className="h-6 w-6 shrink-0" />
                        Notifications Off
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className={cn(
        "transition-padding duration-300 ease-in-out",
        "px-4 md:px-8",
        "md:pl-80" // 72px sidebar + 8px padding
      )}>
        {showMobileHeader && (
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {isSubpage ? (
              <Button 
                variant="ghost" 
                className="-m-2.5 p-2.5 text-foreground"
                onClick={() => router.push(parentRoute)}
              >
                <span className="sr-only">Go back</span>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="md:hidden -m-2.5 p-2.5 text-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {userType === 'admin' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSound}
                    className="hidden md:flex"
                    title={soundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
                  >
                    {soundEnabled ? (
                      <Bell className="h-5 w-5" />
                    ) : (
                      <BellOff className="h-5 w-5" />
                    )}
                  </Button>
                )}
                <ThemeToggle />
                {/* Profile dropdown can be added here */}
              </div>
            </div>
          </div>
        )}

        <div className="py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 