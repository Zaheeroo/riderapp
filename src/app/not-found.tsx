import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

// These are required for Next.js error handling
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;
export const fetchCache = 'only-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto'; 