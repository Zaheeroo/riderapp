"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ConversationsList } from "@/components/ui/conversations-list";
import { Chat } from "@/components/ui/chat";

// In a real app, this would come from authentication
const DUMMY_USER_ID = "admin-1";

export default function AdminMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();

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
      </div>
    </DashboardLayout>
  );
} 