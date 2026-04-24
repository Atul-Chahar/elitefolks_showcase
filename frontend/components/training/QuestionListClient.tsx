'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Check, Play, Star } from 'lucide-react';

interface Question {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    category: string;
}

interface QuestionListClientProps {
    initialQuestions: Question[];
    currentCategory: string;
    solvedIds: string[];
    bookmarkedIds: string[];
}

// Fixed categories that match the user's LeetCode screenshot
const CATEGORIES = ['All Topics', 'Algorithms', 'Database', 'Shell', 'Concurrency', 'JavaScript', 'pandas'];
const TOPICS = ['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math', 'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search'];

export default function QuestionListClient({ initialQuestions, currentCategory, solvedIds, bookmarkedIds }: QuestionListClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All Topics');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'all' | 'bookmarks' | 'history'>('all');
    const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

    // Live Client State for Bookmarks (Optimistic UI)
    const [localBookmarks, setLocalBookmarks] = useState(new Set(bookmarkedIds));

    const toggleBookmark = async (e: React.MouseEvent, questionId: string) => {
        e.preventDefault();

        const isBookmarked = localBookmarks.has(questionId);
        const newSet = new Set(localBookmarks);

        if (isBookmarked) newSet.delete(questionId);
        else newSet.add(questionId);

        setLocalBookmarks(newSet); // Optimistic Update

        // TODO: Persist bookmarks to Appwrite when training_bookmarks collection is migrated
    };

    // Calculate Real Topic Counts
    const topicCounts = useMemo(() => {
        const counts: Record<string, number> = {};

        TOPICS.forEach(topic => counts[topic] = 0);

        initialQuestions.forEach(q => {
            const titleLower = q.title.toLowerCase();
            TOPICS.forEach(topic => {
                const topicLower = topic.toLowerCase();
                let matches = false;

                if (topicLower === 'array' && titleLower.includes('array')) matches = true;
                if (topicLower === 'string' && (titleLower.includes('string') || titleLower.includes('anagram') || titleLower.includes('palindrome') || titleLower.includes('character'))) matches = true;
                if (topicLower === 'math' && (titleLower.includes('number') || titleLower.includes('sum') || titleLower.includes('factor') || titleLower.includes('prime'))) matches = true;

                // Extremely basic heuristic fallback for demo purposes
                if (titleLower.includes(topicLower)) matches = true;

                if (matches) counts[topic] = (counts[topic] || 0) + 1;
            });
        });
        return counts;
    }, [initialQuestions]);

    // Filter Logic
    const filteredQuestions = useMemo(() => {
        return initialQuestions.filter(q => {
            // Tabs 
            if (activeTab === 'bookmarks' && !localBookmarks.has(q.id)) return false;
            if (activeTab === 'history' && !solvedIds.includes(q.id)) return false;

            // Search Query
            if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Difficulty
            if (difficultyFilter !== 'All' && q.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
                return false;
            }

            // Topic (Mock intelligent matching since we don't have DB tags yet)
            if (selectedTopic !== 'All Topics' && !TOPICS.includes(selectedTopic)) {
                // Ignore main categories, just show all
            } else if (selectedTopic !== 'All Topics') {
                const titleLower = q.title.toLowerCase();
                const topicLower = selectedTopic.toLowerCase();

                // Very basic heuristic matching for the demo
                if (topicLower === 'array' && !titleLower.includes('array')) return false;
                if (topicLower === 'string' && !titleLower.includes('string') && !titleLower.includes('anagram') && !titleLower.includes('palindrome') && !titleLower.includes('character')) return false;
                if (topicLower === 'math' && !titleLower.includes('number') && !titleLower.includes('sum') && !titleLower.includes('factor') && !titleLower.includes('prime')) return false;
            }

            return true;
        });
    }, [initialQuestions, searchQuery, difficultyFilter, selectedTopic, activeTab, localBookmarks, solvedIds]);

    // Helpers
    const getDifficultyStyle = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-[#00B8A3]'; // Leetcode green
            case 'medium': return 'text-[#FFC01E]'; // Leetcode yellow
            case 'hard': return 'text-[#FF375F]'; // Leetcode red
            default: return 'text-zinc-400';
        }
    };

    const getMockAcceptance = (id: string, diff: string) => {
        const base = id.length % 40;
        if (diff.toLowerCase() === 'easy') return (60 + base).toFixed(1) + '%';
        if (diff.toLowerCase() === 'medium') return (35 + base).toFixed(1) + '%';
        return (15 + (base / 2)).toFixed(1) + '%';
    };

    return (
        <div className="w-full flex flex-col font-sans">

            {/* Sub-navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`text-sm font-bold pb-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'all' ? 'text-white border-orange-500' : 'text-zinc-500 border-transparent hover:text-white'}`}
                >
                    Problem Set
                </button>
                <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`text-sm font-bold pb-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'bookmarks' ? 'text-white border-orange-500' : 'text-zinc-500 border-transparent hover:text-white'}`}
                >
                    My Bookmarks
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`text-sm font-bold pb-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'history' ? 'text-white border-orange-500' : 'text-zinc-500 border-transparent hover:text-white'}`}
                >
                    Historical Solutions
                </button>
            </div>

            {/* Top Topics Row */}
            {currentCategory !== 'Logic' && (
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide w-full mb-2">
                    {TOPICS.map((topic, i) => (
                        <button
                            key={topic}
                            onClick={() => setSelectedTopic(topic)}
                            className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] transition-all hover:bg-white/10 ${selectedTopic === topic ? 'text-white' : 'text-zinc-400'}`}
                        >
                            {topic} <span className="text-zinc-600 bg-white/5 px-2 rounded-full text-[10px] py-0.5">{topicCounts[topic] === 0 ? '' : topicCounts[topic]}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Sub Categories Row */}
            {currentCategory !== 'Logic' && (
                <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide w-full border-b border-white/5 mb-6">
                    {CATEGORIES.map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedTopic(cat)}
                            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 text-[13px] transition-all rounded-full ${selectedTopic === cat ? 'bg-white text-black font-semibold' : 'bg-[#282828] text-zinc-300 hover:bg-[#3E3E3E]'}`}
                        >
                            {/* Simple icon logic based on index mimicking the screenshot */}
                            {i === 0 && <span className="">⭐</span>}
                            {i === 1 && <span className="text-orange-400">✨</span>}
                            {i === 2 && <span className="text-blue-400">🗄️</span>}
                            {i === 3 && <span className="text-green-400">⚡</span>}
                            {i > 3 && i < 6 && <span className="text-purple-400">⚕️</span>}
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">
                    {/* Search Field */}
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions"
                            className="bg-[#282828] border-none rounded-lg pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all w-full sm:w-64"
                        />
                    </div>

                    {/* Difficulty Dropdown */}
                    <div className="relative z-[60]">
                        <button
                            onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
                            className={`flex items-center gap-2 px-3 py-2 text-[13px] transition-colors rounded-lg hover:bg-white/5 ${difficultyFilter !== 'All' ? 'bg-white/10 text-white font-bold' : 'bg-transparent text-zinc-400 hover:text-white'}`}
                        >
                            {difficultyFilter === 'All' ? 'Difficulty' : difficultyFilter}
                            <ChevronDown size={14} className={`opacity-70 transition-transform ${isDifficultyOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Invisible Backdrop to close on click outside */}
                        {isDifficultyOpen && (
                            <div
                                className="fixed inset-0 z-[-1]"
                                onClick={() => setIsDifficultyOpen(false)}
                            />
                        )}

                        <div className={`absolute top-full left-0 mt-1 w-32 bg-[#282828] border border-white/10 rounded-lg shadow-xl py-1 transition-all ${isDifficultyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
                            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => {
                                        setDifficultyFilter(diff);
                                        setIsDifficultyOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-white/10 ${difficultyFilter === diff ? 'text-white bg-white/5' : 'text-zinc-400'}`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress Tracking */}
                <div className="flex items-center gap-4 text-zinc-400 text-[13px]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-zinc-600" />
                        <span>{initialQuestions.filter(q => solvedIds.includes(q.id)).length}/{initialQuestions.length} Solved</span>
                    </div>
                    <button className="hover:text-white" aria-label="Search"><Search size={14} /></button>
                </div>

            </div>

            {/* The List Container */}
            <div className="w-full rounded-xl overflow-hidden bg-[#1A1A1A]">

                {/* Table Header */}
                <div className="grid grid-cols-[30px_1fr_80px_60px_60px] gap-4 px-4 py-3 bg-[#111] border-b border-[#282828] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="flex justify-center">Status</div>
                    <div>Title</div>
                    <div className="text-right pr-4">Acceptance</div>
                    <div className="text-right pr-2">Difficulty</div>
                    <div className="text-center">Options</div>
                </div>

                {/* No Results Fallback */}
                {filteredQuestions.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center border-t border-white/5">
                        <span className="text-zinc-500 text-sm">No questions found matching your filters.</span>
                        <button onClick={() => { setSearchQuery(''); setSelectedTopic('All Topics'); setDifficultyFilter('All'); }} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Clear Filters</button>
                    </div>
                )}

                {/* Questions Table */}
                <div className="flex flex-col">
                    {filteredQuestions.map((q, index) => {
                        const isEven = index % 2 === 0;
                        const isSolved = solvedIds.includes(q.id);
                        const isBookmarked = localBookmarks.has(q.id);
                        return (
                            <Link
                                key={q.id}
                                href={`/training/arena/${currentCategory.toLowerCase()}/${q.slug}`}
                                className={`group relative grid grid-cols-[30px_1fr_80px_60px_60px] gap-4 px-4 py-3 hover:bg-[#2C2C2C] transition-colors items-center border-b border-[#282828] ${isEven ? 'bg-[#1A1A1A]' : 'bg-[#1E1E1E]'}`}
                            >
                                {/* Status Icon */}
                                <div className="flex justify-center items-center">
                                    {isSolved ? (
                                        <Check size={16} className="text-[#00B8A3]" />
                                    ) : (
                                        <div className="w-4 h-4 rounded border border-zinc-600 outline-none" />
                                    )}
                                </div>

                                {/* Title Block */}
                                <div className="flex items-center min-w-0 pr-4">
                                    <span className="text-[14px] font-medium text-white/90 group-hover:text-blue-400 transition-colors truncate">
                                        {index + 1}. {q.title}
                                    </span>
                                </div>

                                {/* Acceptance */}
                                <div className="flex justify-end items-center">
                                    <span className="text-[14px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                        {getMockAcceptance(q.id, q.difficulty)}
                                    </span>
                                </div>

                                {/* Difficulty */}
                                <div className="flex justify-end items-center">
                                    <span className={`text-[14px] ${getDifficultyStyle(q.difficulty)}`}>
                                        {q.difficulty === 'Medium' ? 'Med.' : q.difficulty}
                                    </span>
                                </div>

                                {/* Action Toggles */}
                                <div className="flex justify-center items-center gap-3">
                                    <button
                                        onClick={(e) => toggleBookmark(e, q.id)}
                                        className="text-zinc-500 hover:text-amber-400 transition-colors"
                                    >
                                        <Star size={16} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
                                    </button>
                                    <Play size={16} className="text-zinc-500 fill-current group-hover:text-zinc-300 transition-colors" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
