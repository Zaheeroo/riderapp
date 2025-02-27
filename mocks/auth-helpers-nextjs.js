'use strict';

// Mock Supabase auth helpers
const createServerComponentClient = (context) => {
  console.log('Using mock server component client');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  };
};

const createClientComponentClient = (context) => {
  console.log('Using mock client component client');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback) => {
        // Immediately call with null session to initialize state
        if (typeof callback === 'function') {
          callback('SIGNED_OUT', null);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  };
};

const createMiddlewareClient = (context) => {
  console.log('Using mock middleware client');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  };
};

module.exports = {
  createServerComponentClient,
  createClientComponentClient,
  createMiddlewareClient,
}; 