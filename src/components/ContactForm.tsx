import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  defaultType?: 'driver' | 'customer' | 'general';
  className?: string;
}

export default function ContactForm({ defaultType = 'general', className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    requestType: defaultType,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, requestType: value as 'driver' | 'customer' | 'general' }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact request');
      }
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        requestType: defaultType,
      });
      
      setSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Thank you for your message! We'll get back to you soon.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
        />
      </div>
      
      <div className="space-y-2">
        <Label>I'm interested in: *</Label>
        <RadioGroup 
          value={formData.requestType} 
          onValueChange={handleRadioChange}
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="driver" id="driver" />
            <Label htmlFor="driver" className="cursor-pointer">Becoming a driver</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customer" id="customer" />
            <Label htmlFor="customer" className="cursor-pointer">Using the service</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general" className="cursor-pointer">General inquiry</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={5}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Send Message'}
      </Button>
    </form>
  );
} 