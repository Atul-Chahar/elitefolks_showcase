import { notFound } from 'next/navigation';
import TrainingIDE, { TrainingQuestion } from '@/components/training/TrainingIDE';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrainingTimer from '@/components/training/TrainingTimer';

interface QuestionPageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export default async function TrainingWorkspacePage({ params }: QuestionPageProps) {
    const resolvedParams = await params;

    const { serverDbService: dbService } = await import('@/services/serverDbService');
    const questionData = await dbService.getTrainingQuestionBySlug(resolvedParams.slug);

    if (!questionData) return notFound();

    const question: TrainingQuestion = {
        id: questionData.$id,
        title: questionData.title,
        description: questionData.description,
        category: questionData.category,
        difficulty: questionData.difficulty,
        starter_code: typeof questionData.starter_code === 'string' ? JSON.parse(questionData.starter_code) : questionData.starter_code,
        test_cases: typeof questionData.test_cases === 'string' ? JSON.parse(questionData.test_cases) : questionData.test_cases,
    };

    return (
        <div className="flex flex-col h-screen bg-[#0A0A0A] overflow-hidden">
            <div className="h-10 bg-[#0E0E0E] flex items-center justify-between px-4 border-b border-white/10 shrink-0 relative z-20">
                <Link href={`/training/${resolvedParams.category}`} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors w-1/3">
                    <ChevronLeft size={16} /> Base Camp
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-orange-400 hidden sm:inline-block">
                        {question.category}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wider font-manrope truncate max-w-[200px] sm:max-w-md">
                        {question.title}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-3 w-1/3">
                    <TrainingTimer />
                </div>
            </div>

            <div className="flex-1 min-h-0 relative z-10 p-2">
                <TrainingIDE question={question} />
            </div>
        </div>
    );
}
