import React, { useState } from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, RefreshCcw } from 'lucide-react';

interface QuizPanelProps {
    questions: Question[];
    onComplete?: (score: number) => void;
}

const QuizPanel: React.FC<QuizPanelProps> = ({ questions = [], onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // If no questions, show empty state
    if (!questions || questions.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                    <i className="fas fa-list-ul text-2xl text-zinc-600"></i>
                </div>
                <h3 className="text-zinc-300 font-bold mb-2">No Quizzes</h3>
                <p className="text-sm max-w-xs text-center">
                    This lesson doesn't have any practice questions defined yet.
                </p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleChoiceSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedChoice(index);
    };

    const handleCheckAnswer = () => {
        if (selectedChoice === null) return;

        setIsAnswered(true);
        const correct = currentQuestion.choices
            ? currentQuestion.choices[selectedChoice].includes("✓") ||
            (currentQuestion.answer && currentQuestion.choices[selectedChoice] === currentQuestion.answer)
            : false;

        // In the data, "✓" usually marks correct answers if not explicitly separated
        // We need to robustly check. Based on the markdown, "✓" is inside the choice text? 
        // Let's assume the data loader cleans this up or we check the raw string.
        // For this component, let's assume `currentQuestion.answer` holds the correct answer string OR an index. 
        // Or we check if the selected text matches the answer.

        // Actually, looking at the markdown, the checkmark is in the text line like "- B) Guido van Rossum, 1991 ✓".
        // The data ingestion layer should ideally handle this, but let's handle the raw case here just in case.
        const choiceText = currentQuestion.choices![selectedChoice];
        const isCorrect = choiceText.includes('✓') || (currentQuestion.answer && choiceText.includes(currentQuestion.answer));

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedChoice(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            if (onComplete) onComplete(score + (isAnswered && (currentQuestion.choices![selectedChoice!].includes('✓') || (currentQuestion.answer && currentQuestion.choices![selectedChoice!].includes(currentQuestion.answer))) ? 1 : 0));
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedChoice(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-zinc-200 space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <i className="fas fa-trophy text-3xl text-white"></i>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                    <p className="text-zinc-400">You scored</p>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mt-2">
                        {score} / {questions.length}
                    </div>
                </div>
                <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-zinc-700 font-semibold"
                >
                    <RefreshCcw size={18} /> Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto py-4">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 w-6 rounded-full transition-colors ${idx < currentQuestionIndex ? 'bg-orange-500' :
                                    idx === currentQuestionIndex ? 'bg-orange-500/50' : 'bg-zinc-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                {currentQuestion.prompt}
            </h2>

            {/* Choices */}
            <div className="flex-col space-y-3">
                {currentQuestion.choices?.map((choice, idx) => {
                    // Logic to hide checkmark from UI if it exists in data
                    const choiceLabel = choice.replace('✓', '').trim();
                    const isSelected = selectedChoice === idx;
                    const isCorrect = choice.includes('✓') || (currentQuestion.answer && choice.includes(currentQuestion.answer));

                    let stateStyles = "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300";
                    if (isAnswered) {
                        if (isCorrect) stateStyles = "border-green-500/50 bg-green-500/10 text-green-200";
                        else if (isSelected && !isCorrect) stateStyles = "border-red-500/50 bg-red-500/10 text-red-200";
                        else if (!isSelected && !isCorrect) stateStyles = "border-zinc-800 bg-zinc-900/30 text-zinc-500 opacity-50";
                    } else if (isSelected) {
                        stateStyles = "border-orange-500 bg-orange-500/10 text-white shadow-[0_0_15px_rgba(249,115,22,0.1)]";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleChoiceSelect(idx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${stateStyles}`}
                        >
                            <span className="font-medium text-base">{choiceLabel}</span>
                            {isAnswered && isCorrect && <Check size={20} className="text-green-400" />}
                            {isAnswered && isSelected && !isCorrect && <X size={20} className="text-red-400" />}
                        </button>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end">
                {!isAnswered ? (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={selectedChoice === null}
                        className={`px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${selectedChoice !== null
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-2 shadow-lg"
                    >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Feedback / Explanation (Optional, assuming data has it) */}
            {isAnswered && (
                <div className={`mt-6 p-4 rounded-xl border animate-fade-in-up ${currentQuestion.choices && (currentQuestion.choices[selectedChoice!].includes('✓') || (currentQuestion.answer && currentQuestion.choices[selectedChoice!].includes(currentQuestion.answer)))
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                    <h4 className={`text-sm font-bold mb-1 ${currentQuestion.choices && (currentQuestion.choices[selectedChoice!].includes('✓') || (currentQuestion.answer && currentQuestion.choices[selectedChoice!].includes(currentQuestion.answer)))
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                        {currentQuestion.choices && (currentQuestion.choices[selectedChoice!].includes('✓') || (currentQuestion.answer && currentQuestion.choices[selectedChoice!].includes(currentQuestion.answer)))
                            ? 'Correct!'
                            : 'Incorrect'}
                    </h4>
                    <p className="text-sm text-zinc-300">
                        {/* Placeholder for explanation if data has it, otherwise generic feedback */}
                        {currentQuestion.choices && (currentQuestion.choices[selectedChoice!].includes('✓') || (currentQuestion.answer && currentQuestion.choices[selectedChoice!].includes(currentQuestion.answer)))
                            ? "Great job! You got it right."
                            : "Don't worry, try review the lesson content and try again."}
                    </p>
                </div>
            )}

        </div>
    );
};

export default QuizPanel;
