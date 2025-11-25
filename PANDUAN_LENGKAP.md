# 📚 PANDUAN LENGKAP - Tabungan Kawanua

**Panduan Step-by-Step untuk Setup, Deploy, dan Menggunakan Aplikasi**

---

## 📋 DAFTAR ISI

1. [Quick Start - Deploy dalam 5 Menit](#1-quick-start---deploy-dalam-5-menit)
2. [Setup Environment Variables](#2-setup-environment-variables)
3. [Deploy ke GitHub & Vercel](#3-deploy-ke-github--vercel)
4. [Setup Email Notifikasi](#4-setup-email-notifikasi)
5. [Cara Menggunakan Aplikasi](#5-cara-menggunakan-aplikasi)
6. [Akses Admin](#6-akses-admin)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. QUICK START - Deploy dalam 5 Menit

### ⚡ Langkah Cepat

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

```
JSONBIN_BIN_ID = 6924a61743b1c97be9c2985e
JSONBIN_API_KEY = $2a$10$2lv9FE3jMqDlptKS1uyKnOhck4/sGqnE86mch8iSCILZ7ks2H1Fdi
NEXT_PUBLIC_IMGBB_API_KEY = 03b8de054b52ea6fce573ee060ce9844
```

Centang: ✅ Production, ✅ Preview, ✅ Development

#### 4️⃣ Deploy!
Klik **Deploy** dan tunggu 1-2 menit.

#### 5️⃣ (Opsional) Setup Email
Tambahkan ke Vercel:
```
RESEND_API_KEY = re_hsfWEmB2_JTmRbmnzZCiLjSDJ5yz6UHUk
```
Lalu redeploy.

---

## 2. SETUP ENVIRONMENT VARIABLES

### 📋 Daftar Lengkap Environment Variables

**TIDAK PERLU membuat file `.env` lokal!** Semua environment variables di-set langsung di Vercel Dashboard.

### ✅ Wajib (Required)

#### 1. JSONBIN_BIN_ID
**Deskripsi**: ID Bin dari JSONBin.io untuk menyimpan data aplikasi.

**Value**: 
```
6924a61743b1c97be9c2985e
```

**Cara Dapatkan**:
1. Buka https://jsonbin.io
2. Login/Register
3. Buat bin baru
4. Copy Bin ID dari URL atau dashboard

#### 2. JSONBIN_API_KEY
**Deskripsi**: API Key (Master Key) dari JSONBin.io untuk akses data.

**Value**: 
```
$2a$10$2lv9FE3jMqDlptKS1uyKnOhck4/sGqnE86mch8iSCILZ7ks2H1Fdi
```

**Cara Dapatkan**:
1. Di JSONBin.io dashboard
2. Klik pada bin yang dibuat
3. Copy "Master Key" atau "X-Master-Key"

#### 3. NEXT_PUBLIC_IMGBB_API_KEY
**Deskripsi**: API Key dari ImgBB untuk upload gambar besar (hingga 32MB).

**Value**: 
```
03b8de054b52ea6fce573ee060ce9844
```

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

**Value**: 
```
re_hsfWEmB2_JTmRbmnzZCiLjSDJ5yz6UHUk
```

**Catatan**: 
- Jika tidak di-set, aplikasi tetap berjalan normal
- Email notification tidak akan terkirim
- Fitur email akan di-mock (hanya log di console)

#### 5. RESEND_FROM_EMAIL
**Deskripsi**: Email pengirim untuk notifikasi email.

**Value**: 
```
Tabungan Kawanua <onboarding@resend.dev>
```

**Catatan**: 
- Jika tidak di-set, akan menggunakan default: `onboarding@resend.dev`
- Untuk custom domain, perlu setup domain di Resend terlebih dahulu

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

## 3. DEPLOY KE GITHUB & VERCEL

### 📋 STEP 1: Upload ke GitHub

#### 1.1. Buat Repository Baru di GitHub
1. Buka https://github.com
2. Klik **"+"** (pojok kanan atas) → **"New repository"**
3. Isi:
   - **Repository name**: `tabungan-kawanua` (atau nama lain)
   - **Description**: (opsional)
   - **Visibility**: ✅ Public atau ❌ Private (sesuai kebutuhan)
   - ❌ Jangan centang "Add a README file"
4. Klik **"Create repository"**

#### 1.2. Push Code ke GitHub
Buka terminal/command prompt di folder project Anda, lalu jalankan:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Tabungan Kawanua app"

# Tambahkan remote GitHub
git remote add origin https://github.com/USERNAME/tabungan-kawanua.git
# Ganti USERNAME dengan username GitHub Anda

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Catatan**: Jika diminta login, gunakan GitHub Personal Access Token (bukan password).

### 🚀 STEP 2: Deploy ke Vercel

#### 2.1. Buat Akun Vercel (jika belum)
1. Buka https://vercel.com
2. Klik **"Sign Up"**
3. Pilih **"Continue with GitHub"** (paling mudah)
4. Authorize Vercel untuk akses GitHub

#### 2.2. Import Project dari GitHub
1. Di Vercel Dashboard, klik **"Add New..."** → **"Project"**
2. Pilih repository **"tabungan-kawanua"** dari daftar
3. Klik **"Import"**

#### 2.3. Konfigurasi Project
1. **Project Name**: `tabungan-kawanua` (atau biarkan default)
2. **Framework Preset**: Next.js (otomatis terdeteksi)
3. **Root Directory**: `./` (biarkan default)
4. **Build Command**: `npm run build` (otomatis)
5. **Output Directory**: `.next` (otomatis)
6. **Install Command**: `npm install` (otomatis)

**JANGAN klik "Deploy" dulu!** Kita perlu set environment variables terlebih dahulu.

### 🔐 STEP 3: Setup Environment Variables

Ikuti langkah di [Section 2: Setup Environment Variables](#2-setup-environment-variables)

### 🎉 STEP 4: Deploy!

1. Setelah semua environment variables di-set
2. Klik **"Deploy"** di halaman konfigurasi
3. Tunggu proses build (1-3 menit)
4. Setelah selesai, Vercel akan memberikan URL:
   - Production: `https://tabungan-kawanua.vercel.app`
   - (atau custom domain jika sudah di-set)

### ✅ STEP 5: Verifikasi Deploy

1. Buka URL yang diberikan Vercel
2. Test aplikasi:
   - ✅ Login sebagai admin (password: `1998`)
   - ✅ Tambah/edit anggota
   - ✅ Upload gambar ke gallery
   - ✅ Test email notifikasi (jika sudah setup Resend)

### 🔄 STEP 6: Update Code (Setelah Deploy)

Setiap kali Anda update code:

```bash
# 1. Commit perubahan
git add .
git commit -m "Update: deskripsi perubahan"

# 2. Push ke GitHub
git push origin main

# 3. Vercel otomatis akan redeploy!
```

Vercel akan otomatis mendeteksi push ke GitHub dan melakukan redeploy.

---

## 4. SETUP EMAIL NOTIFIKASI

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

### 🔄 Cara Kerja

**Email Pengirim (FROM)**
- **Sudah di-set otomatis**: `Tabungan Kawanua <onboarding@resend.dev>`
- **Tidak perlu diubah** (kecuali ingin pakai domain sendiri)

**Email Penerima (TO)**
- **Email yang Anda set di Admin Panel**
- **Contoh**: `fikrimobiliu@gmail.com`
- **Ini yang akan menerima notifikasi**

### 📨 Contoh Email yang Diterima

**Dari**: `Tabungan Kawanua <onboarding@resend.dev>`  
**Ke**: `fikrimobiliu@gmail.com`  
**Subject**: `Notifikasi: Budi Menerima Arisan Minggu Ke-3`

**Isi Email**:
```
Halo Admin,

Berikut adalah notifikasi penerimaan arisan:

Anggota: Budi
Minggu Ke: 3
Jumlah: Rp 500.000

Status penerimaan telah ditandai di sistem.

Terima kasih,
Sistem Tabungan Kawanua
```

### ⚙️ Setup Resend (Opsional)

**API Key Resend Anda sudah tersedia:**
```
re_hsfWEmB2_JTmRbmnzZCiLjSDJ5yz6UHUk
```

1. Di Vercel Dashboard → Settings → Environment Variables
2. Tambahkan variable:
   ```
   Name:  RESEND_API_KEY
   Value: re_hsfWEmB2_JTmRbmnzZCiLjSDJ5yz6UHUk
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```
3. (Opsional) Tambahkan `RESEND_FROM_EMAIL`:
   ```
   Name:  RESEND_FROM_EMAIL
   Value: Tabungan Kawanua <onboarding@resend.dev>
   ```
   Atau biarkan kosong (akan pakai default)

4. Redeploy aplikasi

> **Note**: Jika tidak ingin setup email, bisa skip step ini. Aplikasi tetap berjalan normal, hanya email notification tidak akan terkirim.

---

## 5. CARA MENGGUNAKAN APLIKASI

### 👤 Sebagai User Biasa

#### Fitur yang Bisa Diakses:
1. **Lihat Dashboard**
   - ✅ Lihat **Total Kas**
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

Lihat [Section 6: Akses Admin](#6-akses-admin)

---

## 6. AKSES ADMIN

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
- ✅ Set **Email Admin** untuk notifikasi
- ✅ **Tambah Anggota Baru** (tidak terbatas jumlah)
- ✅ **Hapus Anggota** dari sistem
- ✅ **Tandai Penerima** - Menandai anggota yang sudah menerima dana
- ✅ **Template WhatsApp** muncul otomatis setelah tandai penerima

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

## 7. TROUBLESHOOTING

### ❓ FAQ

#### Q: Apakah perlu membuat file `.env` lokal?
**A: TIDAK!** Semua environment variables di-set langsung di Vercel Dashboard. File `.env` hanya untuk development lokal (opsional).

#### Q: Bagaimana jika lupa set environment variable?
**A:** Bisa ditambahkan kapan saja di Vercel → Settings → Environment Variables, lalu **Redeploy**.

#### Q: Apakah email wajib di-setup?
**A: TIDAK!** Email notification adalah fitur opsional. Aplikasi tetap berjalan tanpa email, hanya tidak akan mengirim notifikasi email.

#### Q: Bagaimana cara redeploy setelah menambahkan environment variable?
**A:** 
1. Pergi ke Vercel Dashboard
2. Pilih project
3. Tab **"Deployments"**
4. Klik **"..."** (3 titik) pada deployment terbaru
5. Pilih **"Redeploy"**

#### Q: Apakah data akan hilang setelah deploy?
**A: TIDAK!** Data tersimpan di JSONBin.io, jadi akan tetap ada setelah deploy.

#### Q: Bagaimana cara update aplikasi?
**A:** 
1. Update code di local
2. `git add .` → `git commit -m "..."` → `git push`
3. Vercel otomatis redeploy

### 🆘 Masalah Umum

#### Build Error
- ✅ Pastikan semua dependencies terinstall: `npm install`
- ✅ Test build lokal: `npm run build`
- ✅ Cek error di Vercel build logs

#### Environment Variable Tidak Terdeteksi
- ✅ Pastikan sudah di-set di Vercel Dashboard
- ✅ Pastikan sudah di-centang untuk environment yang tepat
- ✅ **Redeploy** setelah menambahkan variable
- ✅ Cek build logs di Vercel untuk error

#### Email Tidak Terkirim
- ✅ Pastikan `RESEND_API_KEY` sudah di-set
- ✅ Pastikan email admin sudah di-set di Admin Panel
- ✅ Cek email spam/junk folder
- ✅ Pastikan domain sudah verified (jika pakai custom domain)
- ✅ Cek Resend dashboard untuk error logs

#### Data Tidak Tersimpan
- ✅ Pastikan `JSONBIN_BIN_ID` dan `JSONBIN_API_KEY` sudah di-set
- ✅ Cek JSONBin.io dashboard untuk melihat data
- ✅ Pastikan network request tidak di-block

#### Upload Gambar Gagal
- ✅ Pastikan `NEXT_PUBLIC_IMGBB_API_KEY` sudah di-set
- ✅ Pastikan API key valid (bisa test di https://api.imgbb.com/)
- ✅ File tidak lebih dari 32MB (batas ImgBB)
- ✅ Format file didukung (JPG, PNG, GIF, WebP, HEIC, dll)

#### Aplikasi Lemot/Lag
- ✅ Pastikan koneksi internet stabil
- ✅ Clear browser cache
- ✅ Cek apakah ada error di browser console
- ✅ Pastikan environment variables sudah benar
- ✅ Cek Vercel dashboard untuk error logs

---

## 📝 CHECKLIST SEBELUM DEPLOY

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

## 📞 SUPPORT

Jika ada masalah:
1. Cek build logs di Vercel Dashboard
2. Cek browser console untuk error
3. Pastikan semua environment variables sudah benar
4. Coba redeploy

---

## 📚 REFERENSI

- **JSONBin.io**: https://jsonbin.io
- **ImgBB**: https://api.imgbb.com/
- **Resend**: https://resend.com
- **Vercel**: https://vercel.com
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

**Selamat! Aplikasi Anda sudah siap digunakan! 🎉**

