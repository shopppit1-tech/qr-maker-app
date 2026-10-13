(function () {
  'use strict';
  const auth = window.qrAuth;
  const root = document.getElementById('authPanel');
  if (!root) return;

  const $ = (id) => document.getElementById(id);
  const form = $('authForm');
  const emailInput = $('authEmail');
  const passwordInput = $('authPassword');
  const message = $('authMessage');
  const signedInMessage = $('authMessageSignedIn');
  const submit = $('authSubmit');
  const switchMode = $('authSwitch');
  const forgot = $('authForgot');
  let mode = 'login';

  function notify(text, error) {
    const target = $('authSignedIn').hidden ? message : signedInMessage;
    if (!target) return;
    target.textContent = text;
    target.classList.toggle('error', Boolean(error));
    target.hidden = !text;
  }

  function setMode(next) {
    mode = next;
    const recovery = mode === 'recovery';
    const reset = mode === 'reset';
    $('authPasswordField').hidden = reset;
    passwordInput.required = !reset;
    passwordInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
    $('authSignedIn').hidden = true;
    $('authSignedOut').hidden = false;
    $('authTitle').textContent = recovery ? 'Buat kata sandi baru' : reset ? 'Reset kata sandi' : mode === 'signup' ? 'Buat akun dengan email' : 'Masuk dengan email';
    submit.textContent = recovery ? 'Simpan kata sandi baru' : reset ? 'Kirim tautan reset' : mode === 'signup' ? 'Daftar' : 'Masuk';
    $('authBack').hidden = !reset && !recovery;
    switchMode.hidden = reset || recovery;
    switchMode.textContent = mode === 'signup' ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar';
    forgot.hidden = mode !== 'login';
    notify('');
  }

  function showUser(user) {
    const generateButton = $('generateBtn');
    const loginNotice = $('loginRequiredNotice');
    if (generateButton && mode !== 'recovery') generateButton.innerHTML = user ? '✦ &nbsp; Buat QR Code &nbsp; →' : '🔒 &nbsp; Masuk untuk Membuat QR &nbsp; →';
    if (loginNotice) loginNotice.hidden = Boolean(user);
    if (!user || mode === 'recovery') {
      $('authSignedIn').hidden = true;
      $('authSignedOut').hidden = false;
      return;
    }
    $('authSignedIn').hidden = false;
    $('authSignedOut').hidden = true;
    $('authUserEmail').textContent = user.email || 'Akun email';
    $('authVerified').textContent = user.email_confirmed_at ? 'Email terverifikasi' : 'Menunggu verifikasi email';
    $('authVerified').classList.toggle('unverified', !user.email_confirmed_at);
  }

  if (!auth || !auth.available) {
    root.classList.add('auth-unavailable');
    $('authUnavailable').hidden = false;
    $('authSignedOut').hidden = true;
    $('authSignedIn').hidden = true;
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email) return notify('Masukkan alamat email yang valid.', true);
    if (!password && mode !== 'reset') return notify('Kata sandi wajib diisi.', true);
    submit.disabled = true;
    try {
      let result;
      if (mode === 'login') result = await auth.signIn(email, password);
      else if (mode === 'signup') result = await auth.signUp(email, password);
      else if (mode === 'reset') result = await auth.sendPasswordReset(email);
      else result = await auth.updatePassword(password);
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data?.session) {
        notify('Akun dibuat. Buka tautan verifikasi yang dikirim ke email Anda, lalu masuk kembali.');
        setMode('login');
        notify('Akun dibuat. Buka tautan verifikasi yang dikirim ke email Anda, lalu masuk kembali.');
      } else if (mode === 'reset') {
        notify('Jika alamat tersebut terdaftar, tautan reset akan dikirim ke email.');
      } else if (mode === 'recovery') {
        setMode('login');
        const sessionResult = await auth.getSession();
        showUser(sessionResult.data?.session?.user || null);
        notify('Kata sandi berhasil diperbarui.');
      } else {
        showUser(result.data?.user);
        notify('Berhasil masuk.');
      }
    } catch (error) {
      notify(error?.message || 'Autentikasi gagal. Coba lagi.', true);
    } finally {
      submit.disabled = false;
    }
  });

  switchMode.addEventListener('click', () => setMode(mode === 'signup' ? 'login' : 'signup'));
  forgot.addEventListener('click', () => setMode('reset'));
  $('authBack').addEventListener('click', () => setMode('login'));
  $('authSignOut').addEventListener('click', async () => {
    const { error } = await auth.signOut();
    if (error) notify(error.message, true);
    else notify('Anda sudah keluar.');
  });

  auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      setMode('recovery');
      notify('Tautan valid. Masukkan kata sandi baru.');
    } else if (mode !== 'recovery') {
      showUser(session?.user || null);
    }
  });
  auth.getSession().then(({ data, error }) => {
    if (error) notify('Sesi akun tidak dapat dimuat.', true);
    showUser(data?.session?.user || null);
  });
})();
