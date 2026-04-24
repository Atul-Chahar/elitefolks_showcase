import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DailyGoal } from '../components/DashboardWidgets';

export const useDailyQuests = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState<DailyGoal[]>([
        { id: '1', title: 'Complete next lesson', completed: false },
        { id: '2', title: 'Use voice command', completed: false },
        { id: '3', title: 'Earn 50 XP', completed: false },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Dummy showcase data
        setTimeout(() => {
            setGoals([
                { id: '1', title: 'Complete next lesson', completed: true },
                { id: '2', title: 'Use voice command', completed: true },
                { id: '3', title: 'Earn 50 XP', completed: true },
            ]);
            setLoading(false);
        }, 500);

    }, [user]);

    return { goals, loading };
};
