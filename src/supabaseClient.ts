// Emergency Fix: Prevent app crash by exporting a dummy object
// This allows the app to load so you can see which pages still need updating.
export const supabase = {
  auth: {
    getSession: () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => {},
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => ({}) }) }),
    insert: () => ({}),
    upload: () => ({}),
    getPublicUrl: () => ({ data: { publicUrl: "" } })
  }),
  storage: {
    from: () => ({
      upload: () => ({}),
      getPublicUrl: () => ({ data: { publicUrl: "" } })
    })
  }
};