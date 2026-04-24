'use client';

import useSWR from 'swr';
import { CourseStats, CourseWithModules, LessonWithContent } from './courseTypes';

// Generic fetcher for SWR
const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        throw error;
    }
    return res.json();
};

/**
 * Hook to fetch all active courses with their stats
 * Uses SWR for automatic caching and deduplication
 */
export function useCourses() {
    const { data, error, isLoading, mutate } = useSWR<{ courses: CourseStats[]; count: number; enrolledCourseIds: string[] }>(
        '/api/courses',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // Don't refetch for 1 minute
        }
    );

    return {
        courses: data?.courses || [],
        count: data?.count || 0,
        enrolledCourseIds: data?.enrolledCourseIds || [],
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook to fetch a single course with its modules and lessons
 * @param courseId - Course slug or UUID
 */
export function useCourse(courseId: string | null) {
    const { data, error, isLoading, mutate } = useSWR<CourseWithModules>(
        courseId ? `/api/courses/${courseId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    return {
        course: data || null,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook to fetch a single lesson with its full content
 * Content is lazy-loaded only when needed
 * @param courseId - Course slug or UUID
 * @param lessonId - Lesson slug or UUID
 */
export function useLesson(courseId: string | null, lessonId: string | null) {
    const { data, error, isLoading, mutate } = useSWR<LessonWithContent>(
        courseId && lessonId ? `/api/courses/${courseId}/lessons/${lessonId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000, // Cache lesson content for 30 seconds
        }
    );

    return {
        lesson: data || null,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Prefetch a lesson's content before the user navigates to it
 * Useful for preloading on hover or focus (as per Vercel best practices)
 */
export function prefetchLesson(courseId: string, lessonId: string) {
    if (typeof window === 'undefined') return;

    // Trigger a prefetch by calling fetch directly
    void fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
}

/**
 * Prefetch a course's structure
 */
export function prefetchCourse(courseId: string) {
    if (typeof window === 'undefined') return;

    void fetch(`/api/courses/${courseId}`);
}

// Helper to find a lesson by ID within a course structure
export function findLessonInCourse(course: CourseWithModules | null, lessonId: string) {
    if (!course) return null;

    for (const module of course.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId || l.slug === lessonId);
        if (lesson) {
            return { lesson, module };
        }
    }
    return null;
}

// Helper to get next/previous lesson
export function getAdjacentLessons(course: CourseWithModules | null, currentLessonSlug: string) {
    if (!course) return { prev: null, next: null };

    const allLessons = course.modules.flatMap(m =>
        m.lessons.map(l => ({ ...l, moduleTitle: m.title }))
    );

    const currentIndex = allLessons.findIndex(l => l.slug === currentLessonSlug);

    return {
        prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
        next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
}
