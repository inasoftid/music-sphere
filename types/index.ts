export interface StudentProfile {
  id?: string;
  userId: string;
  address: string;
  dateOfBirth: string;
  instrument: 'Piano Pop' | 'Vokal' | 'Guitar' | 'Ukulele' | 'Drum' | '';
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  registrationFee: number;
  monthlyFee: number;
  image?: string;
  activeStudents: number;
  mentorId?: string;
  mentorName?: string;
}

export interface ScheduleSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  mentorName: string;
}

export interface Bill {
  id: string;
  studentId: string;
  courseName: string;
  type: 'registration' | 'monthly';
  amount: number;
  lateFee: number;
  month: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paymentDate?: string;
}

export interface StudentSchedule {
  id: string;
  courseName: string;
  dayOfWeek: string;
  time: string;
  status: 'active' | 'pending_change' | 'cancelled';
  nextSessionDate: string;
  requestedDay?: string | null;
  requestedTime?: string | null;
  courseId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin' | 'system';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface PracticeContent {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  courseId: string;
  courseName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatarUrl?: string;
  profile?: StudentProfile;
}
