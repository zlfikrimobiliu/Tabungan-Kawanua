# 📘 Tabungan Kawanua - Aplikasi Arisan Digital

**Panduan Lengkap untuk Setup, Install, Deploy, dan Menggunakan Aplikasi**

---

## 📋 DAFTAR ISI

1. [Deskripsi Project](#1-deskripsi-project)
2. [Fitur Utama](#2-fitur-utama)
3. [Tech Stack](#3-tech-stack)
4. [Requirements & Prerequisites](#4-requirements--prerequisites)
5. [Installation - Development](#5-installation---development)
6. [Installation - Production](#6-installation---production)
7. [Deployment ke Vercel](#7-deployment-ke-vercel)
8. [Setup Environment Variables](#8-setup-environment-variables)
9. [Setup Email Notifikasi](#9-setup-email-notifikasi)
10. [Cara Menggunakan Aplikasi](#10-cara-menggunakan-aplikasi)
11. [Akses Admin](#11-akses-admin)
12. [Reset Data & Set Tanggal Mulai](#12-reset-data--set-tanggal-mulai)
13. [Struktur Project](#13-struktur-project)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. DESKRIPSI PROJECT

**Tabungan Kawanua** adalah aplikasi web modern untuk mengelola sistem arisan digital dengan sistem rotasi mingguan. Setiap anggota menabung Rp 100.000 per minggu, dan secara bergiliran menerima total sesuai jumlah anggota aktif.

### Karakteristik:
- ✅ **Real-time Dashboard** dengan statistik kas dan tabungan
- ✅ **Sistem Rotasi Otomatis** untuk penerima arisan
- ✅ **Manajemen Anggota** yang mudah dan intuitif
- ✅ **Auto-sync** data ke cloud storage (JSONBin.io)
- ✅ **Email Notification** untuk admin
- ✅ **Responsive Design** untuk semua device
- ✅ **Dark Mode** support

---

## 2. FITUR UTAMA

### 👤 User Mode (Tanpa Login)
- 📊 **Dashboard Interaktif** - Statistik kas real-time dengan animasi smooth
- 👥 **Daftar Anggota** - Lihat semua anggota dan status mereka
- 💰 **Traffic Kas** - Grafik dan riwayat transaksi lengkap
- 📱 **Gallery** - Koleksi foto kegiatan

### 🔐 Admin Mode (Setelah Login)
- ⚙️ **Admin Panel** - Set jadwal menabung, kelola data, dan kontrol penuh
- 👥 **Manajemen Anggota** - Tambah, edit, hapus anggota
- 📧 **Email Notification** - Admin otomatis menerima email saat ada yang menerima
- 📱 **Template WhatsApp** - Template siap pakai untuk notifikasi ke group
- 🔄 **Reset Data** - Reset semua data ke default
- 📅 **Set Tanggal Mulai** - Set tanggal mulai minggu pertama (bisa di masa lalu)

---

## 3. TECH STACK

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animasi**: Framer Motion
- **State Management**: Zustand (dengan persist)
- **Charts**: Recharts
- **Email**: Resend API
- **Storage**: JSONBin.io
- **Image Upload**: ImgBB API

---

## 4. REQUIREMENTS & PREREQUISITES

### Software yang Diperlukan:

#### 1. **Node.js** (Wajib)
- **Version**: Minimal Node.js 18.x atau lebih baru
- **Cara Install**: Download dari https://nodejs.org/
- **Verifikasi**: `node --version`

#### 2. **npm** (Otomatis terinstall dengan Node.js)
- **Version**: Minimal npm 9.x atau lebih baru
- **Verifikasi**: `npm --version`

#### 3. **Git** (Wajib untuk version control)
- **Cara Install**: 
  - Windows: https://git-scm.com/download/win
  - Mac: `brew install git`
  - Linux: `sudo apt-get install git`
- **Verifikasi**: `git --version`

### Akun yang Diperlukan (untuk Production):

1. **GitHub Account** - https://github.com/signup
2. **Vercel Account** - https://vercel.com/signup
3. **JSONBin.io Account** - https://jsonbin.io/
4. **ImgBB Account** (opsional) - https://api.imgbb.com/
5. **Resend Account** (opsional) - https://resend.com/

---

## 5. INSTALLATION - DEVELOPMENT

### Step 1: Clone atau Download Project

```bash
# Clone dari GitHub
git clone https://github.com/USERNAME/tabungan-kawanua.git
cd tabungan-kawanua

# Atau download ZIP dan extract
```

### Step 2: Install Dependencies

```bash
npm install
```

**Waktu yang dibutuhkan**: 1-3 menit

### Step 3: Jalankan Development Server

```bash
npm run dev
```

**Output yang diharapkan**:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 4: Buka Browser

Buka browser dan akses: **http://localhost:3000**

**Selamat!** Aplikasi sudah berjalan di development mode! 🎉

### (Opsional) Setup Environment Variables untuk Development

Buat file `.env.local` di root project (opsional):

```
JSONBIN_BIN_ID=your-bin-id
JSONBIN_API_KEY=your-api-key
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
RESEND_API_KEY=your-resend-key
```

**Catatan**: Untuk development lokal, environment variables tidak wajib. Aplikasi akan menggunakan localStorage sebagai fallback.

---

## 6. INSTALLATION - PRODUCTION

### Step 1: Build Project

```bash
npm run build
```

### Step 2: Test Production Build (Opsional)

```bash
npm start
```

Buka: **http://localhost:3000**

### Step 3: Deploy ke Vercel

Lihat [Section 7: Deployment ke Vercel](#7-deployment-ke-vercel)

---

## 7. DEPLOYMENT KE VERCEL

### ⚡ Quick Start - Deploy dalam 5 Menit

#### 1️⃣ Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/tabungan-kawanua.git
git push -u origin main
```

#### 2️⃣ Deploy ke Vercel

1. Buka https://vercel.com
2. **Add New Project** → Import dari GitHub
3. Pilih repository `tabungan-kawanua`
4. **JANGAN klik Deploy dulu!**

#### 3️⃣ Set Environment Variables

Di halaman konfigurasi, scroll ke **Environment Variables**, tambahkan:

**Wajib:**
```
JSONBIN_BIN_ID = your-bin-id
JSONBIN_API_KEY = your-api-key
NEXT_PUBLIC_IMGBB_API_KEY = your-imgbb-key
```

**Opsional:**
```
RESEND_API_KEY = your-resend-key
RESEND_FROM_EMAIL = Tabungan Kawanua <onboarding@resend.dev>
```

**Centang**: ✅ Production, ✅ Preview, ✅ Development

#### 4️⃣ Deploy!

Klik **Deploy** dan tunggu 1-3 menit.

**URL Production**: `https://tabungan-kawanua.vercel.app`

### 📋 STEP-BY-STEP LENGKAP

#### STEP 1: Upload ke GitHub

1. **Buat Repository Baru di GitHub**
   - Buka https://github.com
   - Klik **"+"** → **"New repository"**
   - Isi repository name: `tabungan-kawanua`
   - Klik **"Create repository"**

2. **Push Code ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tabungan Kawanua app"
   git remote add origin https://github.com/USERNAME/tabungan-kawanua.git
   git branch -M main
   git push -u origin main
   ```

#### STEP 2: Deploy ke Vercel

1. **Buat Akun Vercel** (jika belum)
   - Buka https://vercel.com
   - Klik **"Sign Up"**
   - Pilih **"Continue with GitHub"**

2. **Import Project dari GitHub**
   - Di Vercel Dashboard, klik **"Add New..."** → **"Project"**
   - Pilih repository **"tabungan-kawanua"**
   - Klik **"Import"**

3. **Konfigurasi Project**
   - **Project Name**: `tabungan-kawanua` (biarkan default)
   - **Framework Preset**: Next.js (otomatis terdeteksi)
   - **JANGAN klik "Deploy" dulu!**

#### STEP 3: Setup Environment Variables

Ikuti [Section 8: Setup Environment Variables](#8-setup-environment-variables)

#### STEP 4: Deploy!

1. Setelah semua environment variables di-set
2. Klik **"Deploy"** di halaman konfigurasi
3. Tunggu proses build (1-3 menit)
4. Setelah selesai, Vercel akan memberikan URL

#### STEP 5: Update Code (Setelah Deploy)

Setiap kali Anda update code:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main
```

Vercel akan otomatis mendeteksi push ke GitHub dan melakukan redeploy.

---

## 8. SETUP ENVIRONMENT VARIABLES

**TIDAK PERLU membuat file `.env` lokal!** Semua environment variables di-set langsung di Vercel Dashboard.

### ✅ Wajib (Required)

#### 1. JSONBIN_BIN_ID
**Deskripsi**: ID Bin dari JSONBin.io untuk menyimpan data aplikasi.

**Cara Dapatkan**:
1. Buka https://jsonbin.io
2. Login/Register
3. Buat bin baru
4. Copy Bin ID dari URL atau dashboard

#### 2. JSONBIN_API_KEY
**Deskripsi**: API Key (Master Key) dari JSONBin.io untuk akses data.

**Cara Dapatkan**:
1. Di JSONBin.io dashboard
2. Klik pada bin yang dibuat
3. Copy "Master Key" atau "X-Master-Key"

#### 3. NEXT_PUBLIC_IMGBB_API_KEY
**Deskripsi**: API Key dari ImgBB untuk upload gambar besar (hingga 32MB).

**Cara Dapatkan**:
1. Buka https://api.imgbb.com/
2. Login/Register
3. Copy API Key yang diberikan

**Catatan**: 
- Jika tidak di-set, upload gambar kecil (<5MB) akan menggunakan base64
- File besar (>5MB) akan error jika API key tidak di-set

### ⚙️ Opsional (Optional)

#### 4. RESEND_API_KEY
**Deskripsi**: API Key dari Resend untuk mengirim email notifikasi.

**Catatan**: 
- Jika tidak di-set, aplikasi tetap berjalan normal
- Email notification tidak akan terkirim

#### 5. RESEND_FROM_EMAIL
**Deskripsi**: Email pengirim untuk notifikasi email.

**Default**: `Tabungan Kawanua <onboarding@resend.dev>`

### 📝 Cara Set di Vercel

1. **Buka Vercel Dashboard**
   - https://vercel.com/dashboard
   - Login ke akun Anda

2. **Pilih Project**
   - Klik project "Tabungan Kawanua"

3. **Buka Settings**
   - Klik tab **"Settings"** (di menu atas)
   - Scroll ke **"Environment Variables"**

4. **Tambah Variable**
   - Klik **"Add New"** atau **"Add"**
   - Isi:
     - **Name**: (nama variable, contoh: `JSONBIN_BIN_ID`)
     - **Value**: (nilai variable)
     - **Environment**: Centang semua (✅ Production, ✅ Preview, ✅ Development)
   - Klik **"Save"**

5. **Redeploy**
   - Setelah menambahkan variable, **Redeploy** project
   - Pergi ke tab **"Deployments"**
   - Klik **"..."** (3 titik) pada deployment terbaru
   - Pilih **"Redeploy"**

---

## 9. SETUP EMAIL NOTIFIKASI

### 🎯 Email Apa yang Harus Digunakan?

**Pakai email pribadi Anda!** Contoh:
- `fikrimobiliu@gmail.com` ✅
- `fikrimobiliu@yahoo.com` ✅
- `fikrimobiliu@outlook.com` ✅
- Email kantor Anda ✅

**Semua email valid bisa digunakan!**

### 📝 Cara Set Email Admin

#### Step 1: Login sebagai Admin
1. Buka aplikasi
2. Klik tombol **"Login"** (pojok kanan atas)
3. Masukkan password: `1998`
4. Klik **"Masuk"**

#### Step 2: Set Email Admin
1. Scroll ke bagian **"Admin Panel"**
2. Cari bagian **"Email Admin (Notifikasi)"**
3. Masukkan email Anda (contoh: `fikrimobiliu@gmail.com`)
4. Email otomatis tersimpan

**Selesai!** Email Anda sudah di-set untuk menerima notifikasi.

### ⚙️ Setup Resend (Opsional)

1. Di Vercel Dashboard → Settings → Environment Variables
2. Tambahkan variable:
   ```
   Name:  RESEND_API_KEY
   Value: your-resend-api-key
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```
3. (Opsional) Tambahkan `RESEND_FROM_EMAIL`:
   ```
   Name:  RESEND_FROM_EMAIL
   Value: Tabungan Kawanua <onboarding@resend.dev>
   ```
4. Redeploy aplikasi

> **Note**: Jika tidak ingin setup email, bisa skip step ini. Aplikasi tetap berjalan normal, hanya email notification tidak akan terkirim.

---

## 10. CARA MENGGUNAKAN APLIKASI

### 👤 Sebagai User Biasa

#### Fitur yang Bisa Diakses:
1. **Lihat Dashboard**
   - ✅ Lihat **Total Kas**
   - ✅ Lihat **Total Tabungan**
   - ✅ Lihat **Minggu Ke** berapa
   - ✅ Lihat **Penerima Minggu Ini**
   - ✅ Lihat **Penerima Minggu Depan**

2. **Lihat Daftar Anggota**
   - ✅ Lihat semua anggota dan status mereka
   - ✅ Lihat siapa yang sudah menabung
   - ✅ Lihat siapa yang sudah menerima
   - ✅ Lihat total tabungan masing-masing anggota

3. **Lihat Traffic Kas**
   - ✅ Lihat **Total Kas** saat ini
   - ✅ Lihat **Grafik** tabungan & penerimaan
   - ✅ Lihat **Riwayat Transaksi** terbaru

4. **Lihat Gallery**
   - ✅ Lihat koleksi foto kegiatan
   - ✅ Download gambar
   - ✅ Lihat deskripsi dan lokasi

#### Fitur yang TIDAK Bisa Diakses:
- ❌ Edit data apapun
- ❌ Tandai status menabung/menerima
- ❌ Tambah/hapus anggota
- ❌ Set jadwal atau minggu
- ❌ Akses Panel Admin

### 🔐 Sebagai Admin

Lihat [Section 11: Akses Admin](#11-akses-admin)

---

## 11. AKSES ADMIN

### 🔐 Cara Masuk sebagai Admin

1. **Klik tombol "Login"** di pojok kanan atas dashboard
2. **Masukkan Password Admin**: `1998`
3. Setelah login berhasil, **Mode Admin Aktif** akan muncul

### ⚠️ Penting!

- **Password**: `1998` (tidak bisa diubah)
- **Password disimpan di browser** (localStorage)
- **Jika lupa password**: Hapus data browser storage dan set ulang
- **Simpan password dengan baik!**

### 🎯 Fitur yang Hanya Bisa Diakses Admin

#### 1. **Panel Admin** (Muncul setelah login)
- ✅ Set **Minggu Ke** berapa saat ini
- ✅ Set **Jadwal Menabung** (hari & waktu)
- ✅ Set **Tanggal Mulai Minggu ke-1**
- ✅ Set **Email Admin** untuk notifikasi
- ✅ **Tambah Anggota Baru** (tidak terbatas jumlah)
- ✅ **Hapus Anggota** dari sistem
- ✅ **Tandai Penerima** - Menandai anggota yang sudah menerima dana
- ✅ **Template WhatsApp** muncul otomatis setelah tandai penerima
- ✅ **Konfirmasi Minggu Selesai**
- ✅ **Reset Semua Data**

#### 2. **Edit Data Anggota**
- ✅ **Edit nama anggota** (klik icon ✏️ di samping nama)
- ✅ **Edit email & no. HP** anggota

#### 3. **Centang Status**
- ✅ **Centang "Menabung"** - Tandai anggota yang sudah menabung
- ✅ **Centang "Menerima"** - Tandai penerima yang sudah menerima dana

#### 4. **Gallery Management**
- ✅ **Upload gambar** ke gallery
- ✅ **Hapus gambar** dari gallery
- ✅ **Edit deskripsi** dan link lokasi

#### 5. **Notifikasi**
- ✅ **Email otomatis** terkirim ke admin saat ada yang menerima
- ✅ **Template WhatsApp** untuk kirim ke group

### 🔄 Cara Keluar dari Mode Admin

1. Klik tombol **"Admin"** (pojok kanan atas)
2. Akan muncul popup konfirmasi logout
3. Ketik **"logout"** untuk konfirmasi
4. Klik **"Logout"**
5. Otomatis keluar dari mode admin
6. Semua fitur admin akan tersembunyi

### 💡 Tips Keamanan

1. **Jangan share password** dengan sembarang orang
2. **Logout setelah selesai** menggunakan fitur admin
3. **Gunakan browser yang aman** untuk akses admin

---

## 12. RESET DATA & SET TANGGAL MULAI

### 🔄 RESET SEMUA DATA

#### Kapan Harus Reset?

Reset data digunakan ketika Anda ingin:
- ✅ Memulai arisan dari awal
- ✅ Menghapus semua history transaksi
- ✅ Reset anggota ke default (5 anggota: A, B, C, D, E)
- ✅ Reset minggu ke-1
- ✅ Reset semua konfirmasi minggu selesai

#### Apa yang Terjadi Setelah Reset?

**Yang Dihapus:**
- ❌ Semua transaksi/history
- ❌ Semua anggota (reset ke default: Anggota A, B, C, D, E)
- ❌ Minggu ke-X (reset ke 1)
- ❌ Semua konfirmasi minggu selesai
- ❌ Flag `isCurrentWeekManual` (reset ke false, artinya minggu akan dihitung otomatis)

**Yang Tetap Tersimpan:**
- ✅ Gallery (foto-foto kegiatan)
- ✅ Settings (jadwal menabung, email admin)
- ✅ Dark mode preference
- ✅ Password admin

#### Cara Reset:

1. **Login sebagai Admin**
   - Klik tombol **"Login"** di pojok kanan atas
   - Masukkan password: `1998`

2. **Scroll ke Panel Admin**
   - Cari bagian **"Reset Semua Data"** di bagian bawah

3. **Klik Tombol Reset**
   - Klik tombol **"Reset Semua Data"** (warna merah)

4. **Konfirmasi Reset**
   - Akan muncul popup konfirmasi
   - Ketik **"RESET"** (huruf besar) untuk konfirmasi
   - Klik **"OK"**

5. **Konfirmasi Terakhir**
   - Akan muncul konfirmasi kedua
   - Klik **"OK"** untuk konfirmasi terakhir

6. **Selesai**
   - Data akan direset
   - Halaman akan otomatis reload setelah 1 detik

### 📅 SET TANGGAL MULAI MINGGU KE-1

#### Kapan Harus Set Tanggal Mulai?

Set tanggal mulai digunakan ketika:
- ✅ Arisan dimulai dari tanggal tertentu (bukan hari ini)
- ✅ Ingin menghitung minggu berdasarkan tanggal mulai yang spesifik
- ✅ Setelah reset, ingin mulai dari tanggal tertentu

#### Apakah Bisa Set Tanggal di Masa Lalu?

**✅ YA, BISA!** 

Anda bisa set tanggal mulai di masa lalu tanpa masalah. Sistem akan menghitung minggu ke berapa berdasarkan tanggal mulai tersebut.

**Contoh:**
- Tanggal sekarang: **15 Januari 2025**
- Tanggal mulai yang di-set: **1 Januari 2025** (14 hari yang lalu)
- Sistem akan menghitung: Minggu ke-3 (karena sudah lewat 14 hari = 2 minggu)

#### Cara Set Tanggal Mulai:

1. **Login sebagai Admin**
   - Klik tombol **"Login"** di pojok kanan atas
   - Masukkan password: `1998`

2. **Scroll ke Panel Admin**
   - Cari bagian **"Tanggal Mulai Minggu ke-1"**

3. **Klik Input Date**
   - Klik field tanggal
   - Pilih tanggal yang diinginkan (bisa tanggal di masa lalu, hari ini, atau masa depan)

4. **Tanggal Otomatis Tersimpan**
   - Setelah memilih tanggal, sistem otomatis menyimpan
   - Data akan tersinkronisasi ke server

#### Cara Kerja Perhitungan Minggu:

Sistem menghitung minggu berdasarkan:

```
Selisih Hari = Tanggal Sekarang - Tanggal Mulai
Minggu Ke = floor(Selisih Hari / 7) + 1
```

**Contoh Perhitungan:**

| Tanggal Mulai | Tanggal Sekarang | Selisih Hari | Minggu Ke |
|---------------|------------------|--------------|-----------|
| 1 Jan 2025    | 1 Jan 2025       | 0 hari       | 1         |
| 1 Jan 2025    | 8 Jan 2025       | 7 hari       | 2         |
| 1 Jan 2025    | 15 Jan 2025      | 14 hari      | 3         |
| 1 Jan 2025    | 22 Jan 2025      | 21 hari      | 4         |

**Catatan Penting:**
- Jika tanggal sekarang **sebelum** tanggal mulai → Minggu ke-1
- Jika tanggal sekarang **setelah** tanggal mulai → Dihitung berdasarkan selisih hari

### ⚙️ MODE MANUAL vs AUTO-CALCULATION

#### Auto-Calculation (Default Setelah Reset)

Setelah reset, `isCurrentWeekManual` di-reset ke `false`, artinya:
- ✅ Sistem akan **otomatis menghitung** minggu berdasarkan tanggal mulai
- ✅ Setiap 5 detik, sistem akan cek dan update minggu jika perlu
- ✅ Minggu akan otomatis maju sesuai tanggal

**Kapan Digunakan:**
- Ketika ingin sistem otomatis menghitung minggu
- Ketika tanggal mulai sudah benar dan ingin sistem otomatis update

#### Manual Mode

Jika admin set **Minggu Ke** secara manual (dari input field), maka:
- ✅ `isCurrentWeekManual` akan menjadi `true`
- ✅ Sistem **TIDAK akan** menghitung ulang minggu secara otomatis
- ✅ Admin punya kontrol penuh atas minggu ke berapa

**Kapan Digunakan:**
- Ketika ingin kontrol manual atas minggu
- Ketika tanggal mulai tidak sesuai dengan minggu yang diinginkan
- Ketika ingin maju/mundur minggu sesuai kebutuhan

#### Cara Set Manual Mode:

1. Login sebagai Admin
2. Di Panel Admin, cari **"Minggu Ke"**
3. Ubah angka secara manual (misalnya: 1, 2, 3, dll)
4. Sistem otomatis masuk ke manual mode
5. Auto-calculation akan **TIDAK** mengganggu lagi

### 🔧 SKENARIO PENGGUNAAN

#### Skenario 1: Reset & Mulai dari Tanggal Hari Ini
1. Reset semua data
2. Set tanggal mulai = hari ini
3. Set minggu ke = 1 (secara manual jika perlu)
4. Mulai arisan

#### Skenario 2: Reset & Mulai dari Tanggal di Masa Lalu
**Contoh:**
- Tanggal sekarang: 15 Januari 2025
- Tanggal mulai yang diinginkan: 1 Januari 2025

**Langkah:**
1. Reset semua data
2. Set tanggal mulai = **1 Januari 2025**
3. Sistem akan otomatis menghitung: Minggu ke-3 (karena sudah lewat 14 hari)
4. Jika ingin mulai dari minggu ke-1, set **Minggu Ke = 1** secara manual

#### Skenario 3: Reset & Mulai dari Tanggal di Masa Depan
**Contoh:**
- Tanggal sekarang: 15 Januari 2025
- Tanggal mulai yang diinginkan: 1 Februari 2025

**Langkah:**
1. Reset semua data
2. Set tanggal mulai = **1 Februari 2025**
3. Sistem akan otomatis menghitung: Minggu ke-1 (karena belum lewat tanggal mulai)

---

## 13. STRUKTUR PROJECT

```
tabungan-kawanua/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── data/                 # Endpoint untuk data storage
│   │   │   └── route.ts         # GET/POST untuk JSONBin.io
│   │   └── email/                # Endpoint untuk email
│   │       └── route.ts         # POST untuk kirim email
│   ├── globals.css               # Global CSS styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React Components
│   ├── AdminPanel.tsx            # Panel admin
│   ├── Dashboard.tsx             # Dashboard utama
│   ├── MembersList.tsx           # Daftar anggota
│   ├── KasTraffic.tsx            # Grafik kas & transaksi
│   ├── StatsCard.tsx             # Card statistik
│   ├── AddMemberModal.tsx        # Modal tambah anggota
│   ├── EditMemberModal.tsx       # Modal edit anggota
│   ├── AdminLoginModal.tsx       # Modal login admin
│   ├── WeekCompletionModal.tsx   # Modal konfirmasi minggu
│   ├── GalleryModal.tsx          # Modal gallery
│   ├── WhatsAppTemplate.tsx      # Template WhatsApp
│   └── ...                       # Komponen lainnya
├── lib/                          # Utility functions
│   ├── email.ts                  # Email service (Resend)
│   ├── schedule.ts               # Schedule utilities
│   ├── security.ts               # Security utilities
│   └── password-constant.ts     # Password constant
├── store/                        # State management
│   └── store.ts                  # Zustand store (state & actions)
├── public/                       # Static files
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
├── vercel.json                   # Vercel configuration
└── README.md                     # File ini
```

### Penjelasan Folder Penting:

- **`app/`**: Next.js 14 App Router - semua pages dan API routes
- **`components/`**: React components yang reusable
- **`lib/`**: Utility functions dan helper functions
- **`store/`**: Zustand store untuk state management global
- **`public/`**: Static assets (images, icons, dll)

---

## 14. TROUBLESHOOTING

### ❌ Error: "Cannot find module"

**Solusi**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Port 3000 already in use"

**Solusi**:
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain:
PORT=3001 npm run dev
```

### ❌ Build Error di Vercel

**Solusi**:
1. Test build lokal: `npm run build`
2. Cek error di Vercel build logs
3. Pastikan Node.js version di Vercel sesuai (18.x atau lebih)
4. Pastikan semua environment variables sudah di-set

### ❌ Data Tidak Tersimpan

**Solusi**:
1. Pastikan `JSONBIN_BIN_ID` dan `JSONBIN_API_KEY` sudah di-set
2. Cek JSONBin.io dashboard untuk melihat data
3. Pastikan network request tidak di-block browser
4. Cek browser console untuk error

### ❌ Email Tidak Terkirim

**Solusi**:
1. Pastikan `RESEND_API_KEY` sudah di-set
2. Pastikan email admin sudah di-set di Admin Panel
3. Cek email spam/junk folder
4. Cek Resend dashboard untuk error logs

### ❌ Upload Gambar Gagal

**Solusi**:
1. Pastikan `NEXT_PUBLIC_IMGBB_API_KEY` sudah di-set
2. Pastikan API key valid
3. File tidak lebih dari 32MB (batas ImgBB)
4. Format file didukung (JPG, PNG, GIF, WebP, dll)

### ❌ Aplikasi Lemot/Lag

**Solusi**:
1. Pastikan koneksi internet stabil
2. Clear browser cache
3. Cek apakah ada error di browser console
4. Pastikan environment variables sudah benar
5. Restart development server

### ❓ FAQ

#### Q: Apakah perlu membuat file `.env` lokal?
**A: TIDAK!** Semua environment variables di-set langsung di Vercel Dashboard. File `.env` hanya untuk development lokal (opsional).

#### Q: Bagaimana jika lupa set environment variable?
**A:** Bisa ditambahkan kapan saja di Vercel → Settings → Environment Variables, lalu **Redeploy**.

#### Q: Apakah email wajib di-setup?
**A: TIDAK!** Email notification adalah fitur opsional. Aplikasi tetap berjalan tanpa email, hanya tidak akan mengirim notifikasi email.

#### Q: Apakah data akan hilang setelah deploy?
**A: TIDAK!** Data tersimpan di JSONBin.io, jadi akan tetap ada setelah deploy.

#### Q: Apakah tanggal mulai bisa di-set di masa lalu?
**A: YA, BISA!** Sistem akan menghitung minggu berdasarkan tanggal mulai tersebut. Misalnya jika tanggal mulai 1 Januari dan sekarang 15 Januari, sistem akan menghitung minggu ke-3.

#### Q: Bagaimana cara mencegah auto-calculation mengganggu?
**A:** Set **Minggu Ke** secara manual dari input field di Panel Admin. Setelah itu, sistem akan masuk ke manual mode dan tidak akan menghitung ulang secara otomatis.

---

## 📝 CHECKLIST SEBELUM DEPLOY

- [ ] Node.js 18.x atau lebih terinstall
- [ ] Code sudah di-push ke GitHub
- [ ] Repository sudah di-import ke Vercel
- [ ] Environment variable `JSONBIN_BIN_ID` sudah di-set
- [ ] Environment variable `JSONBIN_API_KEY` sudah di-set
- [ ] Environment variable `NEXT_PUBLIC_IMGBB_API_KEY` sudah di-set
- [ ] (Opsional) Environment variable `RESEND_API_KEY` sudah di-set
- [ ] (Opsional) Environment variable `RESEND_FROM_EMAIL` sudah di-set
- [ ] Semua environment variables sudah di-centang untuk Production, Preview, Development
- [ ] Build berhasil di local (`npm run build`)

---

## 🚀 QUICK START COMMANDS

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build untuk production
npm run build

# Jalankan production build
npm start

# Lint code
npm run lint
```

---

## 💳 INFO REKENING

- **Bank**: BCA
- **No. Rekening**: 6115876019
- **Atas Nama**: FIKRI MOBILIU

---

## 📞 SUPPORT & REFERENSI

### Links Penting:
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **JSONBin.io**: https://jsonbin.io
- **Resend**: https://resend.com
- **ImgBB**: https://api.imgbb.com/

### Jika Ada Masalah:
1. Cek error di browser console (F12)
2. Cek build logs di Vercel Dashboard
3. Pastikan semua requirements sudah terpenuhi
4. Pastikan environment variables sudah benar
5. Coba restart development server atau redeploy

---

## 📄 LICENSE

MIT License - Feel free to use and modify as needed.

---

## ✅ SELESAI!

**Selamat!** Anda sudah berhasil setup dan menjalankan project Tabungan Kawanua! 🎉

Jika ada pertanyaan atau masalah, silakan cek troubleshooting section di atas.

**Happy Coding!** 💻✨
