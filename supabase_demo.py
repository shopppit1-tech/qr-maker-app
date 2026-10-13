#!/usr/bin/env python3
"""Demo aman Supabase: cek Auth/Storage tanpa menulis data secara default.

Prasyarat: set SUPABASE_URL dan SUPABASE_KEY (publishable/anon key).
Contoh:
  python3 supabase_demo.py
  python3 supabase_demo.py --sign-in
  python3 supabase_demo.py --sign-up
"""
import argparse
import getpass
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


def request(url, key, path, *, method="GET", body=None, bearer=None):
    headers = {"apikey": key, "Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if bearer:
        headers["Authorization"] = "Bearer " + bearer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url.rstrip("/") + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            raw = response.read()
            return response.status, json.loads(raw.decode()) if raw else None
    except urllib.error.HTTPError as exc:
        # Jangan cetak body error mentah: beberapa layanan dapat menyertakan detail sensitif.
        return exc.code, None


def main():
    parser = argparse.ArgumentParser(description="Demo API Supabase tanpa menulis data secara default.")
    actions = parser.add_mutually_exclusive_group()
    actions.add_argument("--sign-in", action="store_true", help="uji login email/password dengan akun yang sudah ada")
    actions.add_argument("--sign-up", action="store_true", help="buat akun Auth baru (aksi eksternal yang disengaja)")
    args = parser.parse_args()

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        print("Atur SUPABASE_URL dan SUPABASE_KEY di environment terlebih dahulu.", file=sys.stderr)
        return 2

    print("Uji endpoint Auth settings dan daftar bucket Storage (GET/read-only)...")
    status, settings = request(url, key, "/auth/v1/settings")
    print(f"Auth settings: HTTP {status}")
    if status == 200 and isinstance(settings, dict):
        email_enabled = settings.get("external", {}).get("email", settings.get("email"))
        print("Provider email:", "aktif" if email_enabled is True else ("nonaktif" if email_enabled is False else "status tidak dikembalikan"))
        print("Pendaftaran publik:", "dinonaktifkan" if settings.get("disable_signup") is True else "diizinkan/terbuka")

    bucket_status, buckets = request(url, key, "/storage/v1/bucket")
    print(f"Daftar bucket Storage: HTTP {bucket_status}")
    if bucket_status == 200 and isinstance(buckets, list):
        print(f"Jumlah bucket yang terlihat oleh key ini: {len(buckets)}")

    if args.sign_in or args.sign_up:
        email = input("Email akun: ").strip()
        password = getpass.getpass("Kata sandi: ")
        if not email or not password:
            print("Email dan kata sandi wajib diisi.", file=sys.stderr)
            return 2
        if args.sign_up:
            path = "/auth/v1/signup"
            payload = {"email": email, "password": password}
            action_name = "Pendaftaran Auth"
        else:
            path = "/auth/v1/token?grant_type=password"
            payload = {"email": email, "password": password}
            action_name = "Login email/password"
        auth_status, auth_data = request(url, key, path, method="POST", body=payload)
        print(f"{action_name}: HTTP {auth_status}")
        # Token dan kata sandi tidak pernah dicetak.
        if auth_status in (200, 201) and isinstance(auth_data, dict):
            if auth_data.get("access_token"):
                print("Sesi berhasil dibuat.")
                user_status, user = request(url, key, "/auth/v1/user", bearer=auth_data["access_token"])
                print(f"Validasi sesi /auth/v1/user: HTTP {user_status}")
                if user_status == 200 and isinstance(user, dict):
                    print("Objek pengguna terautentikasi:", "tersedia" if user.get("id") else "tidak tersedia")
            elif args.sign_up:
                print("Permintaan diterima; jika verifikasi email aktif, periksa kotak masuk akun uji.")
        elif auth_status in (400, 401, 422):
            print("Permintaan ditolak; periksa kredensial, aturan kata sandi, dan pengaturan Auth.")

    print("\nCatatan: skrip tidak membuat tabel, mengunggah/menghapus file, atau mengubah data database.")
    if status != 200 or bucket_status != 200:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
