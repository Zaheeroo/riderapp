import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCustomers, dummyCommunication } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerUX() {
  const customer = dummyCustomers[0]; // Using first customer as example
  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "customer"))
    .slice(0, 3); // Only show 3 most recent chats

  return (
    <DashboardLayout userType="customer" showMobileHeader={false}>
      {/* Main Container with max width for better mobile readability */}
      <div className="max-w-lg mx-auto px-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back!</h2>
          <p className="text-lg font-medium text-primary mb-1">{customer.name}</p>
          <p className="text-muted-foreground text-sm mb-4">Ready for your next adventure?</p>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/customer/book">
              <Plus className="mr-2 h-4 w-4" />
              Book a Ride
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Total Rides</p>
              <p className="text-2xl font-bold text-primary">{customer.pastRides.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Rating</p>
              <p className="text-2xl font-bold text-primary">4.9</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Chats */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                <CardDescription>Stay in touch with your drivers</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link href="/customer/messages">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentChats.map((chat) => {
                const otherParticipant = chat.participants.find(p => p.type !== "customer");
                const lastMessage = dummyCommunication.messages
                  .filter(m => m.conversation_id === chat.id)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                return (
                  <Link 
                    key={chat.id} 
                    href={`/customer/messages?chat=${chat.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={otherParticipant?.avatar} />
                      <AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{otherParticipant?.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(lastMessage?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage?.message}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* My Rides Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Rides</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/customer/rides">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Upcoming Ride Preview */}
          {customer.upcomingRides.slice(0, 1).map((ride) => (
            <Card key={ride.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <Badge 
                  className="absolute top-2 right-2"
                  variant={ride.status === "Confirmed" ? "default" : "secondary"}
                >
                  {ride.status}
                </Badge>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <p className="font-medium line-clamp-1">
                      {ride.from} → {ride.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{ride.date} at {ride.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback>{ride.driver[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ride.driver}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Car className="mr-1 h-4 w-4" />
                      <span>Toyota Fortuner</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="text-lg font-bold">${ride.price}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Recent Past Ride */}
          {customer.pastRides.slice(0, 1).map((ride) => (
            <Card key={ride.id} className="relative overflow-hidden bg-muted/30">
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <p className="font-medium line-clamp-1">
                      {ride.from} → {ride.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{ride.date} at {ride.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-muted">
                    <AvatarFallback>{ride.driver[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ride.driver}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="text-lg font-bold">${ride.price}</p>
                  <Button size="sm" variant="outline">Book Similar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 