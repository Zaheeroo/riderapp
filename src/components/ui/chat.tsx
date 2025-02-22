"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { dummyCommunication } from "@/data/dummy";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface ChatProps {
  conversationId: string;
  userType: "customer" | "driver" | "admin";
  userId: string;
}

export function Chat({ conversationId, userType, userId }: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  
  const conversation = dummyCommunication.conversations.find(
    (conv) => conv.id === conversationId
  );

  const messages = dummyCommunication.messages.filter(
    (msg) => msg.conversation_id === conversationId
  );

  const otherParticipant = conversation?.participants.find(
    (p) => p.id !== userId
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  if (!conversation || !otherParticipant) {
    return (
      <Card className="w-full h-[600px]">
        <CardContent className="p-6 text-center text-muted-foreground">
          No conversation selected
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherParticipant.avatar} />
            <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{otherParticipant.name}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {otherParticipant.type}
            </p>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === userId;
            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 