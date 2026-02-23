import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  registrationFee: number;
  monthlyFee: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(`[LandingCourses] Fetched ${courses.length} courses`);
    return courses;
  } catch (error) {
    console.error('[LandingCourses] Error fetching courses:', error);
    return [];
  }
}

export async function LandingCourses() {
  const courses = await getCourses();

  const levelColor: Record<string, string> = {
    Beginner: 'bg-green-50 text-green-700 border-green-200',
    Intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Advanced: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <section id="courses" className="py-20 lg:py-28 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-600 font-semibold text-sm tracking-wide uppercase">Kursus Kami</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Pilihan Kelas Musik
          </h2>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            Berbagai pilihan instrumen dan level untuk semua kalangan, dari pemula hingga mahir.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-red-800/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
                {/* Level UI element removed */}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                {/* Info Row (duration and instructor) UI elements removed */}

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Biaya Bulanan</span>
                    <span className="text-lg font-bold text-white">
                      Rp {course.monthlyFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Pendaftaran</span>
                    <span className="text-sm font-medium text-gray-300">
                      Rp {course.registrationFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            Belum ada kursus tersedia saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
