import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables are missing');
    throw new Error('Supabase environment variables are missing');
  }

  console.log('Initializing Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
          console.log('Getting cookie:', name, cookie ? '[FOUND]' : '[NOT FOUND]');
          return cookie;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          console.log('Setting cookie:', name);
          document.cookie = `${name}=${value}; path=${options.path || '/'}; max-age=${options.maxAge || 31536000}${
            options.domain ? `; domain=${options.domain}` : ''
          }; SameSite=Lax${options.secure || process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          console.log('Removing cookie:', name);
          document.cookie = `${name}=; path=${options.path || '/'}${
            options.domain ? `; domain=${options.domain}` : ''
          }; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        },
      },
    }
  )
} 