import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // ============================================
  // 1. MENTORS
  // ============================================
  const mentors = await Promise.all([
    prisma.mentor.upsert({
      where: { email: 'mentor.piano@musicsphere.com' },
      update: {},
      create: {
        id: 'mentor-piano',
        name: 'Mr. Pianist',
        email: 'mentor.piano@musicsphere.com',
        phone: '081234567801',
        expertise: 'Piano',
        bio: 'Pianis profesional dengan pengalaman 10 tahun mengajar piano pop dan klasik.',
        status: 'active',
      },
    }),
    prisma.mentor.upsert({
      where: { email: 'mentor.vocal@musicsphere.com' },
      update: {},
      create: {
        id: 'mentor-vocal',
        name: 'Ms. Voran',
        email: 'mentor.vocal@musicsphere.com',
        phone: '081234567802',
        expertise: 'Vokal',
        bio: 'Pelatih vokal berpengalaman dengan spesialisasi teknik pernapasan dan kontrol suara.',
        status: 'active',
      },
    }),
    prisma.mentor.upsert({
      where: { email: 'mentor.guitar@musicsphere.com' },
      update: {},
      create: {
        id: 'mentor-guitar',
        name: 'Mr. Hendrix',
        email: 'mentor.guitar@musicsphere.com',
        phone: '081234567803',
        expertise: 'Gitar',
        bio: 'Gitaris profesional dengan keahlian rock, blues, dan akustik.',
        status: 'active',
      },
    }),
    prisma.mentor.upsert({
      where: { email: 'mentor.drum@musicsphere.com' },
      update: {},
      create: {
        id: 'mentor-drum',
        name: 'Mr. Beat',
        email: 'mentor.drum@musicsphere.com',
        phone: '081234567804',
        expertise: 'Drum',
        bio: 'Drummer profesional dengan pengalaman di berbagai genre musik.',
        status: 'active',
      },
    }),
    prisma.mentor.upsert({
      where: { email: 'mentor.ukulele@musicsphere.com' },
      update: {},
      create: {
        id: 'mentor-ukulele',
        name: 'Ms. Strings',
        email: 'mentor.ukulele@musicsphere.com',
        phone: '081234567805',
        expertise: 'Ukulele',
        bio: 'Pemain ukulele berpengalaman dengan pendekatan mengajar yang menyenangkan.',
        status: 'active',
      },
    }),
  ]);
  console.log(`✅ Seeded ${mentors.length} mentors`);

  // ============================================
  // 2. COURSES (dengan mentor assignment)
  // ============================================
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-piano' },
      update: { mentorId: 'mentor-piano', registrationFee: 200000, monthlyFee: 350000 },
      create: {
        id: 'course-piano',
        title: 'Piano Pop Mastery',
        description:
          'Master the piano with our comprehensive course covering everything from basic scales to complex compositions. You will learn basic scales and chords, hand independence, reading lead sheets, and improvisation techniques.',
        registrationFee: 200000,
        monthlyFee: 350000,
        mentorId: 'mentor-piano',
        image:
          'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-vocal' },
      update: { mentorId: 'mentor-vocal', registrationFee: 200000, monthlyFee: 350000 },
      create: {
        id: 'course-vocal',
        title: 'Vocal Training Pro',
        description:
          'Unlock the full potential of your voice with professional vocal coaching techniques. Improve your range, tone, and confidence with breathing exercises, pitch control, and performance skills.',
        registrationFee: 200000,
        monthlyFee: 350000,
        mentorId: 'mentor-vocal',
        image:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-guitar' },
      update: { mentorId: 'mentor-guitar', registrationFee: 200000, monthlyFee: 350000 },
      create: {
        id: 'course-guitar',
        title: 'Guitar Essentials',
        description:
          'Learn the techniques of guitar legends. From power chords to soulful solos, start your journey with the guitar.',
        registrationFee: 200000,
        monthlyFee: 350000,
        mentorId: 'mentor-guitar',
        image:
          'https://images.unsplash.com/photo-1510915304691-17fe78505d3a?q=80&w=2070&auto=format&fit=crop',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-drum' },
      update: { mentorId: 'mentor-drum', registrationFee: 200000, monthlyFee: 350000 },
      create: {
        id: 'course-drum',
        title: 'Drum Mastery',
        description:
          'Kuasai teknik drum dari dasar hingga mahir. Belajar ritme, koordinasi, dan berbagai genre musik.',
        registrationFee: 200000,
        monthlyFee: 350000,
        mentorId: 'mentor-drum',
        image:
          'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-ukulele' },
      update: { mentorId: 'mentor-ukulele', registrationFee: 200000, monthlyFee: 350000 },
      create: {
        id: 'course-ukulele',
        title: 'Ukulele Fun',
        description:
          'Belajar ukulele dengan cara yang menyenangkan. Cocok untuk pemula yang ingin bermain musik dengan instrumen yang sederhana.',
        registrationFee: 200000,
        monthlyFee: 350000,
        mentorId: 'mentor-ukulele',
        image:
          'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?q=80&w=2068&auto=format&fit=crop',
      },
    }),
  ]);
  console.log(`✅ Seeded ${courses.length} courses`);

  // ============================================
  // 3. USERS (Admin + Students)
  // ============================================
  await prisma.user.upsert({
    where: { email: 'admin@musicsphere.com' },
    update: {},
    create: {
      id: 'user-admin',
      name: 'Admin Music Sphere',
      email: 'admin@musicsphere.com',
      password: 'admin123',
      role: 'admin',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'budi@gmail.com' },
    update: {},
    create: {
      id: 'user-student-1',
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      password: 'password123',
      role: 'student',
      profile: {
        create: {
          address: 'Jl. Merdeka No. 10, Jakarta Selatan',
          dateOfBirth: new Date('2000-05-15'),
          instrument: 'Piano',
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'siti@gmail.com' },
    update: {},
    create: {
      id: 'user-student-2',
      name: 'Siti Nurhaliza',
      email: 'siti@gmail.com',
      password: 'password123',
      role: 'student',
      profile: {
        create: {
          address: 'Jl. Sudirman No. 25, Bandung',
          dateOfBirth: new Date('2001-08-22'),
          instrument: 'Vocal',
        },
      },
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'andi@gmail.com' },
    update: {},
    create: {
      id: 'user-student-3',
      name: 'Andi Wijaya',
      email: 'andi@gmail.com',
      password: 'password123',
      role: 'student',
      profile: {
        create: {
          address: 'Jl. Diponegoro No. 5, Surabaya',
          dateOfBirth: new Date('1999-12-01'),
          instrument: 'Guitar',
        },
      },
    },
  });
  console.log(`✅ Seeded users: admin + 3 students`);

  // ============================================
  // 4. COURSE SCHEDULES (sample booked slots)
  // ============================================
  const courseSchedules = await Promise.all([
    // Budi → Piano, Senin 11:00
    prisma.courseSchedule.upsert({
      where: { id: 'schedule-1' },
      update: {},
      create: {
        id: 'schedule-1',
        courseId: 'course-piano',
        mentorId: 'mentor-piano',
        day: 'Senin',
        startTime: '11:00',
        endTime: '11:45',
        room: 'Studio 1',
        maxStudents: 1,
        status: 'active',
      },
    }),
    // Siti → Vocal, Selasa 13:00
    prisma.courseSchedule.upsert({
      where: { id: 'schedule-2' },
      update: {},
      create: {
        id: 'schedule-2',
        courseId: 'course-vocal',
        mentorId: 'mentor-vocal',
        day: 'Selasa',
        startTime: '13:00',
        endTime: '13:45',
        room: 'Studio 2',
        maxStudents: 1,
        status: 'active',
      },
    }),
    // Andi → Guitar, Rabu 15:00
    prisma.courseSchedule.upsert({
      where: { id: 'schedule-3' },
      update: {},
      create: {
        id: 'schedule-3',
        courseId: 'course-guitar',
        mentorId: 'mentor-guitar',
        day: 'Rabu',
        startTime: '15:00',
        endTime: '15:45',
        room: 'Studio 3',
        maxStudents: 1,
        status: 'active',
      },
    }),
  ]);
  console.log(`✅ Seeded ${courseSchedules.length} course schedules`);

  // ============================================
  // 5. SCHEDULE ENROLLMENTS
  // ============================================
  await Promise.all([
    prisma.scheduleEnrollment.upsert({
      where: { id: 'se-1' },
      update: {},
      create: {
        id: 'se-1',
        scheduleId: 'schedule-1',
        userId: student1.id,
        status: 'enrolled',
      },
    }),
    prisma.scheduleEnrollment.upsert({
      where: { id: 'se-2' },
      update: {},
      create: {
        id: 'se-2',
        scheduleId: 'schedule-2',
        userId: student2.id,
        status: 'enrolled',
      },
    }),
    prisma.scheduleEnrollment.upsert({
      where: { id: 'se-3' },
      update: {},
      create: {
        id: 'se-3',
        scheduleId: 'schedule-3',
        userId: student3.id,
        status: 'enrolled',
      },
    }),
  ]);
  console.log(`✅ Seeded schedule enrollments`);

  // ============================================
  // 6. ENROLLMENTS
  // ============================================
  const enrollments = await Promise.all([
    // Budi → Piano (active)
    prisma.enrollment.upsert({
      where: { id: 'enroll-1' },
      update: {},
      create: {
        id: 'enroll-1',
        userId: student1.id,
        courseId: 'course-piano',
        status: 'active',
        totalSessions: 24,
        completedSessions: 4,
        scheduleId: 'schedule-1',
      },
    }),
    // Siti → Vocal (active)
    prisma.enrollment.upsert({
      where: { id: 'enroll-3' },
      update: {},
      create: {
        id: 'enroll-3',
        userId: student2.id,
        courseId: 'course-vocal',
        status: 'active',
        totalSessions: 24,
        completedSessions: 2,
        scheduleId: 'schedule-2',
      },
    }),
    // Andi → Guitar (active)
    prisma.enrollment.upsert({
      where: { id: 'enroll-4' },
      update: {},
      create: {
        id: 'enroll-4',
        userId: student3.id,
        courseId: 'course-guitar',
        status: 'active',
        totalSessions: 24,
        completedSessions: 6,
        scheduleId: 'schedule-3',
      },
    }),
  ]);
  console.log(`✅ Seeded ${enrollments.length} enrollments`);

  // ============================================
  // 7. BILLS
  // ============================================
  const bills = await Promise.all([
    // Budi - Piano Registration (paid)
    prisma.bill.upsert({
      where: { id: 'bill-reg-1' },
      update: {},
      create: {
        id: 'bill-reg-1',
        userId: student1.id,
        courseId: 'course-piano',
        type: 'registration',
        amount: 200000,
        lateFee: 0,
        month: 'Januari 2026',
        dueDate: new Date('2026-01-15'),
        status: 'paid',
        paymentDate: new Date('2026-01-10'),
      },
    }),
    // Budi - Piano Februari (monthly, unpaid)
    prisma.bill.upsert({
      where: { id: 'bill-1' },
      update: {},
      create: {
        id: 'bill-1',
        userId: student1.id,
        courseId: 'course-piano',
        type: 'monthly',
        amount: 350000,
        lateFee: 0,
        month: 'Februari 2026',
        dueDate: new Date('2026-02-10'),
        status: 'unpaid',
      },
    }),
    // Budi - Piano Januari (monthly, paid)
    prisma.bill.upsert({
      where: { id: 'bill-3' },
      update: {},
      create: {
        id: 'bill-3',
        userId: student1.id,
        courseId: 'course-piano',
        type: 'monthly',
        amount: 350000,
        lateFee: 0,
        month: 'Januari 2026',
        dueDate: new Date('2026-01-10'),
        status: 'paid',
        paymentDate: new Date('2026-01-08'),
      },
    }),
    // Siti - Vocal Registration (paid)
    prisma.bill.upsert({
      where: { id: 'bill-reg-2' },
      update: {},
      create: {
        id: 'bill-reg-2',
        userId: student2.id,
        courseId: 'course-vocal',
        type: 'registration',
        amount: 200000,
        lateFee: 0,
        month: 'Januari 2026',
        dueDate: new Date('2026-01-20'),
        status: 'paid',
        paymentDate: new Date('2026-01-18'),
      },
    }),
    // Siti - Vocal Februari (unpaid)
    prisma.bill.upsert({
      where: { id: 'bill-4' },
      update: {},
      create: {
        id: 'bill-4',
        userId: student2.id,
        courseId: 'course-vocal',
        type: 'monthly',
        amount: 350000,
        lateFee: 0,
        month: 'Februari 2026',
        dueDate: new Date('2026-02-10'),
        status: 'unpaid',
      },
    }),
    // Andi - Guitar Registration (paid)
    prisma.bill.upsert({
      where: { id: 'bill-reg-3' },
      update: {},
      create: {
        id: 'bill-reg-3',
        userId: student3.id,
        courseId: 'course-guitar',
        type: 'registration',
        amount: 200000,
        lateFee: 0,
        month: 'Desember 2025',
        dueDate: new Date('2025-12-20'),
        status: 'paid',
        paymentDate: new Date('2025-12-18'),
      },
    }),
    // Andi - Guitar Januari (overdue + denda)
    prisma.bill.upsert({
      where: { id: 'bill-6' },
      update: {},
      create: {
        id: 'bill-6',
        userId: student3.id,
        courseId: 'course-guitar',
        type: 'monthly',
        amount: 355000, // 350000 + 5000 denda
        lateFee: 5000,
        month: 'Januari 2026',
        dueDate: new Date('2026-01-10'),
        status: 'overdue',
      },
    }),
    // Andi - Guitar Februari (unpaid)
    prisma.bill.upsert({
      where: { id: 'bill-7' },
      update: {},
      create: {
        id: 'bill-7',
        userId: student3.id,
        courseId: 'course-guitar',
        type: 'monthly',
        amount: 350000,
        lateFee: 0,
        month: 'Februari 2026',
        dueDate: new Date('2026-02-10'),
        status: 'unpaid',
      },
    }),
  ]);
  console.log(`✅ Seeded ${bills.length} bills`);

  // ============================================
  // 9. CHAT MESSAGES
  // ============================================
  const messages = await Promise.all([
    prisma.chatMessage.upsert({
      where: { id: 'msg-1' },
      update: {},
      create: {
        id: 'msg-1',
        userId: student1.id,
        sender: 'user',
        text: 'Halo admin, saya mau tanya jadwal kelas piano minggu depan.',
        isRead: true,
        createdAt: new Date('2026-02-12T09:00:00'),
      },
    }),
    prisma.chatMessage.upsert({
      where: { id: 'msg-2' },
      update: {},
      create: {
        id: 'msg-2',
        userId: student1.id,
        sender: 'admin',
        text: 'Halo Budi! Jadwal kelas piano tetap seperti biasa ya, Senin jam 11:00.',
        isRead: true,
        createdAt: new Date('2026-02-12T09:15:00'),
      },
    }),
    prisma.chatMessage.upsert({
      where: { id: 'msg-3' },
      update: {},
      create: {
        id: 'msg-3',
        userId: student1.id,
        sender: 'user',
        text: 'Baik, terima kasih admin!',
        isRead: false,
        createdAt: new Date('2026-02-12T09:20:00'),
      },
    }),
    prisma.chatMessage.upsert({
      where: { id: 'msg-4' },
      update: {},
      create: {
        id: 'msg-4',
        userId: student2.id,
        sender: 'user',
        text: 'Admin, apakah bisa reschedule kelas vocal hari Selasa ke hari Rabu?',
        isRead: false,
        createdAt: new Date('2026-02-13T14:00:00'),
      },
    }),
  ]);
  console.log(`✅ Seeded ${messages.length} chat messages`);

  // ============================================
  // 10. NOTIFICATIONS
  // ============================================
  const notifications = await Promise.all([
    prisma.notification.upsert({
      where: { id: 'notif-1' },
      update: {},
      create: {
        id: 'notif-1',
        userId: student1.id,
        title: 'Tagihan Baru',
        message: 'Tagihan kursus Piano untuk bulan Februari 2026 telah diterbitkan. Silakan lakukan pembayaran sebelum tanggal 10.',
        type: 'info',
        link: '/dashboard/billing',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 'notif-2' },
      update: {},
      create: {
        id: 'notif-2',
        userId: student1.id,
        title: 'Pembayaran Berhasil',
        message: 'Pembayaran kursus Piano bulan Januari 2026 sebesar Rp 350.000 telah dikonfirmasi.',
        type: 'success',
        link: '/dashboard/billing',
        isRead: true,
      },
    }),
    prisma.notification.upsert({
      where: { id: 'notif-3' },
      update: {},
      create: {
        id: 'notif-3',
        userId: student3.id,
        title: 'Tagihan Overdue',
        message: 'Tagihan kursus Guitar bulan Januari 2026 sudah melewati batas waktu. Denda Rp 5.000 telah ditambahkan.',
        type: 'warning',
        link: '/dashboard/billing',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 'notif-4' },
      update: {},
      create: {
        id: 'notif-4',
        userId: student2.id,
        title: 'Selamat Datang!',
        message: 'Selamat bergabung di Music Sphere! Mulai perjalanan musikmu sekarang.',
        type: 'success',
        isRead: true,
      },
    }),
    prisma.notification.upsert({
      where: { id: 'notif-5' },
      update: {},
      create: {
        id: 'notif-5',
        userId: student2.id,
        title: 'Jadwal Kelas Besok',
        message: 'Reminder: Kelas Vocal Training besok Selasa jam 13:00. Jangan lupa ya!',
        type: 'info',
        isRead: false,
      },
    }),
  ]);
  console.log(`✅ Seeded ${notifications.length} notifications`);

  // ============================================
  // 11. PRACTICE CONTENT
  // ============================================
  const practiceContents = await Promise.all([
    // Piano
    prisma.practiceContent.upsert({
      where: { id: 'practice-1' },
      update: {
        title: 'Latihan Dasar Piano - Scales C Mayor',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '10:05',
        course: { connect: { id: 'course-piano' } },
      },
      create: {
        id: 'practice-1',
        title: 'Latihan Dasar Piano - Scales C Mayor',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '10:05',
        course: { connect: { id: 'course-piano' } },
      },
    }),
    prisma.practiceContent.upsert({
      where: { id: 'practice-2' },
      update: {
        title: 'Piano Chord Progressions - Pop Songs',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:10',
        course: { connect: { id: 'course-piano' } },
      },
      create: {
        id: 'practice-2',
        title: 'Piano Chord Progressions - Pop Songs',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:10',
        course: { connect: { id: 'course-piano' } },
      },
    }),
    // Vokal
    prisma.practiceContent.upsert({
      where: { id: 'practice-3' },
      update: {
        title: 'Teknik Vokal - Breathing Exercise',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '08:30',
        course: { connect: { id: 'course-vocal' } },
      },
      create: {
        id: 'practice-3',
        title: 'Teknik Vokal - Breathing Exercise',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '08:30',
        course: { connect: { id: 'course-vocal' } },
      },
    }),
    prisma.practiceContent.upsert({
      where: { id: 'practice-4' },
      update: {
        title: 'Vocal Warmups - Do Re Mi Fa Sol',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:15',
        course: { connect: { id: 'course-vocal' } },
      },
      create: {
        id: 'practice-4',
        title: 'Vocal Warmups - Do Re Mi Fa Sol',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:15',
        course: { connect: { id: 'course-vocal' } },
      },
    }),
    // Guitar
    prisma.practiceContent.upsert({
      where: { id: 'practice-5' },
      update: {
        title: 'Guitar Chord Progressions - Blues Style',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:20',
        course: { connect: { id: 'course-guitar' } },
      },
      create: {
        id: 'practice-5',
        title: 'Guitar Chord Progressions - Blues Style',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:20',
        course: { connect: { id: 'course-guitar' } },
      },
    }),
    prisma.practiceContent.upsert({
      where: { id: 'practice-6' },
      update: {
        title: 'Fingerpicking Dasar untuk Pemula',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1510915304691-17fe78505d3a?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '11:45',
        course: { connect: { id: 'course-guitar' } },
      },
      create: {
        id: 'practice-6',
        title: 'Fingerpicking Dasar untuk Pemula',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1510915304691-17fe78505d3a?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '11:45',
        course: { connect: { id: 'course-guitar' } },
      },
    }),
    // Drum
    prisma.practiceContent.upsert({
      where: { id: 'practice-7' },
      update: {
        title: 'Basic Drum Beats - Rock & Pop',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:45',
        course: { connect: { id: 'course-drum' } },
      },
      create: {
        id: 'practice-7',
        title: 'Basic Drum Beats - Rock & Pop',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:45',
        course: { connect: { id: 'course-drum' } },
      },
    }),
    // Ukulele
    prisma.practiceContent.upsert({
      where: { id: 'practice-8' },
      update: {
        title: 'Ukulele Strumming Patterns untuk Pemula',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '09:30',
        course: { connect: { id: 'course-ukulele' } },
      },
      create: {
        id: 'practice-8',
        title: 'Ukulele Strumming Patterns untuk Pemula',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '09:30',
        course: { connect: { id: 'course-ukulele' } },
      },
    }),
  ]);
  console.log(`✅ Seeded ${practiceContents.length} practice contents`);

  console.log('\n🎵 Seeding complete!');
  console.log('──────────────────────────────────');
  console.log('Admin login  : admin@musicsphere.com / admin123');
  console.log('Student login: budi@gmail.com / password123');
  console.log('Student login: siti@gmail.com / password123');
  console.log('Student login: andi@gmail.com / password123');
  console.log('──────────────────────────────────');
  console.log('\nAturan Bisnis:');
  console.log('- Jam buka: 11:00 - 18:00');
  console.log('- Per sesi: 45 menit + 15 menit jeda');
  console.log('- Private lesson: 1 siswa per slot');
  console.log('- Biaya pendaftaran: Rp 200.000');
  console.log('- Biaya bulanan: Rp 350.000');
  console.log('- Denda keterlambatan: Rp 5.000');
  console.log('- 24 pertemuan per kursus, 1x/minggu');
  console.log('──────────────────────────────────');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
