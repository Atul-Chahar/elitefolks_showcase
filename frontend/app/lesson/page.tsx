'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LessonPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the first lesson of the default course
        // In the future, this could resume the last accessed lesson
        router.replace('/courses/javascript-complete/lessons/js-vars-101');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
