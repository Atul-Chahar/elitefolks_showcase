'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourse, prefetchLesson } from '../../../lib/courseService';
import { Icon } from '@iconify/react';
import { ChevronRight, Clock, BookOpen, Star, Users, CheckCircle2, Trophy, BarChart, Layout, Rocket, ShieldCheck, Award, Play } from 'lucide-react';

// Strip "Module X:" prefix from titles to avoid duplication with UI labels
const stripModulePrefix = (title: string) => title.replace(/^Module\s+\d+\s*:\s*/i, '');

const CourseDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;

    const { course, isLoading, isError } = useCourse(courseId);

    // Auth & Enrollment State
    const [isEnrolled, setIsEnrolled] = React.useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = React.useState(true);
    const [completedLessons, setCompletedLessons] = React.useState<string[]>([]);
    const [userId, setUserId] = React.useState<string | null>(null);

    // Check enrollment status on mount
    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                const { account } = await import('../../../lib/appwrite');
                const user = await account.get();

                if (user && course && course.id) {
                    setUserId(user.$id);
                    const { dbService } = await import('../../../services/dbService');
                    const enrolled = await dbService.checkEnrollment(user.$id, course.id);
                    setIsEnrolled(enrolled);
                    
                    if (enrolled) {
                        const progress = await dbService.getUserProgress(user.$id, course.id);
                        setCompletedLessons(progress.completedLessons || []);
                    }
                }
            } catch {
                // Not logged in
            }
            setCheckingEnrollment(false);
        };

        if (course) {
            checkStatus();
        }
    }, [course]);

    if (isLoading) {
        return (
            <div className="pt-24 pb-12 px-4 min-h-screen bg-[#0D0D0D] text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-4" />
                    <div className="h-12 w-96 bg-zinc-800 rounded animate-pulse mb-8" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-zinc-900/50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="pt-24 pb-12 px-4 min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
                    <p className="text-zinc-400 mb-8">The course you're looking for doesn't exist or is not available.</p>
                    <Link href="/courses" className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 min-h-screen bg-[#0D0D0D] text-white">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link href="/courses" className="text-zinc-400 hover:text-white transition-colors">
                        ← Back to Courses
                    </Link>
                </nav>

                {/* Course Header */}
                <header className="mb-12">
                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-bold bg-zinc-900/50 border border-white/10 shadow-2xl mb-6 group-hover:scale-105 transition-transform duration-500`}>
                        {course.icon === 'JS' || course.title.includes('JavaScript') ? (
                            <Icon icon="logos:javascript" className="text-4xl" />
                        ) : course.icon === 'GO' || course.title.includes('GO') || course.title.includes('Go') ? (
                            <Icon icon="logos:go" className="text-5xl" />
                        ) : course.icon === 'C++' || course.title.includes('C++') ? (
                            <Icon icon="logos:c-plusplus" className="text-4xl" />
                        ) : course.icon === 'PY' || course.title.includes('Python') ? (
                            <Icon icon="logos:python" className="text-4xl" />
                        ) : (
                            <span className={`font-bold ${course.icon_color || 'text-white'}`}>{course.icon}</span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-manrope mb-4">{course.title}</h1>
                    <p className="text-xl text-zinc-400 mb-6">{course.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center gap-2 text-zinc-300">
                            <BarChart size={14} className="text-orange-400" />{course.level}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center gap-2 text-zinc-300">
                            <Clock size={14} className="text-orange-400" />{course.duration_estimate || (course as any).totalTimeMin ? `${(course as any).totalTimeMin} min` : "Self-Paced"}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center gap-2 text-zinc-300">
                            <Layout size={14} className="text-orange-400" />{course.modules.length} Modules
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center gap-2 text-zinc-300">
                            <BookOpen size={14} className="text-orange-400" />{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                        </span>
                    </div>
                </header>

                {/* Course Outcomes */}
                {course.outcomes && course.outcomes.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(course.outcomes as string[]).map((outcome, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-300 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-colors">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={12} className="text-emerald-400" />
                                    </div>
                                    <span className="text-sm leading-relaxed">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Modules & Lessons */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                    <div className="space-y-4">
                        {course.modules.map((module, moduleIndex) => (
                            <div key={module.id} className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                                <div className="p-5 border-b border-white/5">
                                    <h3 className="text-lg font-semibold">
                                        <span className="text-orange-400 mr-2">Module {moduleIndex + 1}:</span>
                                        {stripModulePrefix(module.title)}
                                    </h3>
                                    <p className="text-sm text-zinc-500 mt-1">{module.lessons.length} lessons</p>
                                </div>
                                <ul>
                                    {module.lessons.map((lesson, lessonIndex) => (
                                        <li key={lesson.id}>
                                            <div
                                                className={`flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 group transition-all duration-300
                                                    ${isEnrolled ? 'cursor-pointer hover:bg-white/[0.03]' : ''}
                                                `}
                                                onClick={() => {
                                                    if (isEnrolled) {
                                                        router.push(`/courses/${course.slug}/lessons/${lesson.slug}`);
                                                    }
                                                }}
                                            >
                                                {completedLessons.includes(lesson.id) ? (
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    </div>
                                                ) : (
                                                    <span className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:text-zinc-300 group-hover:border-white/10 transition-all">
                                                        {lessonIndex + 1}
                                                    </span>
                                                )}
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-semibold transition-colors ${completedLessons.includes(lesson.id) ? 'text-zinc-400' : 'text-zinc-200 group-hover:text-white'}`}>
                                                        {lesson.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-medium">
                                                            <Clock size={10} /> {lesson.timeEstimateMin || lesson.time_estimate_min || 30} min
                                                        </span>
                                                        {lesson.quiz_id && (
                                                            <span className="text-[11px] text-orange-400/70 flex items-center gap-1.5 font-medium">
                                                                <Award size={10} className="text-orange-400" /> Quiz Included
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isEnrolled && (
                                                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Start Course CTA */}
                <div className="mt-12 text-center pb-8">
                    <button
                        onClick={async () => {
                            // If already enrolled, just navigate
                            if (isEnrolled) {
                                router.push(`/courses/${course.slug}/lessons/${course.modules[0]?.lessons[0]?.slug || ''}`);
                                return;
                            }

                            // Otherwise enroll
                            const { enrollUserInCourse } = await import('../../actions/enrollment');
                            const result = await enrollUserInCourse(course.id);

                            if (result.needsLogin) {
                                router.push(`/login?next=/courses/${course.slug}`);
                                return;
                            }

                            if (result.error && result.message !== 'Already enrolled') {
                                alert("Failed to start course: " + result.error);
                                return;
                            }

                            // Manually set enrolled state to update UI immediately before redirect (or if we stay)
                            setIsEnrolled(true);

                            // Redirect to first lesson or dashboard
                            const firstLesson = course.modules[0]?.lessons[0];
                            if (firstLesson) {
                                router.push(`/courses/${course.slug}/lessons/${firstLesson.slug}`);
                            } else {
                                router.push('/dashboard');
                            }
                        }}
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center mx-auto
                            ${isEnrolled
                                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:shadow-green-500/25'
                                : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:shadow-orange-500/25'
                            }
                        `}
                    >
                        {isEnrolled ? (
                            <>
                                Continue Learning
                                <Play size={20} className="ml-3 opacity-80 fill-current" />
                            </>
                        ) : (
                            <>
                                Start Learning Now
                                <Rocket size={20} className="ml-3 opacity-80" />
                            </>
                        )}
                    </button>
                    {isEnrolled && (
                        <p className="mt-4 text-green-400 text-sm font-medium animate-fade-in flex items-center justify-center">
                            <CheckCircle2 size={16} className="mr-2" /> You are enrolled in this course
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
