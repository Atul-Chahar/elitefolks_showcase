'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useCourse, useLesson } from '../../../../../lib/courseService';
import LearningView from '../../../../../components/LearningView';
import Link from 'next/link';

// Map DB lesson to the Course type expected by LearningView
function mapDbLessonToCourse(course: any, lesson: any) {
    if (!course || !lesson) return null;

    // Find the module this lesson belongs to
    let targetModule = null;
    for (const module of course.modules) {
        const found = module.lessons.find((l: any) => l.id === lesson.id || l.slug === lesson.slug);
        if (found) {
            targetModule = module;
            break;
        }
    }

    if (!targetModule) return null;

    // Create a Course-compatible object
    return {
        id: course.id,
        title: course.title,
        description: course.description || '',
        modules: course.modules.map((m: any) => ({
            id: m.id,
            title: m.title,
            lessons: m.lessons.map((l: any) => ({
                id: l.slug, // Use slug for consistent IDs across app
                title: l.title,
                objectives: l.objectives || [],
                prerequisites: l.prerequisites || [],
                timeEstimateMin: l.time_estimate_min || 30,
                // Check match by ID or SLUG to be safe, since lesson.id is UUID
                content: (l.id === lesson.id || l.slug === lesson.slug) && lesson.content ? {
                    explanations: lesson.content.explanations || [],
                    demos: lesson.content.demos || [],
                    exercises: lesson.content.exercises || [],
                    debugging: lesson.content.debugging || [],
                    oralQuestions: lesson.content.oral_questions || [],
                    assessment: lesson.content.assessment || { questions: [], passCriteria: { minCorrect: 0 } }
                } : {
                    explanations: [],
                    demos: [],
                    exercises: [],
                    debugging: [],
                    oralQuestions: [],
                    assessment: { questions: [], passCriteria: { minCorrect: 0 } }
                },
                memoryUpdates: (l.id === lesson.id || l.slug === lesson.slug) && lesson.content ? lesson.content.memory_updates : { conceptsMastered: [], mistakeWatchlist: [] },
                nextLesson: l.next_lesson_slug || null
            }))
        }))
    };
}

function LessonContent({ courseId, lessonId }: { courseId: string; lessonId: string }) {
    const { course, isLoading: courseLoading, isError: courseError } = useCourse(courseId);
    const { lesson, isLoading: lessonLoading, isError: lessonError } = useLesson(courseId, lessonId);

    if (courseLoading || lessonLoading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading lesson...</p>
                </div>
            </div>
        );
    }

    if (courseError || lessonError || !course || !lesson) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Lesson Not Found</h1>
                    <p className="text-zinc-400 mb-8">The lesson you're looking for doesn't exist or is not available.</p>
                    <Link href={`/courses/${courseId}`} className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    // Map the database course/lesson to the format expected by LearningView
    const mappedCourse = mapDbLessonToCourse(course, lesson);

    if (!mappedCourse) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Error Loading Lesson Content</h1>
                    <p className="text-zinc-400 mb-8">Failed to process lesson data.</p>
                    <Link href={`/courses/${courseId}`} className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    return <LearningView course={mappedCourse} initialLessonId={lessonId} courseSlug={course.slug} />;
}

const LessonPage = () => {
    const params = useParams();
    const courseId = params.courseId as string;
    const lessonId = params.lessonId as string;

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LessonContent courseId={courseId} lessonId={lessonId} />
        </Suspense>
    );
};

export default LessonPage;
