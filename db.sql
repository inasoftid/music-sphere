-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_kursus_musik
CREATE DATABASE IF NOT EXISTS `db_kursus_musik` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_kursus_musik`;

-- Dumping structure for table db_kursus_musik.bill
CREATE TABLE IF NOT EXISTS `bill` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `amount` int NOT NULL,
  `lateFee` int NOT NULL DEFAULT '0',
  `month` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `paymentDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `snapToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtransOrderId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtransTransactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bill_midtransOrderId_key` (`midtransOrderId`),
  KEY `Bill_userId_fkey` (`userId`),
  KEY `Bill_courseId_fkey` (`courseId`),
  CONSTRAINT `Bill_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Bill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.bill: ~9 rows (approximately)
INSERT INTO `bill` (`id`, `userId`, `courseId`, `type`, `amount`, `lateFee`, `month`, `dueDate`, `status`, `paymentDate`, `createdAt`, `snapToken`, `midtransOrderId`, `midtransTransactionId`, `paymentMethod`) VALUES
	('029c5ab0-aa52-4288-a723-eaa95824e2de', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'course-drum', 'registration', 200000, 0, 'Februari 2026', '2026-02-23 02:35:53.752', 'paid', NULL, '2026-02-16 02:35:53.766', '9900f8e5-2144-42c4-ad2e-69c260cbc758', 'MS-029c5ab0-1771209355118', NULL, NULL),
	('bill-1', 'user-student-1', 'course-piano', 'monthly', 350000, 0, 'Februari 2026', '2026-02-10 00:00:00.000', 'unpaid', NULL, '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-3', 'user-student-1', 'course-piano', 'monthly', 350000, 0, 'Januari 2026', '2026-01-10 00:00:00.000', 'paid', '2026-01-08 00:00:00.000', '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-4', 'user-student-2', 'course-vocal', 'monthly', 350000, 0, 'Februari 2026', '2026-02-10 00:00:00.000', 'unpaid', NULL, '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-6', 'user-student-3', 'course-guitar', 'monthly', 355000, 5000, 'Januari 2026', '2026-01-10 00:00:00.000', 'overdue', NULL, '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-7', 'user-student-3', 'course-guitar', 'monthly', 350000, 0, 'Februari 2026', '2026-02-10 00:00:00.000', 'unpaid', NULL, '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-reg-1', 'user-student-1', 'course-piano', 'registration', 200000, 0, 'Januari 2026', '2026-01-15 00:00:00.000', 'paid', '2026-01-10 00:00:00.000', '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-reg-2', 'user-student-2', 'course-vocal', 'registration', 200000, 0, 'Januari 2026', '2026-01-20 00:00:00.000', 'paid', '2026-01-18 00:00:00.000', '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL),
	('bill-reg-3', 'user-student-3', 'course-guitar', 'registration', 200000, 0, 'Desember 2025', '2025-12-20 00:00:00.000', 'paid', '2025-12-18 00:00:00.000', '2026-02-16 02:19:21.588', NULL, NULL, NULL, NULL);

-- Dumping structure for table db_kursus_musik.chatmessage
CREATE TABLE IF NOT EXISTS `chatmessage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ChatMessage_userId_fkey` (`userId`),
  CONSTRAINT `ChatMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.chatmessage: ~8 rows (approximately)
INSERT INTO `chatmessage` (`id`, `userId`, `sender`, `text`, `isRead`, `createdAt`) VALUES
	('16254955-19fd-44fd-8c78-85c5d2793a9e', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'user', 'kalo mau daftar lebih dari satu kursus gimana?', 0, '2026-02-16 14:49:38.160'),
	('281c7ddb-de05-4300-9f03-39abce8b1550', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'admin', 'iya gimana?', 0, '2026-02-16 14:47:31.361'),
	('3c276ac4-a364-40d4-821d-063d8d0304f4', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'user', 'apanya min?', 0, '2026-02-16 14:51:50.198'),
	('595e7874-c545-4a42-a602-a7624d6b7ffa', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'user', 'Admin mau tanya', 0, '2026-02-16 14:43:07.715'),
	('70c0bc3b-039a-48d4-8509-85f0290beb0a', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'admin', 'Test Coba', 0, '2026-02-16 14:51:37.653'),
	('msg-1', 'user-student-1', 'user', 'Halo admin, saya mau tanya jadwal kelas piano minggu depan.', 1, '2026-02-12 02:00:00.000'),
	('msg-2', 'user-student-1', 'admin', 'Halo Budi! Jadwal kelas piano tetap seperti biasa ya, Senin jam 11:00.', 1, '2026-02-12 02:15:00.000'),
	('msg-3', 'user-student-1', 'user', 'Baik, terima kasih admin!', 0, '2026-02-12 02:20:00.000'),
	('msg-4', 'user-student-2', 'user', 'Admin, apakah bisa reschedule kelas vocal hari Selasa ke hari Rabu?', 0, '2026-02-13 07:00:00.000');

-- Dumping structure for table db_kursus_musik.course
CREATE TABLE IF NOT EXISTS `course` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `registrationFee` int NOT NULL DEFAULT '200000',
  `monthlyFee` int NOT NULL DEFAULT '350000',
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `mentorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Course_mentorId_fkey` (`mentorId`),
  CONSTRAINT `Course_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `mentor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.course: ~5 rows (approximately)
INSERT INTO `course` (`id`, `title`, `description`, `registrationFee`, `monthlyFee`, `image`, `createdAt`, `updatedAt`, `mentorId`) VALUES
	('course-drum', 'Drum Mastery', 'Kuasai teknik drum dari dasar hingga mahir. Belajar ritme, koordinasi, dan berbagai genre musik.', 200000, 350000, 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop', '2026-02-16 02:19:21.550', '2026-02-16 02:19:21.550', 'mentor-drum'),
	('course-guitar', 'Guitar Essentials', 'Learn the techniques of guitar legends. From power chords to soulful solos, start your journey with the guitar.', 200000, 350000, '/uploads/courses/1771214143489-kkgk23.jpg', '2026-02-16 02:19:21.550', '2026-02-16 03:55:43.516', 'mentor-guitar'),
	('course-piano', 'Piano Pop Mastery', 'Master the piano with our comprehensive course covering everything from basic scales to complex compositions. You will learn basic scales and chords, hand independence, reading lead sheets, and improvisation techniques.', 200000, 350000, 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop', '2026-02-16 02:19:21.550', '2026-02-16 02:19:21.550', 'mentor-piano'),
	('course-ukulele', 'Ukulele Fun', 'Belajar ukulele dengan cara yang menyenangkan. Cocok untuk pemula yang ingin bermain musik dengan instrumen yang sederhana.', 200000, 350000, '/uploads/courses/1771214152656-frw7yy.jpg', '2026-02-16 02:19:21.550', '2026-02-16 03:55:52.680', 'mentor-ukulele'),
	('course-vocal', 'Vocal Training Pro', 'Unlock the full potential of your voice with professional vocal coaching techniques. Improve your range, tone, and confidence with breathing exercises, pitch control, and performance skills.', 200000, 350000, '/uploads/courses/1771214161593-o8bach.jpg', '2026-02-16 02:19:21.550', '2026-02-16 03:56:01.622', 'mentor-vocal');

-- Dumping structure for table db_kursus_musik.courseschedule
CREATE TABLE IF NOT EXISTS `courseschedule` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mentorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `day` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maxStudents` int NOT NULL DEFAULT '1',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CourseSchedule_courseId_fkey` (`courseId`),
  KEY `CourseSchedule_mentorId_fkey` (`mentorId`),
  CONSTRAINT `CourseSchedule_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CourseSchedule_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `mentor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.courseschedule: ~3 rows (approximately)
INSERT INTO `courseschedule` (`id`, `courseId`, `mentorId`, `day`, `startTime`, `endTime`, `room`, `maxStudents`, `status`, `createdAt`, `updatedAt`) VALUES
	('e60f2a95-6f37-4837-b92f-e1effb6d02b6', 'course-drum', 'mentor-drum', 'Senin', '11:00', '11:45', 'Studio 2', 1, 'active', '2026-02-16 02:35:53.732', '2026-02-16 02:35:53.732'),
	('schedule-1', 'course-piano', 'mentor-piano', 'Senin', '11:00', '11:45', 'Studio 1', 1, 'active', '2026-02-16 02:19:21.572', '2026-02-16 02:19:21.572'),
	('schedule-2', 'course-vocal', 'mentor-vocal', 'Selasa', '13:00', '13:45', 'Studio 2', 1, 'active', '2026-02-16 02:19:21.572', '2026-02-16 02:19:21.572'),
	('schedule-3', 'course-guitar', 'mentor-guitar', 'Rabu', '15:00', '15:45', 'Studio 3', 1, 'active', '2026-02-16 02:19:21.572', '2026-02-16 02:19:21.572');

-- Dumping structure for table db_kursus_musik.enrollment
CREATE TABLE IF NOT EXISTS `enrollment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_payment',
  `enrolledAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `totalSessions` int NOT NULL DEFAULT '24',
  `completedSessions` int NOT NULL DEFAULT '0',
  `scheduleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Enrollment_userId_fkey` (`userId`),
  KEY `Enrollment_courseId_fkey` (`courseId`),
  CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.enrollment: ~3 rows (approximately)
INSERT INTO `enrollment` (`id`, `userId`, `courseId`, `status`, `enrolledAt`, `totalSessions`, `completedSessions`, `scheduleId`) VALUES
	('37e06360-f4bf-430c-ad37-e133b1364fcb', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'course-drum', 'active', '2026-02-16 02:35:53.749', 24, 0, 'e60f2a95-6f37-4837-b92f-e1effb6d02b6'),
	('enroll-1', 'user-student-1', 'course-piano', 'active', '2026-02-16 02:19:21.582', 24, 4, 'schedule-1'),
	('enroll-3', 'user-student-2', 'course-vocal', 'active', '2026-02-16 02:19:21.582', 24, 2, 'schedule-2'),
	('enroll-4', 'user-student-3', 'course-guitar', 'active', '2026-02-16 02:19:21.582', 24, 6, 'schedule-3');

-- Dumping structure for table db_kursus_musik.mentor
CREATE TABLE IF NOT EXISTS `mentor` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expertise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Mentor_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.mentor: ~5 rows (approximately)
INSERT INTO `mentor` (`id`, `name`, `email`, `phone`, `expertise`, `photo`, `bio`, `status`, `createdAt`, `updatedAt`) VALUES
	('mentor-drum', 'Mr. Beat', 'mentor.drum@musicsphere.com', '081234567804', 'Drum', NULL, 'Drummer profesional dengan pengalaman di berbagai genre musik.', 'active', '2026-02-16 02:19:21.540', '2026-02-16 02:19:21.540'),
	('mentor-guitar', 'Mr. Hendrix', 'mentor.guitar@musicsphere.com', '081234567803', 'Gitar', NULL, 'Gitaris profesional dengan keahlian rock, blues, dan akustik.', 'active', '2026-02-16 02:19:21.540', '2026-02-16 02:19:21.540'),
	('mentor-piano', 'Mr. Pianist', 'mentor.piano@musicsphere.com', '081234567801', 'Piano', NULL, 'Pianis profesional dengan pengalaman 10 tahun mengajar piano pop dan klasik.', 'active', '2026-02-16 02:19:21.540', '2026-02-16 02:19:21.540'),
	('mentor-ukulele', 'Ms. Strings', 'mentor.ukulele@musicsphere.com', '081234567805', 'Ukulele', NULL, 'Pemain ukulele berpengalaman dengan pendekatan mengajar yang menyenangkan.', 'active', '2026-02-16 02:19:21.540', '2026-02-16 02:19:21.540'),
	('mentor-vocal', 'Ms. Voran', 'mentor.vocal@musicsphere.com', '081234567802', 'Vokal', NULL, 'Pelatih vokal berpengalaman dengan spesialisasi teknik pernapasan dan kontrol suara.', 'active', '2026-02-16 02:19:21.540', '2026-02-16 02:19:21.540');

-- Dumping structure for table db_kursus_musik.notification
CREATE TABLE IF NOT EXISTS `notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.notification: ~5 rows (approximately)
INSERT INTO `notification` (`id`, `userId`, `title`, `message`, `type`, `link`, `isRead`, `createdAt`) VALUES
	('notif-1', 'user-student-1', 'Tagihan Baru', 'Tagihan kursus Piano untuk bulan Februari 2026 telah diterbitkan. Silakan lakukan pembayaran sebelum tanggal 10.', 'info', '/dashboard/billing', 0, '2026-02-16 02:19:21.631'),
	('notif-2', 'user-student-1', 'Pembayaran Berhasil', 'Pembayaran kursus Piano bulan Januari 2026 sebesar Rp 350.000 telah dikonfirmasi.', 'success', '/dashboard/billing', 1, '2026-02-16 02:19:21.631'),
	('notif-3', 'user-student-3', 'Tagihan Overdue', 'Tagihan kursus Guitar bulan Januari 2026 sudah melewati batas waktu. Denda Rp 5.000 telah ditambahkan.', 'warning', '/dashboard/billing', 0, '2026-02-16 02:19:21.631'),
	('notif-4', 'user-student-2', 'Selamat Datang!', 'Selamat bergabung di Music Sphere! Mulai perjalanan musikmu sekarang.', 'success', NULL, 1, '2026-02-16 02:19:21.631'),
	('notif-5', 'user-student-2', 'Jadwal Kelas Besok', 'Reminder: Kelas Vocal Training besok Selasa jam 13:00. Jangan lupa ya!', 'info', NULL, 0, '2026-02-16 02:19:21.631');

-- Dumping structure for table db_kursus_musik.practicecontent
CREATE TABLE IF NOT EXISTS `practicecontent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnailUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '00:00',
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PracticeContent_courseId_fkey` (`courseId`),
  CONSTRAINT `PracticeContent_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.practicecontent: ~8 rows (approximately)
INSERT INTO `practicecontent` (`id`, `title`, `thumbnailUrl`, `videoUrl`, `duration`, `courseId`, `createdAt`) VALUES
	('practice-1', 'Latihan Dasar Piano - Scales C Mayor', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '10:05', 'course-piano', '2026-02-16 02:19:21.637'),
	('practice-2', 'Piano Chord Progressions - Pop Songs', 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '18:10', 'course-piano', '2026-02-16 02:19:21.637'),
	('practice-3', 'Teknik Vokal - Breathing Exercise', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '08:30', 'course-vocal', '2026-02-16 02:19:21.637'),
	('practice-4', 'Vocal Warmups - Do Re Mi Fa Sol', 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '12:15', 'course-vocal', '2026-02-16 02:19:21.637'),
	('practice-5', 'Guitar Chord Progressions - Blues Style', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '15:20', 'course-guitar', '2026-02-16 02:19:21.637'),
	('practice-6', 'Fingerpicking Dasar untuk Pemula', 'https://images.unsplash.com/photo-1510915304691-17fe78505d3a?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '11:45', 'course-guitar', '2026-02-16 02:19:21.637'),
	('practice-7', 'Basic Drum Beats - Rock & Pop', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '12:45', 'course-drum', '2026-02-16 02:19:21.637'),
	('practice-8', 'Ukulele Strumming Patterns untuk Pemula', 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?q=80&w=2070&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '09:30', 'course-ukulele', '2026-02-16 02:19:21.637');

-- Dumping structure for table db_kursus_musik.scheduleenrollment
CREATE TABLE IF NOT EXISTS `scheduleenrollment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `enrolledAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ScheduleEnrollment_scheduleId_userId_key` (`scheduleId`,`userId`),
  KEY `ScheduleEnrollment_userId_fkey` (`userId`),
  CONSTRAINT `ScheduleEnrollment_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `courseschedule` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ScheduleEnrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.scheduleenrollment: ~3 rows (approximately)
INSERT INTO `scheduleenrollment` (`id`, `scheduleId`, `userId`, `status`, `enrolledAt`) VALUES
	('155e63c0-ad7d-48c1-b984-8005d401d209', 'e60f2a95-6f37-4837-b92f-e1effb6d02b6', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'enrolled', '2026-02-16 02:35:53.741'),
	('se-1', 'schedule-1', 'user-student-1', 'enrolled', '2026-02-16 02:19:21.577'),
	('se-2', 'schedule-2', 'user-student-2', 'enrolled', '2026-02-16 02:19:21.578'),
	('se-3', 'schedule-3', 'user-student-3', 'enrolled', '2026-02-16 02:19:21.578');

-- Dumping structure for table db_kursus_musik.studentprofile
CREATE TABLE IF NOT EXISTS `studentprofile` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `instrument` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentProfile_userId_key` (`userId`),
  CONSTRAINT `StudentProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.studentprofile: ~3 rows (approximately)
INSERT INTO `studentprofile` (`id`, `userId`, `address`, `dateOfBirth`, `instrument`) VALUES
	('50494e46-a53f-4478-9e02-33fe06c7a9f7', 'user-student-1', 'Jl. Merdeka No. 10, Jakarta Selatan', '2000-05-15 00:00:00.000', 'Piano'),
	('6f086447-7cff-4c35-ac39-274c803c940c', 'user-student-2', 'Jl. Sudirman No. 25, Bandung', '2001-08-22 00:00:00.000', 'Vocal'),
	('c3fd53d3-4f55-4609-8d27-314f381607c0', 'user-student-3', 'Jl. Diponegoro No. 5, Surabaya', '1999-12-01 00:00:00.000', 'Guitar'),
	('f23b8fb8-ccff-4671-b591-866ad5b4583d', '9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', NULL, NULL, NULL);

-- Dumping structure for table db_kursus_musik.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `verificationCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verificationCodeExpires` datetime(3) DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_kursus_musik.user: ~4 rows (approximately)
INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `avatarUrl`, `createdAt`, `updatedAt`, `verificationCode`, `verificationCodeExpires`, `emailVerified`) VALUES
	('9f74e5b5-03f8-4f29-a7c3-d75cfeded8f6', 'Hasanudin', 'setio.adinataarianto@gmail.com', '12345678', 'student', NULL, '2026-02-16 02:33:13.181', '2026-02-16 02:34:38.870', NULL, NULL, '2026-02-16 02:34:38.868'),
	('user-admin', 'Admin Music Sphere', 'admin@musicsphere.com', 'admin123', 'admin', NULL, '2026-02-16 02:19:21.557', '2026-02-16 02:19:21.557', NULL, NULL, NULL),
	('user-student-1', 'Budi Santoso', 'budi@gmail.com', 'password123', 'student', NULL, '2026-02-16 02:19:21.562', '2026-02-16 02:19:21.562', NULL, NULL, NULL),
	('user-student-2', 'Siti Nurhaliza', 'siti@gmail.com', 'password123', 'student', NULL, '2026-02-16 02:19:21.566', '2026-02-16 02:19:21.566', NULL, NULL, NULL),
	('user-student-3', 'Andi Wijaya', 'andi@gmail.com', 'password123', 'student', NULL, '2026-02-16 02:19:21.569', '2026-02-16 02:19:21.569', NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
