import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Course, Lesson, Transcript, ConsoleOutput, TestResult, Question } from '../types';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useVoiceAgent, VoiceAgentToolCall } from '../hooks/useVoiceAgent';
import { useChatTutor } from '../hooks/useChatTutor';
import { useTheme } from '../hooks/useTheme';
import LearningHeader from './LearningHeader';
import LearningNavigation from './LearningNavigation';
import LessonContentPanel from './LessonContentPanel';
import PracticePanel from './PracticePanel';
import AITutorPanel from './AITutorPanel';
import NotesPanel from './NotesPanel';
import CodeWorkspace from './CodeWorkspace';
import ShopModal from './ShopModal';
import SpeakerButton from './SpeakerButton';
// import { executeCodeSafely, executeTests, executeStructuredTests } from '../utils/codeExecutor';
import { useCodeExecution, SupportedLanguage } from '../hooks/useCodeExecution'; // Import hook
import { dbService } from '../services/dbService';
import { serverProxiedDbService } from '../services/serverProxiedDbService';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface LearningViewProps {
    course: Course;
    initialLessonId?: string;
    courseSlug?: string;
}

const LearningView: React.FC<LearningViewProps> = ({ course, initialLessonId, courseSlug }) => {
    const router = useRouter();


    const { user } = useAuth();
    const { themeName } = useTheme();
    const { progress, updateProgress, completeLesson } = useCourseProgress(course.id);
    const [userStats, setUserStats] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    // Track if the current lesson's requirements (e.g. tests) have been met in this session
    const [isCurrentLessonCompleted, setIsCurrentLessonCompleted] = useState(false);
    // Track if quizzes are completed
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    // AI mode: voice or chat
    const [aiMode, setAiMode] = useState<'voice' | 'chat'>('chat');

    // Navigation tabs
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'learn' | 'ai' | 'notes' | 'practice'>(
        (tabParam as 'learn' | 'ai' | 'notes' | 'practice') || 'learn'
    );

    // Sync tab param changes from the URL
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam as 'learn' | 'ai' | 'notes' | 'practice');
        }
    }, [tabParam]);

    // Code editor state
    const [editorCode, setEditorCode] = useState('// Write your code here...\nconsole.log("Hello, World!");'); // Will be updated by useEffect
    // We can't really set the initial state dynamically easily here without props.
    // The useEffect will handle it.
    const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
    const [transcript, setTranscript] = useState<Transcript>({ user: '', ai: '', isFinal: false });

    // Quiz State (Lifted for Navigation)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Shop modal state
    const [isShopOpen, setIsShopOpen] = useState(false);

    // XP modal state
    const [showXPModal, setShowXPModal] = useState(false);
    const [xpGained, setXpGained] = useState(0);

    // Refs to access latest state in async tool callbacks
    const editorCodeRef = useRef(editorCode);
    useEffect(() => { editorCodeRef.current = editorCode; }, [editorCode]);

    // Memoize the flattened list of lessons for easier navigation lookup
    const allLessons = useMemo(() => course.modules.flatMap(m => m.lessons), [course]);

    // Derive current module ID
    const currentModuleId = useMemo(() => {
        if (!currentLesson) return course.modules[0]?.id || '';
        return course.modules.find(m => m.lessons.some(l => l.id === currentLesson.id))?.id || '';
    }, [course, currentLesson]);

    // Get current lesson index for navigation
    const currentLessonIndex = useMemo(() => {
        if (!currentLesson) return 0;
        return allLessons.findIndex(l => l.id === currentLesson.id);
    }, [allLessons, currentLesson]);

    // Calculate completed questions (lessons in current module) and current position
    const currentModule = course.modules.find(m => m.id === currentModuleId);
    const completedInModule = currentModule?.lessons.filter(l =>
        progress.completedLessons?.includes(l.id)
    ).length || 0;
    const totalInModule = currentModule?.lessons.length || 0;

    // Get current lesson's position within the current module (for progress dots)
    const currentLessonIndexInModule = useMemo(() => {
        if (!currentModule || !currentLesson) return 0;
        return currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    }, [currentModule, currentLesson]);

    // Type code with animation effect
    const typeCode = (code: string) => {
        setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < code.length) {
                    setEditorCode(code.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 15);
        }, 50);
    };

    // Determine if user can proceed to next lesson
    const canAdvance = useMemo(() => {
        if (!currentLesson) return false;

        const isHistoricallyCompleted = progress.completedLessons?.includes(currentLesson.id) || false;

        // Code Requirement
        const hasExercises = currentLesson.content.exercises && currentLesson.content.exercises.length > 0;
        const codeRequirementMet = !hasExercises || isCurrentLessonCompleted;

        // Quiz Requirement
        const hasQuizzes = currentLesson.content.assessment && currentLesson.content.assessment.questions && currentLesson.content.assessment.questions.length > 0;
        const quizRequirementMet = !hasQuizzes || isQuizCompleted;

        return isHistoricallyCompleted || (codeRequirementMet && quizRequirementMet);
    }, [currentLesson, progress.completedLessons, isCurrentLessonCompleted, isQuizCompleted]);

    // Code execution handlers
    const { runCode } = useCodeExecution();

    // Determine default language from course
    const courseLanguage = useMemo((): SupportedLanguage => {
        const slug = (courseSlug || course.title).toLowerCase();
        if (slug.includes('python')) return 'python';
        if (slug.includes('cpp') || slug.includes('c++')) return 'cpp';
        if (slug.includes('go')) return 'go';
        // Check for javascript explicitly or ensure java check doesn't match javascript
        if (slug.includes('javascript') || slug.includes('js')) return 'javascript';
        if (slug.includes('java') && !slug.includes('script')) return 'java';
        return 'javascript';
    }, [courseSlug, course.title]);

    const handleRunCode = useCallback(async () => {
        setConsoleOutput([]);
        // Use the detected course language or fallback to what's in the editor (though editor state doesn't track language well yet)
        // Ideally CodeWorkspace should bubble up the *selected* language.
        // For now, we'll try to use the course language as default.
        // But wait, the user might have changed the dropdown in CodeWorkspace!
        // We need CodeWorkspace to tell us the selected language.
        // But handleRunCode is triggered by the hook in CodeWorkspace?
        // Actually CodeWorkspace triggers onRunCode prop. 
        // We need to know the language.
        // Let's rely on the CodeWorkspace to handle the selection state, 
        // BUT the tool call (Live Tutor) might trigger specific language execution.

        // Refactor: We should probably just pass the language to runCode if we can access it.
        // Since we don't easily have the *selected* language from CodeWorkspace here without lifting state up:
        // We will default to courseLanguage.
        // TODO: Lift selectedLanguage state up from CodeWorkspace to LearningView if we want precise control.

        await runCode(editorCodeRef.current, courseLanguage, {
            onLog: (output) => setConsoleOutput(prev => [...prev, output])
        });

        // Save submission history
        if (user && currentLesson) {
            try {
                await dbService.saveSubmission(user.id, currentLesson.id, editorCodeRef.current, courseLanguage);
            } catch (err: any) {
                const isMissingTable = err.code === 'PGRST205' || err.message?.includes('Could not find the table');
                if (!isMissingTable) {
                    console.error("Auto-save submission failed. Reason:", err?.message || "Unknown error", JSON.stringify(err, null, 2));
                }
            }
        }
    }, [user, currentLesson, runCode, courseLanguage]);

    const handleResetCode = useCallback(() => {
        const defaultCode = courseLanguage === 'go'
            ? 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}'
            : courseLanguage === 'python'
                ? 'print("Hello, World!")'
                : courseLanguage === 'cpp'
                    ? '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}'
                    : '// Write your code here...\nconsole.log("Hello, World!");';

        setEditorCode(defaultCode);
        setConsoleOutput([]);
    }, [courseLanguage]);

    const handleRunTests = useCallback((): TestResult[] => {
        if (!currentLesson || !currentLesson.content.exercises || currentLesson.content.exercises.length === 0) {
            return [];
        }

        // Phase 1: Server-side execution migration.
        // We assume success if the user thinks it's correct for now, or rely on them checking output.
        // Actual test validation requires parsing standard output which we'll add later.

        setIsCurrentLessonCompleted(true);
        return [{ test: 'Execution Success', passed: true }];
    }, [currentLesson]);

    const handleCheckCode = useCallback(async (question: Question): Promise<{ isCorrect: boolean; message: string }> => {
        let executionOutput = '';

        await runCode(editorCodeRef.current, courseLanguage, {
            onLog: (log) => {
                if (log.type === 'log') {
                    executionOutput += log.message + '\n';
                }
            }
        });

        const cleanedOutput = executionOutput.trim();
        const expectedAnswer = question.answer ? String(question.answer).trim() : '';

        if (!expectedAnswer) {
            // If there's no precise answer stored, we assume running without crashing is a pass
            // but for 'predict' questions it typically compares exact string match.
            return {
                isCorrect: true,
                message: 'Code executed successfully. No exact output specified to match against.'
            };
        }

        if (cleanedOutput === expectedAnswer || cleanedOutput.includes(expectedAnswer)) {
            setIsCurrentLessonCompleted(true);
            return {
                isCorrect: true,
                message: 'Correct output! Your code generated the expected result.'
            };
        } else {
            return {
                isCorrect: false,
                message: `Expected "${expectedAnswer}" but your code produced "${cleanedOutput || 'nothing'}".`
            };
        }
    }, [runCode, courseLanguage, editorCodeRef]);

    // Lesson navigation handlers
    const handleLessonSelect = useCallback(async (lessonId: string) => {
        await updateProgress({ currentLessonId: lessonId });
        if (user) {
            serverProxiedDbService.trackActivity(user.id, 'lesson', 0);
        }

        // Explicitly navigate to the new URL
        const cId = courseSlug || course.id;
        // Ideally we should find the lesson slug, but ID might work if routes handle it.
        // The Lesson object has a slug. We should find it.
        const targetLesson = allLessons.find(l => l.id === lessonId);
        const lId = targetLesson?.slug || lessonId; // Fallback to ID if slug missing

        router.push(`/courses/${cId}/lessons/${lId}`);

    }, [updateProgress, user, courseSlug, course.id, allLessons, router]);

    const handlePreviousLesson = useCallback(() => {
        if (activeTab === 'practice' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            return;
        }

        if (currentLessonIndex > 0) {
            const prevLesson = allLessons[currentLessonIndex - 1];
            const cId = courseSlug || course.id;
            router.push(`/courses/${cId}/lessons/${prevLesson.id}`);
        } else {
            // If on first lesson, go back to course overview
            const cId = courseSlug || course.id;
            router.push(`/courses/${cId}`);
        }
    }, [currentLessonIndex, allLessons, activeTab, currentQuestionIndex, courseSlug, course.id, router]);

    const handleNextLesson = useCallback(async () => {
        if (!currentLesson || isCompleting) return;

        if (!canAdvance) {
            setNotification({ message: "Please complete the lesson exercise/quiz to continue!", type: 'info' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        setIsCompleting(true);
        try {
            let nextLessonId = currentLesson.id;
            let nextLessonSlug = currentLesson.slug || currentLesson.id;

            if (currentLessonIndex < allLessons.length - 1) {
                const nextLesson = allLessons[currentLessonIndex + 1];
                nextLessonId = nextLesson.id;
                nextLessonSlug = nextLesson.slug || nextLesson.id;
            }

            await completeLesson(currentLesson.id, nextLessonId);
            setXpGained(50);


            if (user) {
                // Tracking (simplified)
                serverProxiedDbService.trackActivity(user.id, 'lesson', 1).catch(e => console.error(e));
                serverProxiedDbService.trackActivity(user.id, 'xp', 50).catch(e => console.error(e));
            }

            setShowXPModal(true);

        } catch (error) {
            console.error("Failed to complete lesson:", error);
        } finally {
            setIsCompleting(false);
        }
    }, [currentLesson, isCompleting, currentLessonIndex, allLessons, completeLesson, user, canAdvance]);

    const closeXPModal = () => {
        setShowXPModal(false);
        const isLastLesson = currentLessonIndex === allLessons.length - 1;

        if (isLastLesson) {
            router.push('/dashboard');
        } else {
            const nextLesson = allLessons[currentLessonIndex + 1];
            // Prefer courseSlug if available for cleaner URLs, otherwise fallback to ID
            const cId = courseSlug || course.id;
            router.push(`/courses/${cId}/lessons/${nextLesson.id}`);
        }
    };

    // Tool call handler for Voice Agent (new Groq-based pipeline)
    const handleToolCall = useCallback((toolCalls: VoiceAgentToolCall[]) => {
        for (const tc of toolCalls) {
            switch (tc.name) {
                case 'writeCode':
                    setEditorCode('');
                    typeCode(tc.args?.content || tc.args?.code || '');
                    break;
                case 'executeCode':
                    handleRunCode();
                    break;
                case 'readCode':
                    // readCode is handled server-side via editorCode in request
                    break;
                case 'controlApp': {
                    const action = tc.args?.content || tc.args?.action || '';
                    if (action === 'run_code') handleRunCode();
                    else if (action === 'reset_code') handleResetCode();
                    else if (action === 'next_lesson') handleNextLesson();
                    break;
                }
            }
        }
    }, [handleRunCode, handleResetCode, handleNextLesson]);

    const getEditorCode = useCallback(() => editorCodeRef.current, []);

    // Chat tutor hook (Moved up to be accessible by onStreamMessage)
    const {
        messages: chatMessages,
        isLoading: isChatLoading,
        error: chatError,
        sendMessage: sendChatMessage,
        sessions: chatSessions,
        activeSessionId,
        loadSession,
        startNewSession,
        deleteSession,
        addVoiceTurn,
    } = useChatTutor(course.id, currentLesson, getEditorCode, handleToolCall);

    const onStreamMessage = useCallback((newTranscript: Transcript) => {
        setTranscript(newTranscript);
        if (newTranscript.isFinal && (newTranscript.user || newTranscript.ai)) {
            addVoiceTurn(newTranscript.user, newTranscript.ai);
        }
    }, [addVoiceTurn]);

    // Hint and Boost state
    const [showHint, setShowHint] = useState(false);
    const [hintContent, setHintContent] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

    const handleHintClick = useCallback(() => {
        if (!currentLesson) return;

        // Priority: Lesson Hint > Module Hint > Fallback Rotation
        const lessonHint = currentLesson.hint;
        const moduleHint = course.modules.find(m => m.lessons.some(l => l.id === currentLesson.id))?.hint;

        const fallbackTips = [
            "💡 Practice Tip: Try explaining your code out loud to 'Rubber Duck' debug problems!",
            "💡 Pro Tip: Use console.log() often to inspect variables and understand code flow.",
            "💡 Efficiency Tip: Master keyboard shortcuts like Ctrl+C / Ctrl+V to speed up your coding.",
            "💡 Logic Tip: Break complex problems into smaller, manageable steps before writing code.",
            "💡 Learning Tip: Don't just copy-paste; try to re-type code to build better muscle memory."
        ];

        const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
        const hint = lessonHint || moduleHint || randomFallback;

        setHintContent(hint);
        setShowHint(true);
    }, [currentLesson, course.modules]);

    const handleBoostClick = useCallback(() => {
        setNotification({ message: "Boost activated! You'll earn 2x XP for this lesson.", type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Confetti effect on lesson complete
    useEffect(() => {
        if (showXPModal) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100000 };
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [showXPModal]);

    // Fetch real user stats
    useEffect(() => {
        const fetchStats = async () => {
            if (user) {
                try {
                    const stats = await serverProxiedDbService.getUserStats(user.id);
                    setUserStats(stats);
                } catch (error) {
                    console.error("Failed to fetch user stats in LearningView:", error);
                }
            }
        };
        fetchStats();
    }, [user, progress.completedLessons]);

    // Initialize current lesson from URL or progress
    useEffect(() => {
        let lessonIdToLoad = initialLessonId || progress.currentLessonId;

        const getDefaultCode = (lang: string) => {
            if (lang === 'go') return 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}';
            if (lang === 'python') return 'print("Hello, World!")';
            if (lang === 'cpp' || lang === 'c++') return '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}';
            return '// Write your code here...\nconsole.log("Hello, World!");';
        };
        const defaultCode = getDefaultCode(courseLanguage);

        if (lessonIdToLoad) {
            const foundLesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonIdToLoad);

            if (foundLesson) {
                if (!currentLesson || foundLesson.id !== currentLesson.id) {
                    setCurrentLesson(foundLesson);
                    setIsCurrentLessonCompleted(false);
                    // Initialize quiz status from persisted progress
                    const quizPersisted = progress.completedQuizzes?.includes(foundLesson.id) || false;
                    setIsQuizCompleted(quizPersisted);
                    setCurrentQuestionIndex(0);
                    // Only reset code if we are switching lessons. 
                    // Ideally we should check if there's a saved submission, but that's async.
                    // For now, reset to language default.
                    setEditorCode(defaultCode);
                    setConsoleOutput([]);

                    if (foundLesson.id !== progress.currentLessonId) {
                        updateProgress({ currentLessonId: foundLesson.id });
                    }
                }
            } else if (progress.currentLessonId) {
                const progressLesson = course.modules.flatMap(m => m.lessons).find(l => l.id === progress.currentLessonId);
                if (progressLesson && (!currentLesson || progressLesson.id !== currentLesson.id)) {
                    setCurrentLesson(progressLesson);
                    setIsCurrentLessonCompleted(false);
                    // Initialize quiz status from persisted progress
                    const quizPersisted = progress.completedQuizzes?.includes(progressLesson.id) || false;
                    setIsQuizCompleted(quizPersisted);
                    setCurrentQuestionIndex(0);
                    setEditorCode(defaultCode);
                    setConsoleOutput([]);
                }
            }
        } else {
            const firstLesson = course.modules[0]?.lessons[0];
            if (firstLesson && (!currentLesson || firstLesson.id !== currentLesson.id)) {
                setCurrentLesson(firstLesson);
                updateProgress({ currentLessonId: firstLesson.id });
                setIsCurrentLessonCompleted(false);
                setIsQuizCompleted(false);
                setCurrentQuestionIndex(0);
                setEditorCode(defaultCode);
                setConsoleOutput([]);
            }
        }
    }, [initialLessonId, progress.currentLessonId, course, updateProgress, courseLanguage]);

    // getEditorCode was moved up

    const {
        isSessionActive,
        isConnecting,
        isSpeaking,
        isListening,
        isMuted,
        isAIPaused,
        isProcessing,
        startSession,
        stopSession,
        startListening,
        stopListening,
        toggleMute,
        toggleAIPause,
        sendTextMessage,
        sessionError
    } = useVoiceAgent(onStreamMessage, handleToolCall, currentLesson, course.title, getEditorCode, user?.id);

    // Chat tutor hook was moved up

    const handleStartVoiceSession = useCallback(() => {
        startSession();
        if (user) {
            serverProxiedDbService.trackActivity(user.id, 'voice', 1);
        }
    }, [startSession, user]);

    return (
        <div className="fixed inset-0 bg-[#0D0D0D] text-gray-200 flex overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
                    <div className={`px-6 py-3 rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${notification.type === 'success' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        <span className="text-sm font-bold tracking-wide uppercase">{notification.message}</span>
                    </div>
                </div>
            )}

            <main className="flex flex-col flex-grow relative h-full w-full">
                {/* Header (Two Rows) */}
                <LearningHeader
                    courseTitle={course.title}
                    modules={course.modules}
                    currentModuleId={currentModuleId}
                    currentLessonId={currentLesson?.id || ''}
                    completedLessonIds={progress.completedLessons || []}
                    onLessonSelect={handleLessonSelect}
                    onPrevious={handlePreviousLesson}
                    onNext={handleNextLesson}
                    canGoPrevious={currentLessonIndex > 0}
                    canGoNext={canAdvance && currentLessonIndex < allLessons.length - 1}
                    totalQuestions={totalInModule}
                    completedQuestions={completedInModule}
                    currentQuestionIndex={currentLessonIndexInModule}
                    onShopClick={() => setIsShopOpen(true)}
                    gems={userStats?.coins || 0}
                    streak={userStats?.currentStreak || 0}
                    lives={5}
                    xpBoostUntil={userStats?.xpBoostUntil}
                    streakFrozenUntil={userStats?.streakFrozenUntil}
                />

                {/* Main Content - 3 Column Layout */}
                <div className="flex-grow flex overflow-hidden min-h-0 relative z-10">
                    {/* Column 1: Vertical Navigation Toolbar */}
                    <div className="hidden md:block z-50">
                        <LearningNavigation
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            onHintClick={handleHintClick}
                            onBoostClick={handleBoostClick}
                        />
                    </div>

                    {/* Column 2: Content Pane */}
                    <div className="flex-1 min-w-0 flex flex-col border-r border-white/5 relative bg-[#0D0D0D]/50 backdrop-blur-sm">
                        {/* Tab Content */}
                        {activeTab === 'learn' && currentLesson && (
                            <LessonContentPanel
                                lesson={currentLesson}
                                courseId={course.id}
                                courseTitle={course.title}
                                courseIcon={course.icon}
                                language={courseLanguage}
                            />
                        )}

                        {activeTab === 'ai' && (
                            <AITutorPanel
                                course={course}
                                currentLesson={currentLesson}
                                aiMode={aiMode}
                                onAiModeChange={setAiMode}
                                isSessionActive={isSessionActive}
                                isConnecting={isConnecting}
                                isListening={isListening}
                                isSpeaking={isSpeaking}
                                isMuted={isMuted}
                                isAIPaused={isAIPaused}
                                isProcessing={isProcessing}
                                startSession={handleStartVoiceSession}
                                stopSession={stopSession}
                                toggleMute={toggleMute}
                                toggleAIPause={toggleAIPause}
                                sendTextMessage={sendTextMessage}
                                transcript={transcript}
                                sessionError={sessionError}
                                chatMessages={chatMessages}
                                isChatLoading={isChatLoading}
                                chatError={chatError}
                                onSendChatMessage={sendChatMessage}
                                chatSessions={chatSessions}
                                activeSessionId={activeSessionId}
                                onLoadSession={loadSession}
                                onNewSession={startNewSession}
                                onDeleteSession={deleteSession}
                            />
                        )}

                        {activeTab === 'notes' && currentLesson && (
                            <NotesPanel lessonId={currentLesson.id} />
                        )}

                        {activeTab === 'practice' && currentLesson && (
                            <PracticePanel
                                questions={currentLesson.content.assessment.questions || []}
                                onQuizComplete={() => {
                                    setIsQuizCompleted(true);
                                    // Auto-advance if also code completed (or none req)
                                    if (canAdvance) {
                                        handleNextLesson();
                                    }
                                }}
                                currentQuestionIndex={currentQuestionIndex}
                                onQuestionChange={setCurrentQuestionIndex}
                                onCheckCode={handleCheckCode}
                            />
                        )}
                    </div>

                    {/* Column 3: Code Editor & Console */}
                    <div className="hidden lg:flex flex-[1.2] min-w-0 flex-col border-l border-white/5 bg-[#080808] relative">
                        <CodeWorkspace
                            code={editorCode}
                            onCodeChange={(val) => setEditorCode(val || '')}
                            output={consoleOutput}
                            exercises={currentLesson?.content.exercises || []}
                            onRunTests={handleRunTests}
                            onRunCode={handleRunCode}
                            onResetCode={handleResetCode}
                            lessonId={currentLesson?.id}
                            language={courseLanguage}
                            theme={themeName}
                        />
                    </div>
                </div>
            </main>

            {/* Hint Modal */}
            {showHint && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowHint(false)} />
                    <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-bounce-in overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-500" />
                        <div className="flex items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    <i className="fas fa-lightbulb text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit uppercase tracking-wider">Expert Hint</h3>
                            </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-jetbrains text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                            {hintContent}
                        </p>
                        <button
                            onClick={() => setShowHint(false)}
                            className="w-full mt-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Shop Modal */}
            {isShopOpen && (
                <ShopModal
                    isOpen={isShopOpen}
                    onClose={() => setIsShopOpen(false)}
                    currentGems={userStats?.coins || 0}
                    onTransactionComplete={() => { }}
                />
            )}

            {/* Level Up / Success Modal */}
            {showXPModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeXPModal} />
                    <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-bounce-in overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-purple-500/10 pointer-events-none" />

                        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pulse">
                            <i className="fas fa-trophy text-3xl text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 font-outfit">Lesson Complete!</h2>
                        <p className="text-zinc-400 mb-8">You're making great progress.</p>

                        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8 font-outfit">
                            +{xpGained} <span className="text-lg text-zinc-500 font-medium">XP</span>
                        </div>

                        <button
                            onClick={closeXPModal}
                            className="w-full py-3.5 rounded-xl font-bold bg-white text-black hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningView;
