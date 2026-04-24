import { serverDbService as dbService } from '@/services/serverDbService';

export default async function TestPage() {
    try {
        const courses = await dbService.getAllCourses();
        return <div>Success! Found {courses.length} courses. {courses.length > 0 ? courses[0].title : ''}</div>;
    } catch (e: any) {
        return <div>Error: {e?.message}</div>;
    }
}
