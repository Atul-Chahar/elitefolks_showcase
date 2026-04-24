import { getServerUser } from '@/lib/appwrite-server';
import { redirect } from 'next/navigation';

export default async function TrainingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getServerUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <>
            {children}
        </>
    );
}
