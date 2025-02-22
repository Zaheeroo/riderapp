"use client";

import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { dummyCommunication, dummyCustomersExtended, dummyDrivers } from "@/data/dummy";
import { cn } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface ConversationsListProps {
  userType: "customer" | "driver" | "admin";
  userId: string;
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationsList({
  userType,
  userId,
  onSelectConversation,
  selectedConversationId,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const userConversations = dummyCommunication.conversations.filter((conv) =>
    conv.participants.some((p) => p.id === userId)
  );

  const filteredConversations = userConversations.filter((conv) => {
    const otherParticipant = conv.participants.find((p) => p.id !== userId);
    return otherParticipant?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // Get available users to chat with based on user type
  const getAvailableUsers = () => {
    switch (userType) {
      case "admin":
        return [
          ...dummyDrivers.map(driver => ({
            id: `driver-${driver.id}`,
            name: driver.name,
            type: "driver"
          })),
          ...dummyCustomersExtended.map(customer => ({
            id: `customer-${customer.id}`,
            name: customer.name,
            type: "customer"
          }))
        ];
      case "driver":
        return [
          { id: "admin-1", name: "Admin", type: "admin" },
          ...dummyCustomersExtended.map(customer => ({
            id: `customer-${customer.id}`,
            name: customer.name,
            type: "customer"
          }))
        ];
      case "customer":
        return [
          { id: "admin-1", name: "Admin", type: "admin" },
          ...dummyDrivers.map(driver => ({
            id: `driver-${driver.id}`,
            name: driver.name,
            type: "driver"
          }))
        ];
      default:
        return [];
    }
  };

  const handleStartChat = () => {
    if (!selectedUser) return;
    // In a real app, this would create a new conversation in the backend
    console.log("Starting chat with:", selectedUser);
    // For now, we'll just close the dialog
    setSelectedUser("");
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <div className="p-4 border-b space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
              <DialogDescription>
                Choose who you want to chat with
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableUsers().map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="w-full" 
                onClick={handleStartChat}
                disabled={!selectedUser}
              >
                Start Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {filteredConversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p.id !== userId
            );
            if (!otherParticipant) return null;

            const lastMessage = dummyCommunication.messages
              .filter((msg) => msg.conversation_id === conversation.id)
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0];

            return (
              <button
                key={conversation.id}
                className={cn(
                  "w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors",
                  "text-left",
                  selectedConversationId === conversation.id && "bg-muted"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <Avatar>
                  <AvatarImage src={otherParticipant.avatar} />
                  <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {otherParticipant.name}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(lastMessage.created_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage.message}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
} 