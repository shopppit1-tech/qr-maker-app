(function () {
  'use strict';

  const config = window.SUPABASE_CONFIG;
  const sdk = window.supabase;
  if (!config || !config.url || !config.anonKey || !sdk || typeof sdk.createClient !== 'function') {
    window.qrAuth = { available: false };
    return;
  }

  const client = sdk.createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.qrAuth = {
    available: true,
    getSession: () => client.auth.getSession(),
    onAuthStateChange: (callback) => client.auth.onAuthStateChange(callback),
    signIn: (email, password) => client.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    }),
    sendPasswordReset: (email) => client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    }),
    updatePassword: (password) => client.auth.updateUser({ password }),
    signOut: () => client.auth.signOut()
  };
})();
