"use client";

import { useState } from 'react';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import MainLayout from '@/components/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | RiderApp',
  description: 'Get in touch with RiderApp for inquiries, support, or to become a driver or customer.',
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<string>('general');
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to learn more about RiderApp? We're here to help!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="general" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="driver">Become a Driver</TabsTrigger>
                    <TabsTrigger value="customer">Use Our Service</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general">
                    <ContactForm defaultType="general" />
                  </TabsContent>
                  <TabsContent value="driver">
                    <ContactForm defaultType="driver" />
                  </TabsContent>
                  <TabsContent value="customer">
                    <ContactForm defaultType="customer" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us directly using the information below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      123 RiderApp Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      contact@riderapp.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>
                  Common questions about our service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">How do I become a driver?</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the driver application form and our team will review your information and get back to you within 48 hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Is RiderApp available in my city?</h3>
                  <p className="text-sm text-muted-foreground">
                    We're currently expanding to major cities across the US. Contact us to check availability in your area.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How do I request a ride?</h3>
                  <p className="text-sm text-muted-foreground">
                    Download our app, create an account, and you can start requesting rides immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 