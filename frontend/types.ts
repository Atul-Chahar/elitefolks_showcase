
export interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

export enum InteractionMode {
    Chat = 'CHAT',
    Voice = 'VOICE',
}

export interface Progress {
    completedLessons: string[];
    completedQuizzes: string[];
    currentLessonId: string;
    aiMemory: string[];
}

// New strictly typed Firestore models
export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface CourseProgress {
    completedLessonIds: string[];
    currentLessonId: string | null;
    aiMemory?: string[];
    updatedAt?: any; // generic for Firestore Timestamp or Date
}

export interface UserNotes {
    content: string;
    updatedAt?: any;
}

export interface Transcript {
    user: string;
    ai: string;
    isFinal: boolean;
}

// --- Chat Types ---
export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    codeContext?: string;
    createdAt: string;
}

export interface ChatSession {
    id: string;
    courseId: string;
    lessonId?: string;
    title: string;
    messages?: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface ConsoleOutput {
    type: 'log' | 'error' | 'warn' | 'info' | 'success';
    message: string;
}

export interface TestResult {
    test: string;
    passed: boolean;
    error?: string;
}

// --- Auth Types ---
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

// --- Standardized Curriculum Types ---
export interface Demo {
    code: string;
    explainByLine: boolean;
}

export interface Question {
    type: 'recall' | 'apply' | 'predict' | 'mcq' | 'output' | 'code';
    prompt: string;
    choices?: string[];
    answer?: string;
}

export interface DebuggingChallenge {
    buggyCode: string;
    hints: string[];
    solution: string;
}

export interface TestCase {
    id: string;
    inputs: Record<string, any>;
    expectedOutput: any;
    description?: string;
    isPublic?: boolean;
}

export interface Exercise {
    id?: string; // Optional ID for tracking
    prompt: string;
    testCases: TestCase[];
    tests: string[]; // Keep for backwards compatibility/advanced checks
    solution?: string; // Unlockable solution code
}

export interface Assessment {
    questions: Question[];
    passCriteria: {
        minCorrect: number;
    };
}

export interface VisualAid {
    type: 'image' | 'video' | '3d';
    url: string;
    caption?: string;
}

export interface LessonContent {
    explanations: string[];
    demos: Demo[];
    oralQuestions: Question[];
    debugging: DebuggingChallenge[];
    exercises: Exercise[];
    assessment: Assessment;
    audioSummary?: string;
    visualAids?: VisualAid[];
}

export interface MemoryUpdates {
    conceptsMastered: string[];
    mistakeWatchlist: string[];
}

export interface Lesson {
    id: string;
    slug?: string;
    title: string;
    objectives: string[];
    prerequisites: string[];
    timeEstimateMin: number;
    content: LessonContent;
    memoryUpdates: MemoryUpdates;
    nextLesson?: string | null;
    hint?: string;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    hint?: string;
}

export interface Course {
    id: string;
    slug?: string;
    title: string;
    description: string;
    outcomes?: string[];
    prerequisites?: string[];
    level?: string;
    totalDuration?: string;
    icon?: string;
    modules: Module[];
}

export interface RawCurriculumDatabase {
    course: {
        id: string;
        name: string;
        description: string;
        modules: Module[];
    };
}

// ==========================================
// Gamification & Analytics Types
// ==========================================

export interface UserStats {
    userId: string;
    xp: number;
    coins: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    joinedAt: string;
    lessonsCompleted: number;
    globalRank?: number;

    // Profile Bio
    tagline?: string;
    bio?: string;
    location?: string;
    githubHandle?: string;
    linkedinHandle?: string;
    websiteUrl?: string;

    // Skills
    skillJs: number;
    skillPython: number;
    skillVoice: number;
    skillLogic: number;
    skillSpeed: number;

    // Preferences
    activeTheme?: string;

    // Boosts & Items
    xpBoostUntil?: string; // ISO string
    streakFrozenUntil?: string; // ISO string
    // Subscription
    subscriptionTier?: 'free' | 'pro' | 'elite';
    seerStoneUntil?: string; // ISO string
}

export interface ActivityLog {
    id: string;
    date: string; // YYYY-MM-DD
    xpEarned: number;
    coinsEarned: number;
    lessonsCompleted: number;
    minutesSpent: number;
    voiceInteractions: number;
}

export interface UserAchievement {
    id: string;
    achievementId: string;
    unlockedAt: string;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    fullName: string;
    avatarUrl?: string;
    xp: number;
    level: number;
    subscriptionTier?: 'free' | 'pro' | 'elite';
}

// Shop & Economy
export interface ShopItem {
    id: string;
    name: string;
    description: string;
    costGems: number;
    sellPriceGems: number;
    maxQuantity: number;
    iconName: string;
    category: 'powerup' | 'theme' | 'cosmetic' | 'misc';
}

export interface InventoryItem {
    id: string;
    itemId: string;
    quantity: number;
}

export interface Transaction {
    id: string;
    itemId?: string;
    amount: number;
    type: 'buy' | 'sell' | 'reward' | 'adjustment' | 'quest_reward';
    description?: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    type: 'system' | 'quest' | 'achievement' | 'social' | 'shop';
    title: string;
    message: string;
    isRead: boolean;
    linkUrl?: string;
    createdAt: string;
}

export interface FeedItem {
    id: string;
    user: string;
    action: 'completed' | 'earned' | 'joined' | 'reached' | 'bought';
    item: string;
    time: string; // "2m ago" or ISO string to be formatted
    avatarUrl?: string;
}

