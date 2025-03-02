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
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: process.env.NODE_ENV === 'development',
        storage: {
          getItem: (key) => {
            try {
              if (typeof window !== 'undefined') {
                const item = localStorage.getItem(key);
                console.log('Getting storage item:', key, item ? 'found' : 'not found');
                return Promise.resolve(item);
              }
              return Promise.resolve(null);
            } catch (error) {
              console.error('Error getting storage item:', key, error);
              return Promise.resolve(null);
            }
          },
          setItem: (key, value) => {
            try {
              if (typeof window !== 'undefined') {
                console.log('Setting storage item:', key);
                localStorage.setItem(key, value);
              }
              return Promise.resolve();
            } catch (error) {
              console.error('Error setting storage item:', key, error);
              return Promise.resolve();
            }
          },
          removeItem: (key) => {
            try {
              if (typeof window !== 'undefined') {
                console.log('Removing storage item:', key);
                localStorage.removeItem(key);
              }
              return Promise.resolve();
            } catch (error) {
              console.error('Error removing storage item:', key, error);
              return Promise.resolve();
            }
          },
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      },
      cookies: {
        get(name: string) {
          if (typeof window === 'undefined') {
            console.log('Cookie access attempted in server context:', name);
            return undefined;
          }
          try {
            const cookie = document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
              ?.split('=')[1];
            console.log('Getting cookie:', name, cookie ? '[FOUND]' : '[NOT FOUND]');
            return cookie;
          } catch (error) {
            console.error('Error getting cookie:', name, error);
            return undefined;
          }
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          if (typeof window === 'undefined') {
            console.log('Cookie set attempted in server context:', name);
            return;
          }
          try {
            console.log('Setting cookie:', name);
            document.cookie = `${name}=${value}; path=${options.path || '/'}; max-age=${options.maxAge || 31536000}${
              options.domain ? `; domain=${options.domain}` : ''
            }; SameSite=Lax${options.secure || process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
          } catch (error) {
            console.error('Error setting cookie:', name, error);
          }
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          if (typeof window === 'undefined') {
            console.log('Cookie removal attempted in server context:', name);
            return;
          }
          try {
            console.log('Removing cookie:', name);
            document.cookie = `${name}=; path=${options.path || '/'}${
              options.domain ? `; domain=${options.domain}` : ''
            }; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
          } catch (error) {
            console.error('Error removing cookie:', name, error);
          }
        },
      },
    }
  )
} 