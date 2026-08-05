// Reusable Exercise Card Display Component
import React, { useState } from 'react';

const ExerciseCard = ({ exercise, onSelect, onAdd }) => {
    const [imgError, setImgError] = useState(false);

    const hasValidImage = exercise.gifUrl && !imgError && !exercise.gifUrl.includes('giphy.gif') && !exercise.gifUrl.includes('placehold');

    return (
        <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border group flex flex-col justify-between h-full">
            <div>
                {hasValidImage && (
                    <div className="relative overflow-hidden h-48">
                        <img 
                            src={exercise.gifUrl} 
                            alt={exercise.name} 
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                    </div>
                )}
                <div className="p-6 relative">
                    <h3 className="text-xl font-black mb-3 text-foreground tracking-tight">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-primary/20 text-primary border border-primary/20 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">{exercise.category}</span>
                        <span className="bg-secondary/20 text-secondary border border-secondary/20 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">{exercise.difficulty}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                        <strong className="text-foreground">Muscles:</strong> {Array.isArray(exercise.targetMuscles) ? exercise.targetMuscles.join(', ') : exercise.targetMuscles}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                        <strong className="text-foreground">Equipment:</strong> {exercise.equipment}
                    </p>
                </div>
            </div>

            <div className="px-6 pb-6 pt-0">
                {onAdd && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(exercise); }}
                        className="w-full bg-green-500/20 text-green-400 border border-green-500/50 py-3 rounded-xl font-bold hover:bg-green-500/30 transition duration-300 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:scale-[1.02]"
                    >
                        Add to Workout +
                    </button>
                )}

                {onSelect && (
                    <button
                        onClick={() => onSelect(exercise)}
                        className="w-full mt-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition duration-300 shadow-[0_0_15px_rgba(0,163,255,0.2)] hover:scale-[1.02]"
                    >
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExerciseCard;
