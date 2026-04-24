import React from 'react';
import { CheckCircle } from 'lucide-react';
import { StaticIcon } from '../utils/courseIcons';

interface CourseHistoryGridProps {
    allProgress: any[];
    courses: any[];
}

interface MappedCourse {
    id: string;
    title: string;
    completedAt: string;
    thumbnailColor: string;
    isCompleted: boolean;
    hasStarted: boolean;
    progress: number;
    icon?: string;
    slug?: string;
}

const CourseHistoryGrid: React.FC<CourseHistoryGridProps> = ({
    allProgress = [],
    courses = []
}) => {
    // Show course if either completed or has some progress
    const activeCourses = allProgress.reduce((acc: any[], prog) => {
        const courseInfo = courses.find(c => c.id === prog.courseId || c.slug === prog.courseId);
        if (!courseInfo) return acc;

        const totalLessons = courseInfo.modules?.reduce((accMod: number, m: any) => accMod + (m.lessons?.length || 0), 0) || 0;
        const completedCount = prog.completedLessons?.length || 0;
        const isCompleted = completedCount >= totalLessons && totalLessons > 0;

        // Dynamic Theme Logic
        const slug = courseInfo.slug?.toLowerCase() || '';
        const titleText = courseInfo.title || '';
        const isJS = slug.includes('javascript') || slug.includes('js') || titleText.includes('JavaScript');
        const isGo = slug.includes('go') || titleText.includes('Go') || titleText.includes('GO');
        const isCPP = slug.includes('cplusplus') || slug.includes('c++') || titleText.includes('C++');
        const isPython = slug.includes('python') || slug.includes('py') || titleText.includes('Python');

        let themeColor = 'orange';
        if (isJS) themeColor = 'yellow';
        else if (isGo) themeColor = 'blue';
        else if (isCPP) themeColor = 'indigo';
        else if (isPython) themeColor = 'emerald';

        const theme = ({
            yellow: {
                banner: 'from-yellow-500/20 to-zinc-950',
                logo: 'bg-yellow-500/10 border-yellow-500/20',
                text: 'group-hover:text-yellow-400',
                bar: 'bg-yellow-500',
                shadow: 'group-hover:shadow-yellow-500/10'
            },
            blue: {
                banner: 'from-blue-500/20 to-zinc-950',
                logo: 'bg-blue-500/10 border-blue-500/20',
                text: 'group-hover:text-blue-400',
                bar: 'bg-blue-500',
                shadow: 'group-hover:shadow-blue-500/10'
            },
            indigo: {
                banner: 'from-indigo-500/20 to-zinc-950',
                logo: 'bg-indigo-500/10 border-indigo-500/20',
                text: 'group-hover:text-indigo-400',
                bar: 'bg-indigo-500',
                shadow: 'group-hover:shadow-indigo-500/10'
            },
            emerald: {
                banner: 'from-emerald-500/20 to-zinc-950',
                logo: 'bg-emerald-500/10 border-emerald-500/20',
                text: 'group-hover:text-emerald-400',
                bar: 'bg-emerald-500',
                shadow: 'group-hover:shadow-emerald-500/10'
            },
            orange: {
                banner: 'from-orange-500/20 to-zinc-950',
                logo: 'bg-orange-500/10 border-orange-500/20',
                text: 'group-hover:text-orange-400',
                bar: 'bg-orange-500',
                shadow: 'group-hover:shadow-orange-500/10'
            },
        }[themeColor as 'yellow' | 'blue' | 'indigo' | 'emerald' | 'orange']) || {
            banner: 'from-orange-500/20 to-zinc-950',
            logo: 'bg-orange-500/10 border-orange-500/20',
            text: 'group-hover:text-orange-400',
            bar: 'bg-orange-500',
            shadow: 'group-hover:shadow-orange-500/10'
        };

        acc.push({
            id: courseInfo.id,
            title: titleText,
            completedAt: isCompleted ? 'Completed' : `${completedCount}/${totalLessons} Lessons`,
            isCompleted: isCompleted,
            progress: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
            icon: courseInfo.icon,
            theme
        });

        return acc;
    }, []);

    if (activeCourses.length === 0) {
        return (
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 col-span-full text-center">
                <p className="text-zinc-500">No course history found. Start a course to see it here!</p>
            </div>
        );
    }

    return (
        <div className="col-span-full">
            <h3 className="text-zinc-400 mb-4 font-semibold text-sm uppercase tracking-wider flex items-center gap-2 italic">
                <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                Course History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCourses.map(course => (
                    <div key={course.id} className={`group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0A0A0A] transition-all duration-500 hover:border-white/10 hover:-translate-y-2 hover:shadow-2xl ${course.theme.shadow}`}>
                        {/* Thematic Background Banner */}
                        <div className={`h-24 w-full bg-gradient-to-b ${course.theme.banner} transition-all relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]"></div>
                        </div>

                        <div className="p-8 relative">
                            {/* Course Logo Badge */}
                            <div className={`absolute -top-10 left-8 w-16 h-16 rounded-2xl flex items-center justify-center border backdrop-blur-xl shadow-xl group-hover:scale-110 transition-transform duration-500 ${course.theme.logo}`}>
                                {course.icon === 'JS' || course.title.includes('JavaScript') ? (
                                    <StaticIcon icon="logos:javascript" className="text-2xl" />
                                ) : course.icon === 'GO' || course.title.includes('GO') || course.title.includes('Go') ? (
                                    <StaticIcon icon="logos:go" className="text-3xl" />
                                ) : course.icon === 'C++' || course.title.includes('C++') ? (
                                    <StaticIcon icon="logos:c-plusplus" className="text-2xl" />
                                ) : course.icon === 'PY' || course.title.includes('Python') ? (
                                    <StaticIcon icon="logos:python" className="text-2xl" />
                                ) : (
                                    <StaticIcon icon="lucide:code" className="text-2xl text-zinc-500" />
                                )}
                            </div>

                            <h4 className={`mt-10 font-black text-white transition-colors line-clamp-2 min-h-[4.5rem] leading-[1.4] text-base lg:text-lg uppercase italic font-manrope tracking-normal ${course.theme.text}`}>
                                {course.title}
                            </h4>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.15em]">
                                    <span className={`px-2 py-0.5 rounded-md bg-white/5 ${course.isCompleted ? "text-green-500" : "text-zinc-500"}`}>
                                        {course.isCompleted ? "Course Finished" : "In Progress"}
                                    </span>
                                    <span className="text-zinc-400 font-bold ml-auto">{course.completedAt}</span>
                                </div>

                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${course.isCompleted ? 'bg-green-500' : course.theme.bar}`}
                                        style={{ width: `${Math.min(100, course.progress)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseHistoryGrid;
