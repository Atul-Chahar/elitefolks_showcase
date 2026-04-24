import { getServerUser } from '@/lib/appwrite-server';
import { Suspense } from 'react';
import QuestionListClient from './QuestionListClient';
import { dbService } from '../../services/dbService';

interface QuestionListProps {
    category: 'Logic' | 'DSA' | 'Competitive';
}

export default async function QuestionList({ category }: QuestionListProps) {
    const user = await getServerUser();

    // Training questions are not yet migrated to Appwrite
    // Show empty state until training_questions collection is created
    const questions: any[] = await dbService.getTrainingQuestions(category);
    let solvedIds: string[] = [];
    let bookmarkedIds: string[] = [];

    if (user) {
        solvedIds = await dbService.getSolvedQuestionIds(user.id);
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="py-32 flex flex-col items-center justify-center relative overflow-hidden glass-card rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="text-2xl font-black text-white/40 tracking-wider">SECURE VAULT EMPTY</h3>
                <p className="text-zinc-600 font-mono text-sm mt-2">Training questions are being migrated. Check back soon.</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<div className="h-64 flex items-center justify-center animate-pulse text-zinc-600">Loading vault records...</div>}>
            <QuestionListClient
                initialQuestions={questions || []}
                currentCategory={category}
                solvedIds={solvedIds}
                bookmarkedIds={bookmarkedIds}
            />
        </Suspense>
    );
}
