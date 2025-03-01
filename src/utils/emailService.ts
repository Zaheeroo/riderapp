/**
 * Email service utility for sending emails
 * This is a simple implementation that logs emails to the console
 * In a production environment, you would integrate with a real email service
 */

import { Resend } from 'resend';

// Define a consistent return type for email operations
export interface EmailResult {
  id: string;
  from: string;
  to: string[];
  created_at: string;
  error?: string;
}

// Initialize Resend with API key if available
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn('RESEND_API_KEY is not defined in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Resend:', error);
}

// Default sender email
const DEFAULT_FROM = 'noreply@jacorides.com';

/**
 * Sends a welcome email to a new user with their login credentials
 * 
 * @param to - Recipient email address
 * @param name - Recipient's name
 * @param password - Generated password
 * @param userType - Type of user (driver or customer)
 * @returns Promise with the result of the email sending operation
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  password: string,
  userType: string
): Promise<EmailResult> {
  try {
    // Capitalize the first letter of the user type
    const capitalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1);
    
    // Create email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://jacorides.com/logo.svg" alt="Jaco Rides Logo" style="max-width: 150px;">
        </div>
        
        <h1 style="color: #333; text-align: center;">Welcome to Jaco Rides!</h1>
        
        <p>Hello ${name},</p>
        
        <p>Great news! Your contact request has been approved, and we've created your ${capitalizedUserType} account.</p>
        
        <p>You can now log in to our platform using the following credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p><strong>Important:</strong> For security reasons, we recommend changing your password after your first login.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://jacorides.com/login" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log In Now</a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Thank you for choosing Jaco Rides!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Jaco Rides. All rights reserved.</p>
        </div>
      </div>
    `;
    
    // If Resend is available, use it to send the email
    if (resend) {
      console.log('Using Resend API to send email');
      try {
        const resendResult = await resend.emails.send({
          from: DEFAULT_FROM,
          to,
          subject: `Welcome to Jaco Rides - Your Account is Ready`,
          html: emailHtml,
        });
        
        // Convert Resend result to our consistent EmailResult format
        // Handle both success and error cases from Resend
        if ('error' in resendResult && resendResult.error) {
          return {
            id: 'resend-api-error',
            from: DEFAULT_FROM,
            to: [to],
            created_at: new Date().toISOString(),
            error: typeof resendResult.error === 'string' 
              ? resendResult.error 
              : JSON.stringify(resendResult.error)
          };
        } else {
          return {
            // For successful responses, Resend provides an id
            id: 'data' in resendResult && resendResult.data?.id 
              ? resendResult.data.id 
              : 'unknown-id',
            from: DEFAULT_FROM,
            to: [to],
            created_at: new Date().toISOString()
          };
        }
      } catch (resendError) {
        console.error('Resend API error:', resendError);
        return {
          id: 'resend-error',
          from: DEFAULT_FROM,
          to: [to],
          created_at: new Date().toISOString(),
          error: String(resendError)
        };
      }
    } else {
      // Fallback: Log the email content for debugging
      console.log('Email service not available. Would have sent:');
      console.log(`To: ${to}`);
      console.log(`Subject: Welcome to Jaco Rides - Your Account is Ready`);
      console.log(`Password for user: ${password}`);
      
      // Return a mock successful result
      return {
        id: 'mock-email-id',
        from: DEFAULT_FROM,
        to: [to],
        created_at: new Date().toISOString(),
        error: 'RESEND_API_KEY not configured. Email not actually sent.'
      };
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw the error, just log it and return a result with error info
    return {
      id: 'error-email-id',
      from: DEFAULT_FROM,
      to: [to],
      created_at: new Date().toISOString(),
      error: String(error),
    };
  }
} 