import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Question, Exercise } from '../types';

import SpeakerButton from './SpeakerButton';

interface PracticePanelProps {
    questions: Question[];
    onQuizComplete?: (completed: boolean) => void;
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCheckCode?: (question: Question) => Promise<{ isCorrect: boolean; message: string }>;
}

const PracticePanel: React.FC<PracticePanelProps> = ({ questions, currentQuestionIndex, onQuestionChange, onQuizComplete, onCheckCode }) => {
    // Quiz State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

    const [isCheckingCode, setIsCheckingCode] = useState(false);

    const handleAnswer = async () => {
        if (isAnswered || isCheckingCode) return;

        const question = questions[currentQuestionIndex];
        const isCodeQuestion = question.type === 'predict' || question.type === 'code' || question.type === 'output' || !question.choices?.length;

        if (!isCodeQuestion && selectedOption === null) return;
        let isCorrect = false;
        let resultMessage = '';

        if (isCodeQuestion) {
            if (onCheckCode) {
                setIsCheckingCode(true);
                try {
                    const result = await onCheckCode(question);
                    isCorrect = result.isCorrect;
                    resultMessage = result.message;
                } catch (e: any) {
                    isCorrect = false;
                    resultMessage = "Error verifying code: " + e.message;
                } finally {
                    setIsCheckingCode(false);
                }
            } else {
                isCorrect = false;
                resultMessage = "Code checking is not available right now.";
            }
        } else {
            const selectedChoiceText = question.choices ? question.choices[selectedOption!] : '';
            isCorrect = selectedChoiceText === question.answer;
            resultMessage = isCorrect ? "Correct! Well done." : "Not quite. Try again!";
        }

        setFeedback({
            isCorrect,
            message: resultMessage
        });
        setIsAnswered(true);

        // Automatically mark quiz as completed if this is the last question and it's correct
        if (isCorrect && currentQuestionIndex === questions.length - 1) {
            onQuizComplete?.(true);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            onQuestionChange(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setFeedback(null);
        }
    };

    // Retry current question
    const retryQuestion = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setFeedback(null);
    };

    return (
        <div className="h-full flex flex-col bg-[#0D0D0D]">
            <div className="flex-1 overflow-y-auto p-6 relative">
                {questions.length > 0 ? (
                    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-zinc-500 text-sm mb-2">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span className="uppercase tracking-widest text-[10px] font-bold border border-white/10 px-2 py-0.5 rounded">{questions[currentQuestionIndex].type}</span>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-xl font-bold text-white leading-relaxed flex-1">
                                    {questions[currentQuestionIndex].prompt}
                                </h2>
                                <SpeakerButton
                                    text={`${questions[currentQuestionIndex].prompt}. Choices are: ${questions[currentQuestionIndex].choices?.join(", ")}`}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {questions[currentQuestionIndex].choices?.map((choice, idx) => {
                                const isCorrectChoice = choice === questions[currentQuestionIndex].answer;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => !isAnswered && setSelectedOption(idx)}
                                        className={`w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-center justify-between
                                            ${isAnswered && isCorrectChoice
                                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                                : isAnswered && selectedOption === idx && !isCorrectChoice
                                                    ? 'bg-red-500/10 border-red-500 text-red-400'
                                                    : selectedOption === idx
                                                        ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                                                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800'
                                            }
                                            ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
                                        `}
                                    >
                                        <span className="font-medium">{choice}</span>
                                        {isAnswered && isCorrectChoice && (
                                            <CheckCircle size={20} className="text-green-500" />
                                        )}
                                        {isAnswered && selectedOption === idx && !isCorrectChoice && (
                                            <AlertCircle size={20} className="text-red-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer / Feedback */}
                        {isAnswered ? (
                            <div className={`p-4 rounded-xl border ${feedback?.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${feedback?.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {feedback?.isCorrect ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${feedback?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                            {feedback?.isCorrect ? 'Correct!' : 'Incorrect'}
                                        </p>
                                        <p className="text-sm text-zinc-400">{feedback?.message}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!feedback?.isCorrect) {
                                            retryQuestion();
                                        } else if (currentQuestionIndex < questions.length - 1) {
                                            nextQuestion();
                                        } else {
                                            onQuizComplete?.(true);
                                        }
                                    }}
                                    className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    {!feedback?.isCorrect ? (
                                        <>Try Again <RotateCcw size={16} /></>
                                    ) : currentQuestionIndex < questions.length - 1 ? (
                                        <>Continue <ArrowRight size={16} /></>
                                    ) : (
                                        <>Finish Quiz <CheckCircle size={16} /></>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center w-full">
                                <button
                                    onClick={() => {
                                        if (currentQuestionIndex < questions.length - 1) {
                                            nextQuestion();
                                        } else {
                                            onQuizComplete?.(true);
                                        }
                                    }}
                                    className="px-4 py-3 text-zinc-500 font-bold hover:text-white transition-colors flex items-center gap-2 group/skip"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-black tracking-tighter shadow-[0_0_10px_rgba(249,115,22,0.1)] group-hover/skip:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">PRO</span>
                                        Skip
                                    </span>
                                    <ArrowRight size={16} className="group-hover/skip:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleAnswer}
                                    disabled={
                                        isCheckingCode ||
                                        (questions[currentQuestionIndex].choices?.length ? selectedOption === null : false)
                                    }
                                    className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                                >
                                    {isCheckingCode ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Checking...
                                        </>
                                    ) : 'Check Answer'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                        <i className="fas fa-clipboard-check text-4xl mb-4 opacity-50"></i>
                        <p>No quiz questions available for this lesson.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticePanel;
