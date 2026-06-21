# Product Requirement Document (PRD)
## Sistem Manajemen & Pemesanan Warung Mie Ayam Digital (Mie Ayam Baso Tuyem)

---

## 1. Pendahuluan & Latar Belakang
Banyak pelaku bisnis UMKM Kuliner, khususnya warung mie ayam, yang masih mengandalkan pencatatan manual atau menghadapi kendala antrean panjang pada jam-jam sibuk. Digitalisasi menjadi langkah krusial agar usaha mereka tidak hanya lebih efisien secara operasional, tetapi juga lebih dikenal secara luas melalui optimasi mesin pencari (*SEO Google Search*) dan *Google Maps*.

Aplikasi ini dirancang sebagai platform pemesanan *web-based* yang ringan, responsif, dan mudah diakses oleh pelanggan tanpa perlu mengunduh aplikasi di *smartphone* mereka.

### 1.1 Profil Pengguna Target
Aplikasi ini dibuat khusus untuk **pelaku bisnis UMKM kecil (Warung Mie Ayam)** yang ingin:
* Mengurangi tumpukan antrean fisik di warung (*TIDAK PERLU ANTRE*).
* Mempercepat proses pemesanan bagi pelanggan setia agar mereka dapat *pesan lebih cepat* pada kunjungan berikutnya.
* Membangun digital kehadiran (*online presence*) agar mudah ditemukan di ekosistem Google.

### 1.2 Prioritas Utama Kunjungan Pertama (*North Star Metric*)
> **Satu hal yang harus berhasil dilakukan pengguna pada kunjungan pertama mereka sebelum keluar dari aplikasi adalah: Mereka bisa memesan mie ayam pertamanya secara sukses dan mudah.**

---

## 2. Arsitektur Komponen & Tech Stack
Sistem dibangun menggunakan kombinasi teknologi modern yang menjamin kecepatan, skalabilitas rendah biaya, dan kemudahan dalam penyebaran (*deployment*):

* **Frontend:** `Vue.js` (Menyediakan antarmuka yang reaktif, cepat, dan ramah SEO melalui teknik optimasi prerendering/SSR jika diperlukan).
* **Backend & Autentikasi:** `Firebase` (Digunakan untuk penanganan fungsi serverless/Cloud Functions dan otentikasi cepat admin).
* **Database:** `Supabase` (Database relasional berbasis PostgreSQL untuk menyimpan data menu, order, meja, dan konfigurasi warung secara *real-time*).
* **Deployment & Hosting:** `Netlify` (Memastikan performa pemuatan web yang super cepat di seluruh penjuru wilayah melalui CDN global).

---

## 3. Fitur Utama & Kebutuhan Fungsional

### 3.1 Aplikasi Sisi Pelanggan (Customer Web App)

#### A. Alur Pemesanan & Pemilihan Menu
* Sistem harus menampilkan daftar menu mie ayam beserta varian, ekstra toping, harga, dan status ketersediaan secara *real-time*.
* Pelanggan dapat memasukkan menu ke dalam keranjang belanja (*cart*).

#### B. Fleksibilitas Metode Pemenuhan (*Order Fulfillment*)
Sebelum menyelesaikan pesanan, pelanggan **wajib** memilih salah satu dari 3 metode berikut:
1. **Dine-In (Makan di Tempat):** Sistem mewajibkan pelanggan untuk *menginput nomor meja* tempat mereka duduk.
2. **Take Away (Ambil Sendiri):** Pelanggan menentukan perkiraan waktu pengambilan menu.
3. **Delivery (Diantar):** Pelanggan mengisi formulir alamat pengiriman dan integrasi informasi ongkos kirim manual/otomatis.

#### C. Metode Pembayaran Multi-Channel
Mendukung tiga opsi pembayaran utama untuk memudahkan segmen UMKM:
* **Tunai (Cash):** Pembayaran langsung ke kasir (untuk *Dine-in* atau *Take Away*).
* **QRIS:** Menampilkan gambar kode QRIS dinamis atau statis milik warung.
* **Transfer Bank:** Menampilkan informasi nomor rekening tujuan transfer.

#### D. Integrasi Konfirmasi & Notifikasi WhatsApp
* Setelah menekan tombol "Pesan Sekarang", aplikasi akan merangkum detail pesanan dan menyusun teks otomatis.
* Aplikasi akan mengarahkan (*redirect*) pengguna langsung ke aplikasi **WhatsApp** menuju nomor admin warung.
* **Format Teks WhatsApp Otomatis berisi:** ID Pesanan, Daftar Menu, Total Biaya, Metode Pemenuhan (Nomor Meja jika makan di tempat), serta Bukti Pembayaran (jika memilih opsi QRIS/Transfer, pengguna tinggal melampirkan foto resi/screenshot di chat WA tersebut).

### 3.2 Aplikasi Sisi Admin (Admin Dashboard App)
Aplikasi khusus bertingkat keamanan tinggi untuk pemilik atau kasir warung:
* **Manajemen Pesanan:** Menerima, mengubah status pesanan (Diproses, Siap Disajikan, Selesai, Dibatalkan).
* **Manajemen Menu:** Menambah menu baru, memperbarui harga, mengunggah foto mie ayam, dan mengubah status stok (Habis/Tersedia).
* **Manajemen Meja:** Mengatur daftar nomor meja aktif di warung.

---

## 4. Alur Pengguna (User Flow)
```
[Pelanggan Buka Web via Google/QR] ──> [Pilih Menu Mie Ayam] ──> [Masuk ke Keranjang]
                                                                        │
┌─────────────────────────────── Pembayaran & Metode Pemenuhan ─────────┘
│
├──> [Pilih Makan di Tempat]  ──> [Input Nomor Meja]  ──> [Pilih Tunai/QRIS/Transfer] ──┐
├──> [Pilih Ambil Sendiri]    ──> [Tentukan Waktu]     ──> [Pilih Tunai/QRIS/Transfer] ──┼─> [Kirim WA]
└──> [Pilih Diantar]         ──> [Isi Alamat]         ──> [Pilih Tunai/QRIS/Transfer] ──┘
```

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Kecepatan Pemuatan Halaman:** Aplikasi harus dapat dimuat dalam waktu kurang dari 2 detik pada jaringan 4G guna mendukung prinsip *pesan lebih cepat*.
* **Optimasi SEO:** Memiliki metadata yang bersih, struktur tag HTML semantik, dan JSON-LD Schema agar warung mie ayam mudah terindeks di peringkat atas Google Search dan terhubung baik ke Google Maps.
* **Responsif:** Tampilan harus optimal di perangkat *mobile* (Android/iOS) karena mayoritas pelanggan memesan langsung dari meja atau perjalanan menggunakan ponsel.

---

## 6. Target Rilis & Kriteria Keberhasilan (Definition of Done)
1. Pelanggan dapat menyelesaikan transaksi dari halaman awal hingga *redirect* WhatsApp dalam waktu kurang dari 1 menit.
2. Form input nomor meja divalidasi dengan benar dan tidak boleh kosong jika memilih opsi makan di tempat.
3. Admin menerima notifikasi data masuk secara *real-time* di dasbor admin yang disinkronkan oleh Supabase.
