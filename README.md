# Convert TS to TC - Documentation

Script untuk mengkonversi file Test Step (TS) menjadi Test Case (TC) dengan format Maestro yang lengkap.

## 📋 Deskripsi

Script ini akan:
- Membaca semua file `TS_*.yml` dari folder input
- Mengkonversi menjadi file `TC_*.yml` dengan format lengkap
- Menambahkan struktur appId, env, onFlowStart, onFlowComplete
- Generate screenshot dengan nomor urut otomatis
- Comment get-balance.js untuk TC pertama dan terakhir

## 🚀 Cara Penggunaan

### 1. Setup Script

Copy file `src/utils/convertTStoTC.js` ke project generate-label Anda.

### 2. Konfigurasi Path

Edit bagian path di `convertTStoTC.js` sesuai struktur folder Anda:

```javascript
// Jalankan konversi
const inputDir = path.join(__dirname, '../../yml');  // Folder input TS
const outputDir = path.join(__dirname, '../../yml-tc');  // Folder output TC
```

**Contoh konfigurasi:**
- Input dari folder `yml`: `'../../yml'`
- Input dari folder `generated`: `'../../generated'`

### 3. Tambahkan Script ke package.json

Tambahkan script "convert" ke bagian "scripts" di `package.json` Anda:

```json
{
  "scripts": {
    "convert": "node src/utils/convertTStoTC.js"
  }
}
```
Jika Anda ingin menjalankan generate TS dan konversi TC sekaligus, Anda bisa menambahkan:
```json
{
  "scripts": {
    "generate-all": "node src/main.js && npm run convert"
  }
}
```

### 4. Jalankan Script

Pertama, jalankan script `generate` Anda (misalnya, yang menghasilkan file TS):
```bash
npm run generate
```

Setelah itu, jalankan script `convert` untuk mengkonversi file TS ke TC dan menyimpannya di folder `yml-tc`:
```bash
npm run convert
```

Jika Anda telah menambahkan script `generate-all` ke `package.json`, Anda bisa menjalankan keduanya secara berurutan:
```bash
npm run generate-all
```

## 📁 Struktur Folder

```
project/
├── src/
│   └── utils/
│       └── convertTStoTC.js    # Script konversi
├── yml/                     # Folder input (TS files)
│   ├── TS_CHG_TRF_44_001.yml
│   ├── TS_CHG_TRF_44_002.yml
│   └── ...
└── yml-tc/                      # Folder output (TC files)
    ├── TC_CHG_TRF_44_001.yml
    ├── TC_CHG_TRF_44_002.yml
    └── ...
```

## 📝 Format Input (TS)

File TS harus memiliki format:

```yaml
- runFlow:
    label: 01 - Klik menu transfer dari home screen
    commands: 
- runFlow:
    label: 02 - Pengguna akan diarahkan ke transfer landing page
    commands: 
```

## 📄 Format Output (TC)

Script akan generate TC dengan format:

```yaml
appId: ${APP_ID}
env:
  PATH_FOLDER_REPORT: ./reports
onFlowStart:
  - runScript:
      file: ../../../../configs/onflowstart/onflowstart.js
      env:
        JIRA_ISSUE: ${JIRA_ISSUE}
  - runScript:
      file: get-balance.js
      env:
        BALANCE_STATE: ${BALANCE_STATE}
onFlowComplete:
  - runScript: ../../../../configs/onflowend/onflowend.js

---

- runFlow:
    label: 01 - Klik menu transfer dari home screen
    commands:
      - runFlow:
          label: 02 - Pengguna akan diarahkan ke transfer landing page
          commands:
            - waitForAnimationToEnd
            - takeScreenshot: ${output.PATH_FOLDER_REPORT}/01_TC_CHG_TRF_44_001
```

## ⚙️ Fitur Khusus

### 1. Auto Comment get-balance.js

Script otomatis akan comment bagian get-balance.js untuk:
- ✅ TC pertama (001)
- ✅ TC terakhir (misal 011)

File TC tengah akan tetap aktif (tidak di-comment).

**TC Pertama & Terakhir:**
```yaml
  # - runScript:
  #     file: get-balance.js
  #     env:
  #       BALANCE_STATE: ${BALANCE_STATE}
```

**TC Tengah:**
```yaml
  - runScript:
      file: get-balance.js
      env:
        BALANCE_STATE: ${BALANCE_STATE}
```

### 2. Auto Screenshot Numbering

Screenshot akan diberi nomor urut otomatis:
- `01_TC_CHG_TRF_44_001`
- `02_TC_CHG_TRF_44_001`
- dst.

## 🔧 Kustomisasi

### Mengubah Path onFlowStart

Edit di function `generateTCContent`:

```javascript
onFlowStart:
  - runScript:
      file: ../../../../configs/onflowstart/onflowstart.js  // Ubah path ini
```

### Mengubah Logic Comment get-balance.js

Edit di function `generateTCContent`:

```javascript
// Contoh: Comment hanya TC pertama
const isFirstOrLast = index === 0;

// Contoh: Comment semua TC
const isFirstOrLast = true;

// Contoh: Tidak comment sama sekali
const isFirstOrLast = false;
```

### Menambahkan Step Tambahan

Edit di function `generateTCContent` untuk menambahkan commands tambahan:

```javascript
runFlowSteps += `            - waitForAnimationToEnd\n`;
runFlowSteps += `            - takeScreenshot: ...\n`;
runFlowSteps += `            - assertVisible: "Transfer Berhasil"\n`;  // Tambahan
```

## 🐛 Troubleshooting

### Error: ENOENT no such file or directory

**Penyebab:** Folder input tidak ditemukan

**Solusi:** 
1. Cek path di `convertTStoTC.js`
2. Pastikan folder input ada dan berisi file TS_*.yml

```javascript
const inputDir = path.join(__dirname, '../../yml');  // Sesuaikan path
```

### Error: Cannot find module

**Penyebab:** Script dijalankan dari folder yang salah

**Solusi:** Pastikan menjalankan dari root project
```bash
cd generate-label-maestro
npm run convert
```

### File TC tidak ter-generate

**Penyebab:** File TS tidak sesuai format atau tidak dimulai dengan `TS_`

**Solusi:**
1. Pastikan nama file dimulai dengan `TS_`
2. Pastikan file berformat `.yml`
3. Cek format isi file sesuai contoh
