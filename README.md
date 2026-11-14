# Template Undangan Pernikahan Digital

Website statis (HTML, CSS, JS) tanpa database dan tanpa API berbayar. Cocok untuk GitHub Pages.

## Menjalankan
- Cepat: buka `index.html` di browser.
- Lebih akurat (disarankan): `python -m http.server 8000`, lalu buka `http://localhost:8000`.

## Mengganti data pelanggan
Edit **hanya `config.js`**: nama, orang tua, tanggal (format ISO `2027-03-20T08:00:00+07:00`), lokasi, link Google Maps, nomor WhatsApp (`62...`), rekening, musik, galeri, love story, dan warna tema.
Taruh foto dan musik di folder `assets/` sesuai nama di config (`pasangan.jpg`, `mempelai-pria.jpg`, `mempelai-wanita.jpg`, `galeri-1..6.jpg`, `musik.mp3`). Kompres foto (maks ~200 KB) agar cepat dibuka.

## Struktur folder
```
index.html  style.css  script.js  config.js  README.md
assets/
  musik.mp3                (isi sendiri)
  pasangan.jpg             (isi sendiri)
  mempelai-pria.jpg        (isi sendiri)
  mempelai-wanita.jpg      (isi sendiri)
  galeri-1.jpg ... galeri-6.jpg   (isi sendiri)
  placeholder/             (SVG sementara, jangan dihapus)
```
Selama foto belum ada, otomatis tampil placeholder SVG di `assets/placeholder/`. Begitu file foto dengan nama yang sama diunggah, foto asli menggantikannya. Nama file di `config.js` boleh diubah; jika tidak ada placeholder dengan nama itu, dipakai `placeholder/foto.svg`.
Catatan: browser akan mencatat error 404 di konsol untuk foto yang belum ada. Itu normal dan tidak mengganggu tampilan.

## Link per tamu
Tambahkan `?to=Nama+Tamu`, contoh: `https://username.github.io/undangan/?to=Budi+Santoso`. Nama tampil di cover dan terisi otomatis di RSVP.

## Publikasi gratis (GitHub Pages)
1. Buat repository baru di GitHub, unggah semua file (satu repository per pelanggan, atau satu cabang per pelanggan).
2. Settings, Pages, Source: `Deploy from a branch`, pilih `main` dan `/ (root)`, lalu Save.
3. Tunggu 1-2 menit; alamat: `https://username.github.io/nama-repo/`.

## Batasan (jujur)
- **Buku tamu** memakai `localStorage`: ucapan hanya tampil di perangkat yang menulisnya, tidak dibagikan ke tamu lain. Buku tamu bersama butuh backend (misal Google Apps Script/Firebase gratis dengan kuota), tidak termasuk di template ini.
- **RSVP** membuka WhatsApp dengan pesan otomatis; tamu tetap harus menekan Kirim. Tidak ada rekap otomatis.
- **Musik** baru bisa diputar setelah interaksi pengguna (aturan browser), karena itu dimulai saat tombol Buka Undangan ditekan. Pakai file berlisensi yang sah.
- **Google Maps** hanya berupa link, bukan peta tertanam.
- Pratinjau tautan (Open Graph) di WhatsApp butuh URL gambar absolut setelah dipublikasikan.
