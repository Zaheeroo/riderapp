"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, Search, Check, X, User, Calendar, Home, Car, Users, MessageSquare, ClipboardList, Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "../../../../contexts/NotificationContext";
import { useAuth } from "../../../../contexts";

// Custom hook for device detection
function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    // Initial check
    checkDeviceType();

    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return { isMobile };
}

type ContactRequest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function ContactRequestsPage() {
  const { isMobile } = useDeviceType();
  const router = useRouter();
  const { toast } = useToast();
  const { soundEnabled, toggleSound, testSound } = useNotifications();
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const previousRequestCountRef = useRef(0);
  const { user } = useAuth();

  // Fetch contact requests
  const fetchContactRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch contact requests
      console.log('Fetching contact requests...');
      const response = await fetch('/api/admin/contact-requests');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error(errorData.error || 'Failed to fetch contact requests');
      }
      
      const data = await response.json();
      console.log('Contact requests data:', data);
      
      if (data.contactRequests && Array.isArray(data.contactRequests)) {
        // Update state with new data
        setContactRequests(data.contactRequests);
      } else {
        console.warn('No contact requests found or invalid format:', data);
        // For demo purposes, set some dummy data
        setContactRequests([
          {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            phone: "+1 234-567-8900",
            user_type: "customer",
            message: "I'm planning a trip to Costa Rica next month and would like to use your service.",
            status: "Pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Maria Rodriguez",
            email: "maria@example.com",
            phone: "+506 8888-2222",
            user_type: "driver",
            message: "I have 5 years of experience as a driver and would like to join your platform.",
            status: "Approved",
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            name: "Carlos Martinez",
            email: "carlos@example.com",
            phone: "+506 8888-3333",
            user_type: "driver",
            message: "I own a 2022 Toyota Fortuner and would like to work with your company.",
            status: "Rejected",
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updated_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error fetching contact requests:', error);
      setError(error.message || 'Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Fetch contact requests immediately
    fetchContactRequests();
  }, [user]);

  // Filter contact requests based on search term
  const filteredRequests = contactRequests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.user_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view details
  const handleViewDetails = (request: ContactRequest) => {
    setSelectedRequest(request);
    setAdminNotes('');
    setShowDetailsModal(true);
  };

  // Handle approve request
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      console.log('Approving request:', selectedRequest.id);
      
      // Call API to approve the request and create user account
      const response = await fetch('/api/admin/contact-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: 'approved',
          adminNotes: adminNotes || '',
          createAccount: true,
          userType: selectedRequest.user_type
        }),
      });
      
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      if (!response.ok) {
        console.error('API error response:', responseData);
        throw new Error(responseData.error || 'Failed to update contact request');
      }
      
      // Close the modal
      setShowDetailsModal(false);
      setSelectedRequest(null);
      
      // Fetch fresh data instead of updating local state
      fetchContactRequests();
      
      // Show success toast
      toast({
        title: "Request Approved",
        description: `${selectedRequest.name}'s request has been approved and their account has been created.`,
        variant: "success",
      });
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to approve request',
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle reject request
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      console.log('Rejecting request:', selectedRequest.id);
      
      // Call API to reject the request
      const response = await fetch('/api/admin/contact-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: 'rejected',
          adminNotes: adminNotes || '',
          createAccount: false
        }),
      });
      
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      if (!response.ok) {
        console.error('API error response:', responseData);
        throw new Error(responseData.error || 'Failed to update contact request');
      }
      
      // Close the modal
      setShowDetailsModal(false);
      setSelectedRequest(null);
      
      // Fetch fresh data instead of updating local state
      fetchContactRequests();
      
      // Show success toast
      toast({
        title: "Request Rejected",
        description: `${selectedRequest.name}'s request has been rejected.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to reject request',
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-500/10 text-green-500";
      case 'rejected':
        return "bg-red-500/10 text-red-500";
      case 'pending':
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contact Requests</h2>
            <p className="text-muted-foreground">
              Manage account requests from potential customers and drivers
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSound}
              title={soundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
            >
              {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            {soundEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={testSound}
                title="Test notification sound"
                className={isMobile ? "text-xs px-2" : ""}
              >
                Test Sound
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchContactRequests}
              disabled={loading}
              className={isMobile ? "text-xs px-2" : ""}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4 mb-8",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{contactRequests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {contactRequests.filter(req => req.status === "New").length} new requests
                  </p>
                  <p className="text-xs text-green-500">+5% from last month</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">
                    {Math.round((contactRequests.filter(req => req.status === "Responded").length / contactRequests.length) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contactRequests.filter(req => req.status === "Responded").length} responded
                  </p>
                  <p className="text-xs text-green-500">+2% from last week</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">4.5 hrs</div>
                  <p className="text-xs text-muted-foreground">
                    For the last 30 days
                  </p>
                  <p className="text-xs text-green-500">-15% from last month</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">32%</div>
                  <p className="text-xs text-muted-foreground">
                    Requests to customers
                  </p>
                  <p className="text-xs text-green-500">+5% from last month</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Contact Requests List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Account Requests</CardTitle>
                <CardDescription>
                  {loading ? (
                    <span className="text-blue-500">Refreshing data...</span>
                  ) : (
                    "Review and manage account requests"
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <p>Loading contact requests...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <p>No contact requests found.</p>
              </div>
            ) : (
              <ScrollArea className={cn(
                "overflow-auto",
                isMobile ? "h-[400px]" : "h-[600px]"
              )}>
                {isMobile ? (
                  // Mobile view - Card layout
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{request.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {request.email}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {request.phone}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <User className="mr-1 h-3 w-3" />
                              <span className="capitalize">{request.user_type}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {format(new Date(request.created_at), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getStatusBadgeColor(request.status)
                          )}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop view - Table layout
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="font-medium">{request.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-xs">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {request.email}
                                </div>
                                <div className="flex items-center text-xs">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {request.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="capitalize">{request.user_type}</div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(request.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                getStatusBadgeColor(request.status)
                              )}>
                                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDetails(request)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className={cn(
          "sm:max-w-md",
          isMobile ? "w-[95%] max-h-[90vh] overflow-y-auto" : ""
        )}>
          <DialogHeader>
            <DialogTitle>Contact Request Details</DialogTitle>
            <DialogDescription>Review the request details and take action</DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-sm capitalize">{selectedRequest.user_type}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{selectedRequest.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">{selectedRequest.phone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Message</p>
                <p className="text-sm whitespace-pre-wrap">{selectedRequest.message || 'No message provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Date Submitted</p>
                <p className="text-sm">{format(new Date(selectedRequest.created_at), 'MMMM d, yyyy h:mm a')}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getStatusBadgeColor(selectedRequest.status)
                )}>
                  {selectedRequest.status?.charAt(0).toUpperCase() + selectedRequest.status?.slice(1).toLowerCase()}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea 
                  placeholder="Add notes about this request (for internal use only)" 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className={cn(
            "flex",
            isMobile ? "flex-col space-y-2" : "justify-between"
          )}>
            {selectedRequest?.status === 'Pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={processingAction}
                  className={isMobile ? "w-full" : ""}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={handleApprove}
                  disabled={processingAction}
                  className={isMobile ? "w-full" : ""}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedRequest?.status !== 'Pending' && (
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsModal(false)}
                className={isMobile ? "w-full" : "ml-auto"}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 