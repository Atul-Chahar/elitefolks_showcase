
import { Course, Module, Lesson, LessonContent, MemoryUpdates } from '../types';
import { CourseWithModules, DBLesson, DBLessonContent } from './courseTypes';

/**
 * Maps the database course structure (snake_case) to the application's legacy Course structure (camelCase).
 * Note: DBLesson doesn't have full content, so we provide default placeholders for content.
 * This is sufficient for UI components like LinearPath that only need metadata.
 */
export function mapDBCourseToAppCourse(dbCourse: CourseWithModules): Course {
    return {
        id: dbCourse.slug, // Use slug as ID for frontend routing stability
        title: dbCourse.title,
        description: dbCourse.description || '',
        level: dbCourse.level || 'Beginner',
        totalDuration: dbCourse.duration_estimate || '0 hours',
        icon: dbCourse.icon || 'JS',
        outcomes: dbCourse.outcomes,
        prerequisites: dbCourse.prerequisites,
        modules: dbCourse.modules.map(mapDBModuleToAppModule)
    };
}

function mapDBModuleToAppModule(dbModule: any): Module {
    return {
        id: dbModule.id,
        title: dbModule.title,
        lessons: (dbModule.lessons || []).map(mapDBLessonToAppLesson)
    };
}

function mapDBLessonToAppLesson(dbLesson: DBLesson): Lesson {
    return {
        id: dbLesson.slug, // Use slug as ID for frontend
        title: dbLesson.title,
        objectives: dbLesson.objectives,
        prerequisites: dbLesson.prerequisites,
        timeEstimateMin: dbLesson.timeEstimateMin || dbLesson.time_estimate_min || 30,
        // Placeholders for content which isn't loaded in the list view
        content: {
            explanations: [],
            demos: [],
            oralQuestions: [],
            debugging: [],
            exercises: [],
            assessment: { questions: [], passCriteria: { minCorrect: 0 } }
        },
        memoryUpdates: {
            conceptsMastered: [],
            mistakeWatchlist: []
        },
        nextLesson: dbLesson.next_lesson_slug
    };
}
