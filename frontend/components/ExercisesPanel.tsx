import React from 'react';

const ExercisesPanel: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                <i className="fas fa-code text-2xl text-zinc-600"></i>
            </div>
            <h3 className="text-zinc-300 font-bold mb-2">No Exercises</h3>
            <p className="text-sm max-w-xs text-center">
                This lesson doesn't have any specific exercises yet. Practice in the code editor on the right!
            </p>
        </div>
    );
};

export default ExercisesPanel;
