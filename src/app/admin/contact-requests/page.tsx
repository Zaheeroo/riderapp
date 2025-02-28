"use client";

import { useEffect, useState } from "react";
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
import { Mail, Phone, Search, Check, X, User, Calendar } from "lucide-react";
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
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch contact requests
  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // For now, we'll use a mock implementation
        const response = await fetch('/api/admin/contact-requests');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact requests');
        }
        
        const data = await response.json();
        setContactRequests(data.contactRequests || []);
      } catch (error: any) {
        console.error('Error fetching contact requests:', error);
        setError(error.message || 'Failed to load contact requests');
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
      } finally {
        setLoading(false);
      }
    };

    fetchContactRequests();
  }, []);

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
      // In a real app, you would call your API to approve the request
      // For now, we'll just update the local state
      const updatedRequests = contactRequests.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'Approved', updated_at: new Date().toISOString() } : req
      );
      setContactRequests(updatedRequests);
      
      // Close the modal
      setShowDetailsModal(false);
      setSelectedRequest(null);
      
      // Show success message
      alert('Contact request approved successfully!');
    } catch (error: any) {
      console.error('Error approving request:', error);
      alert('Failed to approve request: ' + (error.message || 'Unknown error'));
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle reject request
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      // In a real app, you would call your API to reject the request
      // For now, we'll just update the local state
      const updatedRequests = contactRequests.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'Rejected', updated_at: new Date().toISOString() } : req
      );
      setContactRequests(updatedRequests);
      
      // Close the modal
      setShowDetailsModal(false);
      setSelectedRequest(null);
      
      // Show success message
      alert('Contact request rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request: ' + (error.message || 'Unknown error'));
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
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search requests..."
              className="w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-3"
        )}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{contactRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  {contactRequests.filter(r => r.status === 'Pending').length} pending
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customer Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {contactRequests.filter(r => r.user_type === 'customer').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {contactRequests.filter(r => r.user_type === 'customer' && r.status === 'Pending').length} pending
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Driver Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {contactRequests.filter(r => r.user_type === 'driver').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {contactRequests.filter(r => r.user_type === 'driver' && r.status === 'Pending').length} pending
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Requests List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Account Requests</CardTitle>
                <CardDescription>Review and manage account requests</CardDescription>
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
                isMobile ? "max-h-[300px]" : "max-h-[400px]"
              )}>
                {isMobile ? (
                  // Mobile view - Card layout
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
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
                              {request.user_type === 'customer' ? 'Customer' : 'Driver'}
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
                            {request.status}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
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
                                {request.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
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
        <DialogContent className="sm:max-w-md">
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
                  {selectedRequest.status}
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
          
          <DialogFooter className="flex justify-between">
            {selectedRequest?.status === 'Pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={processingAction}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={handleApprove}
                  disabled={processingAction}
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
                className="ml-auto"
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