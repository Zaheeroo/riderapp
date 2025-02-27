'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg mb-8">
            We apologize for the inconvenience. Please try again later.
          </p>
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

// These are required for Next.js error handling
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;
export const fetchCache = 'only-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto'; 