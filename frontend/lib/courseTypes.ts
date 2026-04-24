// Type definitions for database tables
export interface DBCourse {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    level: string | null;
    duration_estimate: string | null;
    icon: string;
    icon_color: string;
    bg_color: string;
    gradient: string;
    is_active: boolean;
    outcomes: string[];
    prerequisites: string[];
    created_at: string;
    updated_at: string;
}

export interface DBModule {
    id: string;
    course_id: string;
    slug: string;
    title: string;
    order_index: number;
    created_at: string;
}

export interface DBLesson {
    id: string;
    module_id: string;
    slug: string;
    title: string;
    objectives: string[];
    prerequisites: string[];
    time_estimate_min: number;
    timeEstimateMin?: number; // normalized
    quiz_id?: string;
    order_index: number;
    next_lesson_slug: string | null;
    created_at: string;
}

export interface DBLessonContent {
    id: string;
    lesson_id: string;
    explanations: string[];
    demos: Array<{ code: string; explainByLine: boolean }>;
    exercises: Array<{ prompt: string; tests: string[] }>;
    debugging: Array<{ buggyCode: string; hints: string[]; solution: string }>;
    oral_questions: Array<{ type: string; prompt: string; choices?: string[]; answer?: string }>;
    assessment: {
        questions: Array<{ type: string; prompt: string; choices?: string[]; answer?: string }>;
        passCriteria: { minCorrect: number };
    };
    memory_updates: {
        conceptsMastered: string[];
        mistakeWatchlist: string[];
    };
    audio_summary: string | null;
    visual_aids: Array<{ type: string; url: string; caption?: string }>;
    created_at: string;
    updated_at: string;
}

// Combined types for API responses
export interface CourseWithModules extends DBCourse {
    modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends DBModule {
    lessons: DBLesson[];
}

export interface LessonWithContent extends DBLesson {
    content: DBLessonContent;
}

// Course stats from the view
export interface CourseStats extends DBCourse {
    module_count: number;
    lesson_count: number;
    total_time_min: number;
    totalTimeMin?: number; // normalized
}
