# 🧮 KALKULATOR HPP CERDAS V2

**Kalkulator Harga Pokok Produksi (HPP) yang Komprehensif dengan Manajemen Stok dan Rekomendasi Pembelian**

Sebuah aplikasi web interaktif yang dirancang khusus untuk membantu pelaku usaha kecil, UKM, dan produsen rumahan mengelola biaya produksi, stok bahan baku, dan kemasan dengan mudah dan akurat.

---

## ✨ Fitur Utama (V2)

### 1. **Manajemen Produk**
- ✅ Tambahkan produk baru dengan nama, berat/jumlah, dan satuan
- ✅ Pilih dari berbagai satuan standar (gram, kg, ml, liter, unit, pcs, box)
- ✅ Opsi satuan custom untuk kebutuhan khusus
- ✅ Kelola multiple produk sekaligus
- ✅ Hapus produk yang tidak diperlukan

### 2. **Input Bahan Baku (Komprehensif)**
- ✅ Tambahkan bahan baku satu per satu untuk setiap produk
- ✅ **Input nama toko pembeli** untuk tracking supplier
- ✅ **Harga per 1 buah** - catat harga satuan bahan
- ✅ **Harga per bagian** - otomatis dihitung dari harga per buah dibagi jumlah yang digunakan
- ✅ Masukkan jumlah bahan yang digunakan dalam produk
- ✅ Pilih satuan untuk setiap bahan
- ✅ **Manajemen stok** - catat stok tersisa dan stok minimal
- ✅ Edit bahan yang sudah diinput jika ada kesalahan
- ✅ Hapus bahan yang tidak diperlukan

### 3. **Manajemen Kemasan**
- ✅ Tambahkan berbagai jenis kemasan dengan ukuran berbeda
- ✅ Input harga per kemasan
- ✅ Edit dan hapus kemasan
- ✅ Harga kemasan otomatis ditambahkan ke total HPP

### 4. **Perhitungan HPP Otomatis & Detail**
- ✅ Kalkulasi real-time saat menambah bahan dan kemasan
- ✅ Total biaya bahan baku ditampilkan terpisah
- ✅ Total biaya kemasan ditampilkan terpisah
- ✅ Total HPP produk (bahan + kemasan)
- ✅ Hitung HPP per satuan dengan input fleksibel
- ✅ Semua perhitungan terjadi di sisi klien (cepat & responsif)

### 5. **Manajemen Stok & Rekomendasi**
- ✅ **Tracking stok bahan baku** - catat stok tersisa dalam satuan
- ✅ **Stok minimal** - tentukan batas stok minimal untuk setiap bahan
- ✅ **Rekomendasi pembelian otomatis** - sistem akan memberikan alert jika stok hampir habis
- ✅ **Informasi toko** - lihat toko pembeli untuk setiap bahan
- ✅ **Harga referensi** - harga per buah untuk memudahkan pembelian ulang

### 6. **Tampilan Hasil yang Rapi**
- ✅ Tabel interaktif dengan detail lengkap
- ✅ Subtotal untuk setiap bahan
- ✅ Total HPP produk
- ✅ HPP per satuan yang dapat dikustomisasi
- ✅ Desain responsif untuk semua ukuran layar

### 7. **Ekspor Data**
- ✅ **Unduh PDF**: Laporan profesional dengan format siap cetak
- ✅ **Unduh Excel**: File spreadsheet untuk analisis lebih lanjut
- ✅ Informasi produk, bahan, dan kemasan lengkap dalam setiap export
- ✅ Timestamp otomatis pada setiap file

### 8. **Halaman Informasi**
- ✅ Penjelasan lengkap tentang HPP
- ✅ Fitur unggulan aplikasi
- ✅ Rumus dasar HPP
- ✅ Tips penggunaan kalkulator

### 9. **Progressive Web App (PWA)**
- ✅ Instalasi sebagai aplikasi native di perangkat
- ✅ Bekerja offline dengan caching otomatis
- ✅ Akses cepat dari home screen
- ✅ Sinkronisasi data lokal

---

## 🎨 Desain & UX

- **Warna Profesional**: Biru tua (#1e3a5f) dan abu-abu elegan
- **Nuansa Teknologi & Keuangan**: Desain modern dengan sentuhan profesional
- **Responsif**: Sempurna di desktop, tablet, dan mobile
- **Aksesibilitas**: Kontras warna optimal, navigasi intuitif
- **Performa**: Optimasi untuk kecepatan dan efisiensi

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur semantik
- **CSS3**: Styling modern dengan Grid & Flexbox
- **JavaScript (Vanilla)**: Logika aplikasi tanpa dependency berat

### Libraries
- **jsPDF 2.5.1**: Ekspor ke format PDF
- **SheetJS (XLSX) 0.18.5**: Ekspor ke format Excel
- **Service Worker**: Offline support dan PWA

### Storage
- **LocalStorage**: Penyimpanan data lokal di browser
- **Cache API**: Caching untuk PWA

---

## 📁 Struktur File

```
web_hpp_3nov2025/
├── index.html          # File HTML utama
├── styles.css          # Stylesheet lengkap
├── app.js              # Logika aplikasi JavaScript
├── manifest.json       # Konfigurasi PWA
├── sw.js               # Service Worker
└── README.md           # Dokumentasi ini
```

---

## 🚀 Cara Menggunakan

### 1. **Membuka Aplikasi**
- Buka file `index.html` di browser modern
- Atau akses melalui server lokal/hosting

### 2. **Membuat Produk Baru**
```
1. Klik tab "Kalkulator"
2. Isi form "Produk" di sidebar:
   - Nama Produk: Contoh "Kue Brownies"
   - Berat/Jumlah: Contoh "500"
   - Satuan: Pilih "g" (gram)
3. Klik tombol "Tambah Produk"
```

### 3. **Menambah Bahan Baku**
```
1. Pilih produk dari daftar di sebelah kiri
2. Klik tab "Bahan Baku"
3. Isi form "Bahan Baku":
   - Nama Bahan: Contoh "Tepung Terigu"
   - Toko Pembeli: Contoh "Toko Maju" (opsional)
   - Harga per 1 Buah: Contoh "5000" (Rp 5.000)
   - Jumlah Digunakan: Contoh "200"
   - Satuan: Pilih "g"
   - Stok Tersisa: Contoh "1000" (dalam satuan yang dipilih)
   - Stok Minimal: Contoh "500" (alert jika stok di bawah ini)
4. Klik tombol "Tambah Bahan"
5. Ulangi untuk bahan lainnya
```

### 4. **Menambah Kemasan**
```
1. Pilih produk dari daftar
2. Klik tab "Kemasan"
3. Isi form "Kemasan":
   - Nama Kemasan: Contoh "Kotak Kecil"
   - Ukuran: Contoh "500g"
   - Harga per Kemasan: Contoh "2000" (Rp 2.000)
4. Klik tombol "Tambah Kemasan"
5. Ulangi untuk kemasan lainnya
```

### 5. **Mengedit Bahan Baku atau Kemasan**
```
1. Lihat daftar bahan/kemasan di tabel
2. Klik tombol ✏️ (edit) pada item yang ingin diubah
3. Form akan otomatis terisi dengan data tersebut
4. Ubah data yang diperlukan
5. Klik tombol "Update" untuk menyimpan perubahan
```

### 6. **Melihat Kalkulasi HPP**
```
1. Klik tab "Kalkulasi HPP"
2. Lihat hasil perhitungan:
   - Total Biaya Bahan: Jumlah dari semua bahan baku
   - Total Biaya Kemasan: Jumlah dari semua kemasan
   - Total HPP Produk: Bahan + Kemasan
   - HPP per Satuan: Masukkan jumlah satuan untuk melihat HPP per unit
     Contoh: Masukkan "100" untuk melihat HPP per 100g
```

### 7. **Melihat Rekomendasi Pembelian**
```
1. Klik tab "Rekomendasi"
2. Sistem akan menampilkan bahan yang stoknya hampir habis
3. Setiap rekomendasi menampilkan:
   - Nama bahan
   - Toko pembeli
   - Harga per buah
   - Stok saat ini vs stok minimal
   - Status alert
```

### 8. **Mengunduh Hasil**
```
1. Klik tab "Kalkulasi HPP"
2. Klik "📄 Unduh PDF" untuk laporan profesional
3. Atau klik "📊 Unduh Excel" untuk analisis lebih lanjut
4. File akan otomatis diunduh dengan nama produk dan tanggal
```

### 9. **Mempelajari HPP**
```
- Klik tab "Informasi"
- Baca penjelasan lengkap tentang HPP
- Lihat fitur unggulan aplikasi
```

---

## 💾 Penyimpanan Data

Semua data produk dan bahan baku disimpan secara otomatis di **LocalStorage** browser Anda:
- Data tersimpan permanen sampai Anda menghapusnya
- Data tidak akan hilang saat menutup browser
- Setiap perubahan disimpan secara real-time
- Untuk menghapus semua data: Buka DevTools → Application → LocalStorage → Hapus

---

## 📱 Instalasi sebagai PWA

### Di Desktop (Chrome/Edge)
```
1. Buka aplikasi di browser
2. Klik ikon "Install" di address bar
3. Klik "Install"
4. Aplikasi akan tersimpan di desktop/menu aplikasi
```

### Di Mobile (Android)
```
1. Buka aplikasi di Chrome
2. Tap menu (⋮) → "Install app"
3. Tap "Install"
4. Aplikasi akan tersimpan di home screen
```

### Di Mobile (iOS)
```
1. Buka aplikasi di Safari
2. Tap tombol Share (↗)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. Aplikasi akan tersimpan di home screen
```

---

## 🔒 Keamanan & Privacy

- ✅ **Semua perhitungan terjadi di sisi klien** (browser)
- ✅ **Tidak ada data yang dikirim ke server**
- ✅ **Data disimpan lokal di perangkat Anda**
- ✅ **Tidak ada tracking atau analytics**
- ✅ **Aman untuk data bisnis sensitif**

---

## 📊 Contoh Perhitungan

### Produk: Kue Brownies (500g)

| Nama Bahan | Harga/Satuan | Jumlah | Satuan | Subtotal |
|-----------|-------------|--------|--------|----------|
| Tepung Terigu | Rp 5.000 | 200 | g | Rp 1.000 |
| Coklat Bubuk | Rp 80.000 | 50 | g | Rp 4.000 |
| Telur | Rp 1.500 | 3 | butir | Rp 4.500 |
| Mentega | Rp 60.000 | 100 | g | Rp 6.000 |
| **Total HPP** | | | | **Rp 15.500** |
| **HPP per 100g** | | | | **Rp 3.100** |

---

## 🎯 Manfaat Menggunakan Kalkulator HPP Cerdas

### Untuk UKM & Produsen Rumahan
1. **Penetapan Harga Jual yang Tepat**: Tahu berapa biaya produksi sebenarnya
2. **Analisis Profitabilitas**: Identifikasi produk mana yang paling menguntungkan
3. **Efisiensi Biaya**: Temukan peluang menghemat biaya produksi
4. **Perencanaan Bisnis**: Buat keputusan berdasarkan data akurat
5. **Laporan Keuangan**: Siapkan data untuk perpajakan dan audit
6. **Skalabilitas**: Pahami bagaimana biaya berubah saat produksi meningkat

---

## 🌐 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Opera | ✅ | ✅ |

---

## ⚙️ Tips Penggunaan Optimal

### 1. **Catat Semua Bahan**
Jangan lupa mencatat semua bahan baku, termasuk yang kecil sekalipun, untuk akurasi maksimal.

### 2. **Gunakan Harga Akurat**
Gunakan harga beli terakhir atau rata-rata harga untuk hasil yang lebih akurat.

### 3. **Perbarui Secara Berkala**
Update harga bahan secara berkala untuk mencerminkan kondisi pasar terkini.

### 4. **Ekspor Hasil Secara Rutin**
Simpan hasil perhitungan dalam format PDF atau Excel untuk referensi dan analisis.

### 5. **Bandingkan Produk**
Gunakan kalkulator untuk membandingkan HPP berbagai produk dan strategi penetapan harga.

### 6. **Tambahkan Biaya Lainnya**
Catatan: Kalkulator fokus pada bahan baku. Untuk analisis lengkap, tambahkan biaya tenaga kerja dan overhead secara manual.

---

## 🐛 Troubleshooting

### Data Tidak Tersimpan?
- Pastikan browser memungkinkan LocalStorage
- Cek apakah mode Private/Incognito aktif (data tidak tersimpan di mode ini)
- Bersihkan cache browser dan coba lagi

### Tidak Bisa Ekspor PDF/Excel?
- Pastikan browser memiliki akses ke download
- Cek apakah popup blocker menghalangi
- Coba browser lain jika masalah persisten

### Aplikasi Lambat?
- Refresh halaman (Ctrl+R atau Cmd+R)
- Bersihkan cache browser
- Tutup tab lain yang berat

### PWA Tidak Bisa Diinstal?
- Pastikan menggunakan HTTPS (jika di hosting)
- Coba browser Chrome atau Edge
- Refresh halaman dan coba lagi

---

## 📝 Catatan Penting

### Rumus HPP Dasar
```
HPP = Jumlah Bahan Baku + Biaya Tenaga Kerja Langsung + Biaya Overhead Produksi
```

**Catatan**: Kalkulator HPP Cerdas fokus pada perhitungan bahan baku. Untuk analisis lengkap, tambahkan biaya tenaga kerja dan overhead secara manual.

---

## 🤝 Kontribusi & Feedback

Kami terbuka untuk saran dan perbaikan. Jika Anda memiliki ide fitur baru atau menemukan bug, silakan hubungi kami.

---

## 📄 Lisensi

Aplikasi ini dibuat untuk membantu UKM dan produsen rumahan Indonesia. Bebas digunakan untuk keperluan pribadi dan bisnis.

---

## 👨‍💻 Dibuat dengan ❤️

**Kalkulator HPP Cerdas** - Membantu UKM Indonesia berkembang melalui manajemen biaya yang lebih baik.

---

## 📞 Dukungan

Jika Anda membutuhkan bantuan atau memiliki pertanyaan, silakan:
- Baca dokumentasi di halaman "Informasi"
- Coba tips troubleshooting di atas
- Hubungi tim support kami

---

**Versi**: 1.0.0  
**Terakhir Diperbarui**: 2025  
**Status**: Aktif & Terus Dikembangkan

---

Terima kasih telah menggunakan **Kalkulator HPP Cerdas**! 🎉
