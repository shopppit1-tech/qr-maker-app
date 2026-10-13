# QR Maker

PWA QR Maker dengan desain mobile. QR code URL, teks, WiFi, email, kontak, dan data lainnya dirender lokal; setelah login, riwayatnya disimpan per akun di Supabase.

## Fitur yang sudah tersedia

- Generator QR URL, teks, WiFi, email, kontak, dan data lainnya
- Preview QR real-time setelah submit
- Pilihan warna dan ukuran PNG
- Unduh PNG dan Web Share API
- Riwayat QR tersimpan per akun di Supabase, hanya dapat diakses pemilik melalui RLS, dan bisa dihapus dari seluruh perangkat
- Login email melalui Supabase Auth diwajibkan sebelum QR dibuat; isi/jenis QR disimpan sebagai riwayat akun, tampilan riwayat dibersihkan saat logout
- PWA installable ke Home Screen Android
- Empat tab: Buat, Riwayat, Template, dan Profil dengan navigasi bawah
- Offline cache melalui service worker
- Halaman Kebijakan Privasi dan Ketentuan
- GitHub Actions untuk GitHub Pages

## Login email dan Supabase

Frontend menggunakan `supabase-config.js` berisi URL proyek dan **publishable key** (aman untuk aplikasi browser). Jangan pernah mengganti key dengan `service_role` atau `sb_secret_`. Sebelum memakai fitur riwayat akun, jalankan SQL di [`supabase/migrations/20261013000000_qr_history.sql`](supabase/migrations/20261013000000_qr_history.sql) melalui Supabase Dashboard → SQL Editor. Skema mengaktifkan RLS dengan akses baca/tambah/hapus hanya untuk `auth.uid()` pemilik baris. Login diperlukan sebelum QR dibuat. QR dirender lokal; konten dan jenisnya dikirim ke Supabase untuk disimpan di riwayat akun. Saat logout, tampilan riwayat dan QR yang terbuka dibersihkan. Riwayat lokal lama tidak diimpor otomatis. Tambahkan redirect yang diizinkan di Supabase Auth: `https://shopppit1-tech.github.io/qr-maker-app/` dan `http://localhost:4173/` untuk pengujian lokal.

### Skrip demo API

Skrip `supabase_demo.py` memeriksa Auth settings dan daftar Storage bucket dengan permintaan GET saja secara default:

```bash
export SUPABASE_URL="https://<project-ref>.supabase.co"
export SUPABASE_KEY="<publishable-or-anon-key>"
python3 supabase_demo.py
```

Untuk mencoba autentikasi secara eksplisit, jalankan `python3 supabase_demo.py --sign-in` (akun yang sudah ada) atau `python3 supabase_demo.py --sign-up` (membuat akun Auth baru; verifikasi email mungkin diperlukan). Kata sandi diminta secara tersembunyi dan token tidak dicetak. Skrip tidak membuat tabel, mengubah database, atau mengunggah/menghapus file.

## Jalankan lokal

```bash
python3 -m http.server 4173
```

Buka `http://localhost:4173`.

## Deploy ke GitHub Pages

1. Push branch `main` ke GitHub.
2. Buka **Settings → Pages** pada repository.
3. Pilih **GitHub Actions** sebagai Source.
4. Workflow `.github/workflows/pages.yml` akan deploy otomatis setiap push.
5. URL aktif: `https://shopppit1-tech.github.io/qr-maker-app/`.

## Menjadi aplikasi Play Store (TWA)

GitHub Pages hanya menyediakan website/PWA. Google Play Store membutuhkan file **Android App Bundle (.aab)** dan listing Play Console. Cara yang disarankan untuk aplikasi PWA adalah Trusted Web Activity (TWA).

### Prasyarat

- Domain HTTPS final, bukan URL localhost
- Android Studio atau Node.js
- Akun Google Play Console
- Nama paket unik, contoh `com.namamu.qrmaker`
- Keystore signing yang disimpan aman dan dibackup
- URL Kebijakan Privasi publik

### Build AAB dengan Bubblewrap

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://USERNAME.github.io/REPOSITORY/manifest.webmanifest
bubblewrap build
```

Bubblewrap akan meminta `packageId`, nama aplikasi, ikon, warna, dan detail signing. Simpan keystore dan password di tempat aman; jangan commit ke GitHub.

Setelah build pertama, upload `assetlinks.json` yang dihasilkan Bubblewrap ke:

```
https://USERNAME.github.io/REPOSITORY/.well-known/assetlinks.json
```

Lalu jalankan `bubblewrap install` untuk tes pada perangkat Android. Pastikan link dibuka sebagai TWA tanpa address bar.

## Kesiapan Google Play

Status saat ini, pekerjaan yang masih diperlukan, dan rujukan kebijakan resmi tersedia di [PLAY_STORE_READINESS.md](PLAY_STORE_READINESS.md). Website/PWA yang tayang bukan AAB Android dan belum berarti listing Play Store telah disetujui.
