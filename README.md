# QR Maker

PWA QR Maker dengan desain mobile yang diunggah pemilik repo. Membuat QR code URL, teks, WiFi, email, kontak, dan data lainnya; proses dilakukan lokal di perangkat.

## Fitur yang sudah tersedia

- Generator QR URL, teks, WiFi, email, kontak, dan data lainnya
- Preview QR real-time setelah submit
- Pilihan warna dan ukuran PNG
- Unduh PNG dan Web Share API
- Riwayat lokal dengan penghapusan data
- PWA installable ke Home Screen Android
- Empat tab: Buat, Riwayat, Template, dan Profil dengan navigasi bawah
- Offline cache melalui service worker
- Halaman Kebijakan Privasi dan Ketentuan
- GitHub Actions untuk GitHub Pages

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
