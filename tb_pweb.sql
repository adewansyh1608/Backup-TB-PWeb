-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Jun 2025 pada 18.21
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tb_pweb`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `claim`
--

CREATE TABLE `claim` (
  `id_claim` int(11) NOT NULL,
  `id_laporan` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `tanggal_claim` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `claim`
--

INSERT INTO `claim` (`id_claim`, `id_laporan`, `email`, `tanggal_claim`) VALUES
(33, 27, 'admin123@gmail.com', '2025-06-22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `laporan`
--

CREATE TABLE `laporan` (
  `id_laporan` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jenis_laporan` enum('Penemuan','Kehilangan','','') DEFAULT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `tanggal_kejadian` date DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `tanggal_laporan` date DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto_barang` varchar(255) DEFAULT NULL,
  `status` enum('Waiting for upload verification','Upload verification rejected','On progress','Claimed','Waiting for end verification','End verification rejected','Done') DEFAULT NULL,
  `nama_penemu_penerima` varchar(255) DEFAULT NULL,
  `nohp_penemu_penerima` varchar(15) DEFAULT NULL,
  `tanggal_penyerahan` date DEFAULT NULL,
  `lokasi_penyerahan` varchar(255) DEFAULT NULL,
  `foto_bukti` varchar(255) DEFAULT NULL,
  `verifikasi_action` enum('none','approve','denied') NOT NULL DEFAULT 'none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `laporan`
--

INSERT INTO `laporan` (`id_laporan`, `email`, `jenis_laporan`, `nama_barang`, `tanggal_kejadian`, `lokasi`, `tanggal_laporan`, `deskripsi`, `foto_barang`, `status`, `nama_penemu_penerima`, `nohp_penemu_penerima`, `tanggal_penyerahan`, `lokasi_penyerahan`, `foto_bukti`, `verifikasi_action`) VALUES
(27, 'admin123@gmail.com', 'Kehilangan', 'Botol Minum', '2025-06-16', 'Gedung H', '2025-06-22', 'Botol berwarna hitam', 'uploads/1750608920179.jpeg', 'Claimed', NULL, NULL, NULL, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `email` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `foto_profile` varchar(255) DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `alamat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`email`, `nama`, `password`, `role`, `foto_profile`, `no_telepon`, `alamat`) VALUES
('admin123@gmail.com', 'Admin PWeb', '$2b$10$opUsIlpsGyGjK6F.WTwVneuvaMQP0fhyVlZhDNe3bfptdGQoZ96NS', 'admin', 'uploads/1750607353990.jpg', '08123456789', 'FTI DSI');

-- --------------------------------------------------------

--
-- Struktur dari tabel `riwayat`
--

CREATE TABLE `riwayat` (
  `id_riwayat` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `deskripsi_aktivitas` text DEFAULT NULL,
  `tanggal_aktivitas` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `riwayat`
--

INSERT INTO `riwayat` (`id_riwayat`, `email`, `deskripsi_aktivitas`, `tanggal_aktivitas`) VALUES
(29, 'admin123@gmail.com', 'Membuat laporan (Penemuan - Dompet Eiger)', '2025-06-22'),
(30, 'admin123@gmail.com', 'Membuat laporan (Penemuan - Dompet Eiger Hitam)', '2025-06-22'),
(31, 'admin123@gmail.com', 'Membuat laporan (Kehilangan - Botol Minum)', '2025-06-22'),
(32, 'admin123@gmail.com', 'Mengklaim laporan dengan ID 27', '2025-06-22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `saran`
--

CREATE TABLE `saran` (
  `id_saran` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `deskripsi_saran` text NOT NULL,
  `tanggal_saran` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `simpan`
--

CREATE TABLE `simpan` (
  `id_simpan` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_laporan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `claim`
--
ALTER TABLE `claim`
  ADD PRIMARY KEY (`id_claim`),
  ADD KEY `id_laporan` (`id_laporan`),
  ADD KEY `email` (`email`);

--
-- Indeks untuk tabel `laporan`
--
ALTER TABLE `laporan`
  ADD PRIMARY KEY (`id_laporan`),
  ADD KEY `email` (`email`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `riwayat`
--
ALTER TABLE `riwayat`
  ADD PRIMARY KEY (`id_riwayat`),
  ADD KEY `email` (`email`);

--
-- Indeks untuk tabel `saran`
--
ALTER TABLE `saran`
  ADD PRIMARY KEY (`id_saran`),
  ADD KEY `email` (`email`);

--
-- Indeks untuk tabel `simpan`
--
ALTER TABLE `simpan`
  ADD PRIMARY KEY (`id_simpan`),
  ADD KEY `email` (`email`),
  ADD KEY `id_laporan` (`id_laporan`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `claim`
--
ALTER TABLE `claim`
  MODIFY `id_claim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id_laporan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `riwayat`
--
ALTER TABLE `riwayat`
  MODIFY `id_riwayat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT untuk tabel `saran`
--
ALTER TABLE `saran`
  MODIFY `id_saran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `simpan`
--
ALTER TABLE `simpan`
  MODIFY `id_simpan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `claim`
--
ALTER TABLE `claim`
  ADD CONSTRAINT `claim_ibfk_1` FOREIGN KEY (`id_laporan`) REFERENCES `laporan` (`id_laporan`),
  ADD CONSTRAINT `claim_ibfk_2` FOREIGN KEY (`email`) REFERENCES `pengguna` (`email`);

--
-- Ketidakleluasaan untuk tabel `laporan`
--
ALTER TABLE `laporan`
  ADD CONSTRAINT `laporan_ibfk_1` FOREIGN KEY (`email`) REFERENCES `pengguna` (`email`);

--
-- Ketidakleluasaan untuk tabel `riwayat`
--
ALTER TABLE `riwayat`
  ADD CONSTRAINT `riwayat_ibfk_1` FOREIGN KEY (`email`) REFERENCES `pengguna` (`email`);

--
-- Ketidakleluasaan untuk tabel `saran`
--
ALTER TABLE `saran`
  ADD CONSTRAINT `saran_ibfk_1` FOREIGN KEY (`email`) REFERENCES `pengguna` (`email`);

--
-- Ketidakleluasaan untuk tabel `simpan`
--
ALTER TABLE `simpan`
  ADD CONSTRAINT `simpan_ibfk_1` FOREIGN KEY (`email`) REFERENCES `pengguna` (`email`),
  ADD CONSTRAINT `simpan_ibfk_2` FOREIGN KEY (`id_laporan`) REFERENCES `laporan` (`id_laporan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
