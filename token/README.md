# TokenTea

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Deskripsi

TokenTea adalah proyek pengujian token untuk testnet. Proyek ini menggunakan teknologi blockchain dan smart contract untuk mengelola token.

## Daftar Isi

- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Skrip NPM](#skrip-npm)
- [Kontribusi](#kontribusi)

## Instalasi

Clone repositori:

   ```git clone git@https://github.com/naufalprtm/token.git```

  ```npm install --save @openzeppelin/contracts @nomiclabs/hardhat-waffle  ```

  error?

   ```npm install --save @openzeppelin/contracts @nomiclabs/hardhat-waffle --legacy-peer-deps ```
or

```--force```
saat menggunakan force sebaiknya hati-hati dan pahami vulnerabilities
## Pindah ke direktori proyek:

```cd tokentea```

## Instal dependensi:

```npm install```

## Penggunaan
Jalankan proyek dalam mode pengembangan:


```npm run dev```

Aplikasi akan berjalan di http://localhost:3000.

Buat build proyek:


```npm run build```

Jalankan aplikasi dari build:


```npm start```
Skrip NPM

Proyek ini dilengkapi dengan berbagai skrip NPM untuk mempermudah pengembangan, pengujian, dan lainnya. Beberapa skrip yang tersedia antara lain:

```npm run lint```: Jalankan linting untuk file JavaScript dan TypeScript.
```npm run fix```: Perbaiki otomatis masalah linting.
```npm run format```: Format kode menggunakan Prettier.
```npm run compile```: Kompilasi smart contract.
```npm run test```: Jalankan pengujian menggunakan Hardhat.
```npm run coverage```: Jalankan pengujian dengan laporan cakupan.
Untuk melihat daftar lengkap skrip, lihat bagian Skrip NPM.



Sepertinya ada kesalahan terkait dengan file yang terletak di dalam direktori node_modules dari proyek OpenZeppelin Contracts. Saat ini, Hardhat sedang mencoba untuk mengompilasi file yang terletak di dalam node_modules sebagai bagian dari proyek Anda, dan ini menyebabkan masalah.

Langkah-langkah yang dapat Anda lakukan:

Pastikan Anda berada di direktori proyek utama:

```cd /workspace/token/token```
Hapus direktori node_modules dan file package-lock.json:

```rm -rf node_modules```
```rm package-lock.json```
Kembali ke direktori contracts:

```cd contracts```
Clone OpenZeppelin Contracts ke dalam direktori node_modules:

```git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git node_modules/@openzeppelin/contracts```
Kembali ke direktori proyek utama:

```cd ..```
Jalankan kembali perintah pengujian:

```npx hardhat test```
Jika masalah masih terjadi, Anda mungkin perlu mengonfigurasi Hardhat untuk mengabaikan file di dalam node_modules saat mengompilasi. Dalam file hardhat.config.js, Anda dapat menambahkan konfigurasi berikut:

javascript

```bash
module.exports = {
  // ... konfigurasi lainnya ...
  solidity: {
    settings: {
      // Mengabaikan file di dalam node_modules saat mengompilasi
      external: {
        sources: [
          {
            path: './node_modules/@openzeppelin/contracts',
            patterns: ['*.sol'],
          },
        ],
      },
    },
  },
};
```

Simpan perubahan dan jalankan kembali perintah pengujian:


```npx hardhat test```
Konfigurasi ini seharusnya membantu Hardhat untuk mengabaikan file di dalam node_modules selama proses kompilasi. Jika Anda masih mengalami masalah



Untuk mengonfigurasi Hardhat agar mengabaikan file di dalam node_modules saat proses kompilasi, Anda dapat menambahkan pengaturan eksternal dalam konfigurasi Solidity. Berikut adalah contoh konfigurasi yang dapat Anda gunakan:

```bash
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: '0.8.1',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    paths: {
      sources: ['./contracts'], // Sesuaikan dengan struktur direktori proyek Anda
      tests: './test',
      cache: './cache',
      artifacts: './artifacts',
    },
    // Mengabaikan file di dalam node_modules saat mengompilasi
    external: {
      contracts: [
        {
          path: './node_modules/@openzeppelin/contracts',
          pattern: '**/*.sol',
          // Tambahkan aturan eksklusi untuk file tertentu
          exclude: ['certora/harnesses/AccessControlDefaultAdminRulesHarness.sol'],
        },
      ],
      deployments: {
        path: './node_modules/@openzeppelin/contracts',
        pattern: '**/*.sol',
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://localhost:8545', // Sesuaikan dengan port node lokal Anda
    },
  },
};

```
Pastikan untuk menyesuaikan nilai-nilai seperti sources, tests, cache, dan artifacts sesuai dengan struktur direktori proyek Anda. Konfigurasi ini harus membantu Hardhat untuk mengabaikan file di dalam node_modules selama proses kompilasi.



Kontribusi
Anda dapat berkontribusi pada proyek ini dengan membuka pull requests dan melaporkan issues di https://github.com/naufalprtm/token/issues.

© 2024 Naufal Pratama