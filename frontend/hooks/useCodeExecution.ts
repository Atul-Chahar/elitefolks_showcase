'use client';

import { useState, useCallback } from 'react';
import { ConsoleOutput } from '../types';

export type SupportedLanguage = 'javascript' | 'python' | 'cpp' | 'go' | 'java' | 'typescript';

interface UseCodeExecutionOptions {
    onLog?: (log: ConsoleOutput) => void;
    onComplete?: () => void;
}

export function useCodeExecution() {
    const [isRunning, setIsRunning] = useState(false);

    const runCode = useCallback(async (code: string, language: string, options?: UseCodeExecutionOptions) => {
        setIsRunning(true);
        const { onLog, onComplete } = options || {};

        const dispatchLog = (log: ConsoleOutput) => {
            if (onLog) onLog(log);
        };

        dispatchLog({ type: 'info', message: 'Sending code to execution server...' });

        // Simulate execution delay
        setTimeout(() => {
            dispatchLog({ type: 'log', message: `Executing ${language} code mock...` });
            dispatchLog({ type: 'log', message: 'Hello, Elitefolks! Code executed successfully in showcase mode.' });

            dispatchLog({
                type: 'info',
                message: `\nExecution Stats:\nRuntime: 0.12s\nMemory: 12MB\nExit Code: 0`
            });

            setIsRunning(false);
            if (onComplete) onComplete();
        }, 1500);

    }, []);

    return {
        runCode,
        isRunning
    };
}
