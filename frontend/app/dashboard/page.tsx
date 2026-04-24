import { getServerUser } from '../../lib/appwrite-server';
import { serverDbService as dbService } from '@/services/serverDbService';
import { redirect } from 'next/navigation';
import DashboardClient from '../../components/DashboardClient';
import { mapDBCourseToAppCourse } from '../../lib/courseMapper';

const INITIAL_PROGRESS: any = {
    completedLessons: [],
    currentLessonId: null,
    aiMemory: []
};

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const user = await getServerUser();

    if (!user) {
        redirect('/login');
    }

    // Await search params in nextjs 15
    const resolvedSearchParams = await searchParams;
    const requestedCourseId = resolvedSearchParams.course as string;

    // 1. Group independent queries together to fetch concurrently
    const [stats, lastActiveCourseId, allCourses, enrolledCourses] = await Promise.all([
        dbService.getUserStats(user.id),
        dbService.getLastActiveCourseId(user.id),
        dbService.getAllCourses(),
        dbService.getEnrolledCourses(user.id)
    ]);

    // 2. Determine Course to Show
    let courseId = requestedCourseId || lastActiveCourseId;

    // If a specific course was requested via URL, update the last active course in the DB
    if (requestedCourseId) {
        dbService.updateLastActiveCourse(user.id, requestedCourseId).catch(console.error);
    }

    // If no active course found, we show empty state.
    let progress = INITIAL_PROGRESS;
    let dbCourse = null;

    if (courseId) {
        dbCourse = await dbService.getCourseWithModules(courseId);

        if (dbCourse) {
            progress = await dbService.getUserProgress(user.id, dbCourse.id);
        } else {
            progress = await dbService.getUserProgress(user.id, courseId);
        }
    }

    // Map DB course to App course structure
    const course = dbCourse ? mapDBCourseToAppCourse(dbCourse) : null;

    return (
        <DashboardClient
            user={user}
            initialStats={stats}
            initialProgress={progress}
            initialCourse={course}
            activeCourseId={dbCourse?.id}
            allCourses={allCourses}
            enrolledCourses={enrolledCourses}
        />
    );
}
