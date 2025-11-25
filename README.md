# Tabungan Kawanua - Aplikasi Arisan Digital

Aplikasi web modern untuk mengelola tabungan arisan 5 orang dengan sistem rotasi mingguan. Setiap anggota menabung Rp 100.000 per minggu, dan secara bergiliran menerima total Rp 500.000 (5 orang × Rp 100.000).

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif** - Statistik kas real-time dengan animasi smooth
- 👥 **Manajemen Anggota** - Kelola 5 anggota arisan dengan mudah
- 💰 **Sistem Rotasi Otomatis** - Penerima bergilir setiap minggu
- 📱 **Responsive Design** - Tampilan sempurna di web dan mobile
- ✨ **Animasi Modern** - Transisi dan efek visual yang elegan
- 📧 **Email Notification** - Admin otomatis menerima email saat ada yang menerima
- 📱 **Template WhatsApp** - Template siap pakai untuk notifikasi ke group
- ⚙️ **Admin Panel** - Set jadwal menabung, kelola data, dan kontrol penuh
- 📈 **Traffic Kas** - Grafik dan riwayat transaksi lengkap
- 💾 **Auto Save** - Data tersimpan otomatis di browser

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animasi**: Framer Motion
- **State Management**: Zustand (dengan persist)
- **Charts**: Recharts
- **Email**: Resend API

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 3. Build for Production

```bash
npm run build
npm start
```

> **Note**: Untuk production, semua environment variables di-set langsung di Vercel Dashboard. **TIDAK PERLU** membuat file `.env` lokal.

## 📦 Deployment ke Vercel

### 📚 Panduan Lengkap

Lihat **[PANDUAN_LENGKAP.md](./PANDUAN_LENGKAP.md)** untuk panduan step-by-step lengkap, termasuk:
- Quick Start (Deploy dalam 5 menit)
- Setup Environment Variables
- Deploy ke GitHub & Vercel
- Setup Email Notifikasi
- Cara Menggunakan Aplikasi
- Akses Admin
- Troubleshooting

### Environment Variables yang Diperlukan

Set di Vercel Dashboard → Settings → Environment Variables:

**Wajib:**
- `JSONBIN_BIN_ID` - ID dari JSONBin.io (untuk data storage)
- `JSONBIN_API_KEY` - API Key dari JSONBin.io
- `NEXT_PUBLIC_IMGBB_API_KEY` - API Key dari ImgBB (untuk upload gambar)

**Opsional:**
- `RESEND_API_KEY` - API Key dari Resend (untuk email notification)
- `RESEND_FROM_EMAIL` - Email pengirim (opsional)

> **Catatan**: Semua environment variables di-set di Vercel, **TIDAK PERLU** file `.env` lokal!

## 📖 Cara Menggunakan

### Sebagai Admin

1. Klik tombol **"Masuk sebagai Admin"** di pojok kanan atas
2. Set **Minggu Ke** sesuai dengan minggu arisan saat ini
3. Set **Jadwal Menabung** (hari dan waktu)
4. Set **Email Admin** untuk menerima notifikasi
5. Edit nama anggota dengan klik icon ✏️ di samping nama
6. Centang ✅ untuk menandai anggota yang sudah menabung
7. Klik **"Tandai [Nama] Sudah Menerima"** saat anggota sudah menerima dana
8. Template WhatsApp akan muncul - copy atau kirim langsung ke group

### Sebagai User

- Lihat status tabungan semua anggota
- Lihat siapa penerima minggu ini dan minggu depan
- Lihat total kas dan traffic transaksi
- Centang jika sudah menabung (hanya untuk tracking sendiri)

## 💳 Info Rekening

- **Bank**: BCA
- **No. Rekening**: 6115876019
- **Atas Nama**: FIKRI MOBILIU

## 🎨 Fitur Design

- **Gradient Background**: Background gradient yang soft dan modern
- **Card Design**: Card dengan shadow dan border yang elegan
- **Hover Effects**: Smooth hover animations pada semua interaktif elements
- **Color Scheme**: Blue-Indigo gradient sebagai primary color
- **Typography**: Clean dan readable dengan Inter font
- **Mobile First**: Responsive design yang sempurna di semua device

## 📝 Catatan Penting

1. **Data Storage**: Aplikasi menggunakan JSONBin.io untuk data storage. Data tersimpan di cloud dan tersinkronisasi di semua device/tab.

2. **Email Service**: Email notification memerlukan Resend API Key. Jika tidak di-set, aplikasi tetap berjalan normal tapi email tidak terkirim.

3. **Image Upload**: Upload gambar besar menggunakan ImgBB API. File kecil (<5MB) akan menggunakan base64 jika API key tidak di-set.

4. **Admin Access**: Password admin adalah `1998` (tidak bisa diubah). Untuk production, disarankan tambahkan authentication system yang lebih kuat.

5. **Environment Variables**: Semua environment variables di-set di Vercel Dashboard. Tidak perlu membuat file `.env` lokal untuk production.

## 🐛 Troubleshooting

### Email tidak terkirim
- Pastikan `RESEND_API_KEY` sudah di-set di environment variables
- Cek email spam/junk folder
- Pastikan domain sudah verified di Resend (untuk custom domain)

### Data hilang
- Data tersimpan di JSONBin.io (cloud storage)
- Data tersinkronisasi di semua device
- Cek JSONBin.io dashboard untuk melihat data

### Build Error
- Pastikan semua dependencies terinstall: `npm install`
- Cek Node.js version (minimal 18.x)
- Pastikan TypeScript terinstall: `npm install -D typescript`

## 📄 License

MIT License - Feel free to use and modify as needed.

## 👤 Author

Dibuat untuk Tabungan Kawanua - Sistem Arisan Digital

---

**Selamat menggunakan! 🎉**

