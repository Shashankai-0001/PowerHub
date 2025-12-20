import React from 'react';

const ExerciseCard = ({ exercise, onSelect }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            {exercise.gifUrl && (
                <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{exercise.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">{exercise.category}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">{exercise.difficulty}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2"><strong>Muscles:</strong> {exercise.targetMuscles.join(', ')}</p>
                <p className="text-gray-600 text-sm mb-4"><strong>Equipment:</strong> {exercise.equipment}</p>
                {exercise.gifUrl && exercise.gifUrl.includes('placehold.co') && (
                    <p className="text-xs text-gray-400 italic mb-2">* Animation coming soon</p>
                )}

                {onSelect && (
                    <button
                        onClick={() => onSelect(exercise)}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExerciseCard;
