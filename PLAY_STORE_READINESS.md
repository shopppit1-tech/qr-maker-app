# QR Maker — Kesiapan Google Play

**Pemeriksaan: 13 Oktober 2026**

## Status saat ini

QR Maker tersedia sebagai website/PWA HTTPS di [shopppit1-tech.github.io/qr-maker-app](https://shopppit1-tech.github.io/qr-maker-app/). Kebijakan Privasi dan Ketentuan Penggunaan tersedia di situs dan dapat dibuka dari tab Profil. Kode web saat ini membuat QR di perangkat, menyimpan riwayat di penyimpanan lokal browser, serta tidak menyertakan login, iklan, atau analitik pihak ketiga.

**Website/PWA belum menjadi aplikasi Android untuk Google Play.** Repository ini belum berisi Android App Bundle (AAB), package name yang telah diputuskan, signing key, atau listing Play Console. Persetujuan Google tidak dapat dijamin; setiap deklarasi harus cocok dengan AAB akhir dan SDK yang ikut di dalamnya.

## Pekerjaan sebelum rilis

1. **Buat paket Android yang dapat dirilis.** Untuk PWA, siapkan Trusted Web Activity, tentukan package name unik (nama paket bersifat permanen), buat dan uji AAB release yang ditandatangani, serta pasang `assetlinks.json` pada domain HTTPS. Simpan signing key dan rahasianya secara aman di luar repository.
2. **Lengkapi listing dan kontak pengembang.** Siapkan nama, deskripsi singkat dan lengkap, kategori, ikon, grafik/screenshot perangkat, serta alamat email dukungan yang benar-benar dipantau. Alamat email dukungan belum diberikan, jadi belum dapat dicantumkan di listing.
3. **Lengkapi App content di Play Console.** Tambahkan URL Kebijakan Privasi publik, isi Data safety berdasarkan AAB/SDK final, nyatakan ada atau tidaknya iklan, pilih target usia dengan akurat, jawab kuesioner rating konten, dan berikan petunjuk akses jika ada bagian yang terkunci. Deklarasikan permission sensitif hanya jika benar-benar digunakan dan setelah memenuhi persyaratannya.
4. **Penuhi persyaratan teknis saat pengiriman.** Mulai 31 Agustus 2026, aplikasi baru dan pembaruan umum harus menargetkan Android 16 / API level 36 atau lebih tinggi. Pengecualian perangkat tertentu mengikuti kebijakan Google.
5. **Uji dan ajukan rilis.** Uji AAB di perangkat Android, tautan kebijakan, instalasi TWA, mode offline, pembuatan QR, unduh, dan berbagi. Jika akun developer personal dibuat setelah 13 November 2023, Google meminta closed test dengan setidaknya 12 tester yang opt-in terus-menerus selama 14 hari, kemudian pengajuan akses produksi.

## Deklarasi data yang perlu diverifikasi

Berdasarkan kode website saat ini, konten QR yang dimasukkan pengguna tidak dikirim ke server QR Maker. Riwayat tersimpan lokal dan dapat dihapus dari tab Riwayat. Versi web tidak memakai iklan atau analitik pihak ketiga. **Jangan menyalin pernyataan ini ke Data safety sebelum memeriksa AAB, Trusted Web Activity, semua dependency/SDK, permission Android, dan perilaku versi yang akan diunggah.** Form Data safety tetap harus diselesaikan sekalipun aplikasi tidak mengumpulkan atau membagikan data pengguna.

## Tautan kebijakan QR Maker

- Kebijakan Privasi: <https://shopppit1-tech.github.io/qr-maker-app/privacy.html>
- Ketentuan Penggunaan: <https://shopppit1-tech.github.io/qr-maker-app/terms.html>

## Sumber resmi Google Play

- [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en): deklarasi wajib untuk aplikasi yang dipublikasikan, termasuk yang menyatakan tidak mengumpulkan data; deklarasi harus mencakup SDK.
- [App content](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en): privasi, iklan, target audience, akses aplikasi, dan rating konten.
- [Setup app dan listing](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en): pembuatan listing, kontak, dan Android App Bundle.
- [Target API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en): tingkat API yang diwajibkan dan tanggal efektif.
- [Pengujian akun personal baru](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en): ketentuan closed testing dan akses produksi.

> Checklist ini membantu persiapan, bukan nasihat hukum dan bukan jaminan aplikasi akan disetujui. Google dapat meminta deklarasi atau persyaratan tambahan sesuai jenis aplikasi, akun, dan hasil peninjauan.
