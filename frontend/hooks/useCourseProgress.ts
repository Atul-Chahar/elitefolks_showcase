'use client';

import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/dbService';
import { serverProxiedDbService } from '../services/serverProxiedDbService';
import { Progress } from '../types';
import { INITIAL_PROGRESS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const useCourseProgress = (courseId: string, initialData?: Progress) => {
    const { user, loading: authLoading } = useAuth();
    const [progress, setProgress] = useState<Progress>(initialData || INITIAL_PROGRESS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sync Data on mount/user-change
    // Sync Data on mount/user-change
    useEffect(() => {
        let isMounted = true;

        // If initialData is provided, we trust it and don't fetch immediately unless we want to poll
        if (initialData) {
            setLoading(false);
            return;
        }

        if (authLoading) return;

        if (!user) {
            // DEMO MODE: Load from localStorage
            try {
                const localData = window.localStorage.getItem(`progress-${courseId}`);
                if (localData) {
                    setProgress(JSON.parse(localData));
                } else {
                    setProgress(INITIAL_PROGRESS);
                }
            } catch (e) {
                console.error("Local storage error", e);
                setProgress(INITIAL_PROGRESS);
            }
            if (isMounted) setLoading(false);
            return;
        }

        const fetchProgress = async () => {
            if (!isMounted) return;
            setLoading(true);
            try {
                const data = await serverProxiedDbService.getUserProgress(user.id, courseId);
                if (isMounted) {
                    setProgress(data);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error("Failed to sync progress:", err);
                    setError("Failed to sync data");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProgress();

        return () => {
            isMounted = false;
        };
    }, [user, courseId, authLoading, initialData]);

    // Helper to save to localStorage for demo users
    const saveToLocal = (newProgress: Progress) => {
        try {
            window.localStorage.setItem(`progress-${courseId}`, JSON.stringify(newProgress));
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
    };

    const updateProgress = useCallback(async (newProgressData: Partial<Progress>) => {
        if (!user) {
            setProgress(prev => {
                const updated = { ...prev, ...newProgressData };
                saveToLocal(updated);
                return updated;
            });
            return;
        }

        const prevState = { ...progress };
        // Optimistic update
        setProgress(prev => ({ ...prev, ...newProgressData }));

        try {
            await serverProxiedDbService.saveUserProgress(user.id, courseId, { ...progress, ...newProgressData });
            setError(null);
        } catch (err: any) {
            console.error("Failed to save progress, rolling back:", err);
            setProgress(prevState);
            setError("Sync failed. Local changes reverted.");
        }
    }, [user, courseId, progress]);

    const completeLesson = useCallback(async (lessonId: string, nextLessonId: string) => {
        if (!user) {
            setProgress(prev => {
                const newCompleted = prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId];
                const updated = {
                    ...prev,
                    completedLessons: newCompleted,
                    completedQuizzes: prev.completedQuizzes || [],
                    currentLessonId: nextLessonId,
                    aiMemory: [...prev.aiMemory, `User completed lesson ${lessonId}.`]
                };
                saveToLocal(updated);
                return updated;
            });
            return;
        }

        const prevState = { ...progress };
        const newCompleted = progress.completedLessons.includes(lessonId)
            ? progress.completedLessons
            : [...progress.completedLessons, lessonId];

        const updatedState = {
            ...progress,
            completedLessons: newCompleted,
            completedQuizzes: progress.completedQuizzes || [],
            currentLessonId: nextLessonId,
            aiMemory: [...progress.aiMemory, `User completed lesson ${lessonId}.`]
        };

        // Optimistic update
        setProgress(updatedState);

        try {
            await serverProxiedDbService.saveUserProgress(user.id, courseId, updatedState);
            // Track activity for daily quests
            serverProxiedDbService.trackActivity(user.id, 'lesson', 1).catch(() => {});
            setError(null);
        } catch (err: any) {
            console.error("Failed to complete lesson, rolling back:", err);
            setProgress(prevState);
            setError("Failed to save progress. Please try again.");
        }
    }, [user, courseId, progress]);

    return { progress, updateProgress, completeLesson, loading, error };
};

