(function () {
  'use strict';
  const auth = window.qrAuth;
  if (!auth || !auth.available) return;

  let activeUserId = null;
  let requestVersion = 0;
  let authEventSequence = 0;
  let initialAuthEventSeen = false;
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

  async function loadForSession(session) {
    const userId = session?.user?.id || null;
    if (!userId) {
      if (activeUserId) {
        activeUserId = null;
        requestVersion += 1;
        emit('qr-history-logout');
      }
      return;
    }
    if (userId !== activeUserId) {
      const switchingAccount = activeUserId !== null;
      activeUserId = userId;
      requestVersion += 1;
      if (switchingAccount) emit('qr-history-logout');
    }

    const thisRequest = requestVersion;
    emit('qr-history-session', { userId });
    const { data, error } = await auth.loadHistory();
    if (thisRequest !== requestVersion || activeUserId !== userId) return;
    if (error) emit('qr-history-error', { message: error.message });
    else emit('qr-history-loaded', { userId, rows: data || [] });
  }

  auth.onAuthStateChange((event, session) => {
    initialAuthEventSeen = true;
    const thisEvent = ++authEventSequence;
    if (!session) {
      if (event === 'SIGNED_OUT' || activeUserId) {
        activeUserId = null;
        requestVersion += 1;
        emit('qr-history-logout');
      }
      return;
    }
    // Avoid awaiting Supabase queries inside onAuthStateChange; schedule after callback returns.
    setTimeout(() => {
      if (thisEvent === authEventSequence) void loadForSession(session);
    }, 0);
  });

  auth.getSession().then(({ data, error }) => {
    if (initialAuthEventSeen) return;
    if (error) emit('qr-history-error', { message: error.message });
    else void loadForSession(data?.session || null);
  });
})();
