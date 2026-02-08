// src/supabaseClient.ts

// Helper to create a "Thenable" (Promise-like) object that allows chaining
const createMockBuilder = (defaultData: any = []) => {
  const builder = {
    // Chaining methods (return the builder itself)
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    in: () => builder,
    is: () => builder,
    like: () => builder,
    ilike: () => builder,
    contains: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => {
      // If single() is called, return an object when awaited, not an array
      // We overwrite the 'then' function for this specific chain
      return {
        ...builder,
        then: (resolve: any) => resolve({ data: {}, error: null })
      };
    },
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    
    // The "await" trigger. When you await this object, it returns this:
    then: (resolve: any) => resolve({ data: defaultData, error: null })
  };
  return builder;
};

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => createMockBuilder([]),
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: { path: "dummy-path" }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: "https://via.placeholder.com/400" } }),
      list: () => Promise.resolve({ data: [], error: null }),
    })
  }
};