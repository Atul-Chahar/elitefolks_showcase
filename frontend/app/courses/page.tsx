'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCourses, prefetchCourse } from '../../lib/courseService';
import { CourseStats } from '../../lib/courseTypes';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Fallback placeholder courses for courses that aren't in the database yet
// Fallback placeholder courses for courses that aren't in the database yet
const PLACEHOLDER_COURSES: any[] = [];

const CoursesPage = () => {
    const router = useRouter();
    const { courses, isLoading, isError, enrolledCourseIds: serverEnrolledIds } = useCourses();
    const [enrolledCourseIds, setEnrolledCourseIds] = React.useState<string[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (serverEnrolledIds && serverEnrolledIds.length > 0) {
            setEnrolledCourseIds(serverEnrolledIds);
        }
    }, [serverEnrolledIds]);


    React.useEffect(() => {
        if (!containerRef.current || isLoading) return;

        const ctx = gsap.context(() => {
            // Animate headers
            gsap.from(".animate-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Animate course cards
            gsap.fromTo(".course-card",
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".courses-grid",
                        start: "top 85%",
                    }
                }
            );

            // Animate mentor section
            gsap.from(".mentor-section", {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".mentor-section",
                    start: "top 80%",
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isLoading]);

    // Combine API courses with placeholders
    const allCourses = [
        ...courses.map(course => ({
            ...course,
            is_active: true,
        }))
    ];

    // Handle loading state
    if (isLoading) {
        return (
            <div className="pt-24 pb-12 px-4 min-h-screen bg-[#0D0D0D] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] bg-zinc-900/40 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-orange-500/30 selection:text-orange-200 relative overflow-hidden font-sans">

            {/* Background Atmosphere */}
            <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-0" aria-hidden="true" />

            {/* Floating Abstract Details */}
            <div className="absolute top-40 left-10 font-mono text-white/20 -rotate-12 animate-pulse text-xs pointer-events-none">
                {'<logic />'}
            </div>
            <div className="absolute top-1/3 right-20 font-mono text-white/20 rotate-6 animate-pulse text-xs pointer-events-none delay-1000">
                {'[0, 1]'}
            </div>
            <div className="absolute bottom-40 left-1/4 font-mono text-white/20 -rotate-6 animate-pulse text-xs pointer-events-none delay-500">
                {'while(true)'}
            </div>

            <div className="max-w-7xl mx-auto relative z-10 pt-32 pb-24 px-4">

                {/* Hero Section */}
                <header className="text-center mb-24 relative">
                    <div className="animate-header inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Level Up Your Career</span>
                    </div>

                    <h1 className="animate-header font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wider mb-6 text-zinc-100">
                        EXPAND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">POTENTIAL</span>
                    </h1>

                    <p className="animate-header text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-sans mt-8">
                        Choose a path and let our AI-powered platform guide you from your first line of code to building complex applications.
                    </p>
                </header>

                {/* Courses Grid */}
                <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {allCourses.map((course, index) => {
                        const isEnrolled = enrolledCourseIds.includes((course as any).id || '');

                        return (
                            <div
                                key={course.slug}
                                className={`course-card relative group ${!course.is_active ? 'opacity-70 grayscale-[0.5] hover:grayscale-0 transition-all duration-500' : ''}`}
                                onMouseEnter={() => {
                                    if (course.is_active && course.slug) prefetchCourse(course.slug);
                                }}
                            >
                                <div className={`
                                    h-full bg-black/40 border border-white/[0.02] shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-[2rem] p-7 flex flex-col transition-all duration-500 overflow-hidden relative z-10
                                    ${course.is_active ? 'hover:-translate-y-2 hover:bg-black/60 hover:border-white/[0.03] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.2),0_10px_50px_rgba(0,0,0,0.8)] hover:z-20' : ''}
                                `}>
                                    {/* Hover Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Icon Header */}
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                                                bg-zinc-800/80 border border-white/10 text-white
                                                group-hover:bg-orange-500/10 group-hover:border-orange-500/20 group-hover:text-orange-400 transition-all duration-500">
                                            {/* Dynamic Icon Rendering */}
                                            {course.icon === 'JS' || course.title.includes('JavaScript') ? (
                                                <Icon icon="logos:javascript" className="text-3xl filter drop-shadow-lg group-hover:drop-shadow-none" />
                                            ) : course.icon === 'GO' || course.title.includes('GO') || course.title.includes('Go') ? (
                                                <Icon icon="logos:go" className="text-4xl filter drop-shadow-lg group-hover:drop-shadow-none" />
                                            ) : course.icon === 'C++' || course.title.includes('C++') ? (
                                                <Icon icon="logos:c-plusplus" className="text-3xl filter drop-shadow-lg group-hover:drop-shadow-none" />
                                            ) : course.icon === 'PY' || course.title.includes('Python') ? (
                                                <Icon icon="logos:python" className="text-3xl filter drop-shadow-lg group-hover:drop-shadow-none" />
                                            ) : (
                                                <span className="font-bold">{course.icon}</span>
                                            )}
                                        </div>

                                        {course.is_active ? (
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest backdrop-blur-md">
                                                {course.level}
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                                <Icon icon="lucide:hammer" className="animate-pulse" /> Building
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow relative z-10">
                                        <h3 className="text-2xl font-bold font-sans mb-3 text-white group-hover:text-orange-400 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs font-mono font-semibold text-zinc-500 mb-8 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <Icon icon="lucide:clock" className="text-orange-500" /> {course.duration_estimate || (course.totalTimeMin ? `${Math.round(course.totalTimeMin / 60)}h` : '~1h')}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Icon icon="lucide:sparkles" className="text-orange-500" /> AI Tutor
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="relative z-10 mt-auto space-y-3">
                                        {course.is_active ? (
                                            <>
                                                <button
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        if (isEnrolled) {
                                                            router.push(`/dashboard?course=${(course as any).id || course.slug}`);
                                                            return;
                                                        }
                                                        const { enrollUserInCourse } = await import('../actions/enrollment');
                                                        const courseId = (course as any).id || course.slug;
                                                        const result = await enrollUserInCourse(courseId);
                                                        if (result.needsLogin) {
                                                            router.push(`/login?next=/courses/${course.slug}`);
                                                            return;
                                                        }
                                                        if (result.error && result.message !== 'Already enrolled') {
                                                            alert("Error: " + result.error);
                                                            return;
                                                        }
                                                        setEnrolledCourseIds(prev => [...prev, (course as any).id]);
                                                        router.push(`/dashboard?course=${(course as any).id || course.slug}`);
                                                    }}
                                                    className={`
                                                            w-full py-4 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 group/btn z-10
                                                            ${isEnrolled
                                                            ? 'bg-zinc-800 text-green-400 border border-green-500/20 hover:bg-zinc-700'
                                                            : 'bg-gradient-to-r from-[#ff5e00] to-[#ff8c00] text-white shadow-[0_0_40px_rgba(255,94,0,0.4)] hover:brightness-110 border-none'
                                                        }
                                                        `}
                                                >
                                                    {isEnrolled ? (
                                                        <>Continue <Icon icon="lucide:arrow-right" className="transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                                                    ) : (
                                                        <>Enroll Now</>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => router.push(`/courses/${course.slug}`)}
                                                    className="w-full py-3 rounded-xl font-mono font-semibold text-[10px] tracking-widest uppercase text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    View Syllabus
                                                </button>
                                            </>
                                        ) : (
                                            <button disabled className="w-full py-4 rounded-xl font-mono font-bold text-[10px] tracking-widest uppercase bg-transparent text-white/30 cursor-not-allowed border border-white/5 relative z-10">
                                                Under Construction
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mentor Section */}
                <div className="mentor-section relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md group mt-24">

                    {/* Glowing effect behind */}
                    <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-orange-600/10 blur-[120px] rounded-full z-0 mix-blend-screen pointer-events-none"></div>

                    <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-6 backdrop-blur-md relative overflow-hidden group/badge">
                                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest relative z-10">AI-Powered Mentorship</span>
                            </div>

                            <h2 className="font-[family-name:var(--font-bebas)] text-5xl md:text-7xl tracking-wider mb-6 text-zinc-100">
                                MORE THAN JUST CODE.<br />
                                A <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">CONVERSATION</span>.
                            </h2>

                            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-sans max-w-xl">
                                Unlike other platforms where you stare at text, EliteFolks allows you to talk through problems. It's like having a senior engineer sitting right next to you, 24/7.
                            </p>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-4 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 relative overflow-hidden flex items-center gap-3 group/btn w-fit mx-auto md:mx-0 bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Experience the Difference
                                    <Icon icon="lucide:mic" className="group-hover/btn:scale-110 transition-transform text-orange-400" />
                                </span>
                            </button>
                        </div>

                        {/* Visual Representation */}
                        <div className="relative">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
                                <div className="absolute inset-4 rounded-full border border-orange-500/10 animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-12 rounded-full border border-orange-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                                <Icon icon="lucide:mic" className="text-8xl text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />

                                {/* Floating particles */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 shadow-xl animate-bounce delay-700">
                                    <Icon icon="logos:python" className="text-2xl" />
                                </div>
                                <div className="absolute -bottom-2 -left-2 px-3 py-1.5 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shadow-xl animate-bounce delay-1000">
                                    <small className="font-mono text-[10px] text-green-400 font-bold uppercase tracking-widest">OK</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoursesPage;
