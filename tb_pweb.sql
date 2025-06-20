-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 20 Jun 2025 pada 16.16
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
(15, 19, 'admin123@gmail.com', '2025-06-20'),
(16, 3, 'andre123@gmail.com', '2025-06-20'),
(17, 14, 'andre123@gmail.com', '2025-06-20');

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
(3, 'admin123@gmail.com', 'Penemuan', 'Botol', '2025-05-19', 'Gedung A', '2025-06-01', 'adfre updated', 'uploads/1748788466640.jpeg', 'Claimed', NULL, NULL, NULL, NULL, NULL, 'none'),
(5, 'andre123@gmail.com', 'Penemuan', 'Botol', '2025-05-29', 'Gedung F', '2025-06-01', 'doiahsoidhaodho', 'uploads/1748800965663.jpeg', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(6, 'admin123@gmail.com', 'Penemuan', 'Logo', '2025-05-11', 'Gedung J', '2025-06-02', 'Hilangggg', 'uploads/1750158749029.png', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(14, 'admin123@gmail.com', 'Kehilangan', 'Motor', '2025-06-06', 'Gedung A', '2025-06-17', 'fsvwafevefew', 'uploads/1750158051445.jpg', 'Claimed', NULL, NULL, NULL, NULL, NULL, 'none'),
(15, 'admin123@gmail.com', 'Penemuan', 'HP', '2025-06-20', 'Gedung B', '2025-06-18', 'hvoihoiwheivjo', 'uploads/1750252562925.jpg', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(16, 'admin123@gmail.com', 'Penemuan', 'Dompet Levis Mantap', '2025-06-15', 'Gedung B', '2025-06-18', 'dompet hilang isi kartu pelajar', 'uploads/1750260250907.jpeg', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(17, 'admin123@gmail.com', 'Kehilangan', 'test', '2025-06-17', 'naldhaih', '2025-06-19', 'iodweoihfoiwehvoiwe', 'uploads/1750323641356.jpeg', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(18, 'admin123@gmail.com', 'Penemuan', 'gewgweg', '2025-06-06', 'gewegw', '2025-06-19', 'gwergew', 'uploads/1750357910962.jpeg', 'On progress', NULL, NULL, NULL, NULL, NULL, 'none'),
(19, 'andre123@gmail.com', 'Kehilangan', 'test aja', '2025-06-10', 'Gedung J', '2025-06-20', 'gebseseiofsoidfoisdnvoisdnvoidsvuinsdoivnsdoivnsdoihoisdhiodshvoisdhviosdnvoisdnvoidsnvoisdnvoidsn', 'uploads/1750428760510.jpeg', 'Claimed', NULL, NULL, NULL, NULL, NULL, 'none');

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
('admin123@gmail.com', 'Admin Ganteng', '$2b$10$ReXgJRmXsipZbzgxoluVSOEKg6SZ0hfxcawWDrA0AwBINhMY2KmBm', 'admin', 'uploads/1748722531384.jpg', '08123456789', 'kos pak tasrif'),
('alia123@gmail.com', 'Alia', '$2b$10$SugsX3Vo4zHCqAKLG6JMkuvU3YxO3Ge.f4Om5h..oz/5zurokEFIG', 'user', NULL, '081234567892', 'padang'),
('andre123@gmail.com', 'Andre', '$2b$10$i7G5VS.LEXz6Q6EJiqW15.CXpNPRa4JbjtcyXtZJXVhcBCOueuvFm', 'user', NULL, '08123456789', 'padang');

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
  MODIFY `id_claim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id_laporan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `riwayat`
--
ALTER TABLE `riwayat`
  MODIFY `id_riwayat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `saran`
--
ALTER TABLE `saran`
  MODIFY `id_saran` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `simpan`
--
ALTER TABLE `simpan`
  MODIFY `id_simpan` int(11) NOT NULL AUTO_INCREMENT;

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
