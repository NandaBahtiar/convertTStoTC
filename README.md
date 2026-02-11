# Project Utility Scripts

Repository ini berisi script utility untuk membantu otomatisasi pembuatan Test Case (TC) dari Test Step (TS).

## Struktur Project

```
.
├── utils/                  # Folder penyimpanan script utility
│   └── convertTStoTC.js    # Script konversi TS ke TC
├── BANDING/                # Folder input untuk file TS (.yml)
├── yml-tc/                 # Folder output untuk file TC (.yml)
├── main.js                 # Entry point untuk menjalankan script
├── package.json            # Konfigurasi project dan dependencies
└── README.md               # Dokumentasi ini
```

## Persiapan (Setup)

1.  Pastikan **Node.js** sudah terinstall di komputer Anda.
2.  Clone repository ini.
3.  Di root folder project, jalankan perintah instalasi (jika ada dependency tambahan):
    ```bash
    npm install
    ```

## Menambahkan File Baru ke Utils

Jika Anda memiliki script utility baru (misalnya `constants.js`, `generateYAMLDirect.js`, dll) yang ingin ditambahkan sesuai struktur yang diinginkan:

1.  **Simpan File**: Letakkan file script Anda di dalam folder `utils/`.
2.  **Format Module**: Pastikan script tersebut menggunakan format ES Modules.
    - Gunakan `export function namaFungsi() { ... }` atau `export default ...`.
    - Hindari penggunaan `require` (gunakan `import`).
3.  **Integrasi**:
    - Buka file `main.js`.
    - Import fungsi dari script baru Anda:
      ```javascript
      import { namaFungsi } from './utils/namaScript.js';
      ```
    - Panggil fungsi tersebut sesuai kebutuhan.

## Cara Menjalankan Script

Script utama saat ini menjalankan konversi dari Test Step (TS) ke Test Case (TC).

### Langkah-langkah:

1.  **Siapkan File Input**:
    - Masukkan file `.yml` yang ingin dikonversi ke dalam folder `BANDING/`.
    - **Penting**: Nama file harus diawali dengan `TS_` (contoh: `TS_TestLogin.yml`) agar terdeteksi oleh script.
    - Format isi file YAML harus memiliki key `label:` pada setiap stepnya.

2.  **Jalankan Script**:
    Buka terminal di root folder project dan jalankan perintah:
    ```bash
    npm start
    ```
    Atau secara manual:
    ```bash
    node main.js
    ```

3.  **Cek Hasil**:
    - File hasil konversi akan muncul di folder `yml-tc/`.
    - Nama file akan otomatis berubah menjadi `TC_...` (contoh: `TC_TestLogin.yml`).
    - Folder `yml-tc/` akan dibuat otomatis jika belum ada.

## Penjelasan Script `convertTStoTC.js`

Script ini melakukan otomatisasi berikut:
- **Scan**: Membaca semua file `TS_*.yml` dari folder `BANDING/`.
- **Parse**: Mengambil step-step berdasarkan `label`.
- **Generate**: Membuat file baru di `yml-tc/` dengan format Maestro yang lengkap meliputi:
    - `appId`, `env`
    - `onFlowStart`, `onFlowComplete`
    - Logic screenshot otomatis.
    - Logic `get-balance.js` (dicomment pada file pertama dan terakhir).
