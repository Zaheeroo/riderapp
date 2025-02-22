"use client";

import { Bell } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { dummyCommunication } from "@/data/dummy";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationsProps {
  userType: "customer" | "driver" | "admin";
}

export function Notifications({ userType }: NotificationsProps) {
  const notifications = dummyCommunication.notifications[userType];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild>
              <Link
                href={notification.action_url}
                className={cn(
                  "flex flex-col gap-1 cursor-pointer",
                  !notification.read && "bg-muted/50"
                )}
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">
                  {notification.message}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 