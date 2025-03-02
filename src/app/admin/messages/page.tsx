"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ConversationsList } from "@/components/ui/conversations-list";
import { Chat } from "@/components/ui/chat";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

// In a real app, this would come from authentication
const DUMMY_USER_ID = "admin-1";

export default function AdminMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();
  const { isMobile } = useDeviceType();

  return (
    <DashboardLayout userType="admin">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ConversationsList
              userType="admin"
              userId={DUMMY_USER_ID}
              onSelectConversation={setSelectedConversationId}
              selectedConversationId={selectedConversationId}
            />
          </div>
          <div className="md:col-span-2">
            {selectedConversationId ? (
              <Chat
                conversationId={selectedConversationId}
                userType="admin"
                userId={DUMMY_USER_ID}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4 mb-8",
          isMobile ? "grid-cols-2" : "grid-cols-3"
        )}>
          <Card className="flex-shrink-0">
            {/* ... existing code ... */}
          </Card>

          <Card className="flex-shrink-0">
            {/* ... existing code ... */}
          </Card>

          <Card className="flex-shrink-0">
            {/* ... existing code ... */}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 