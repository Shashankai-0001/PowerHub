import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (onComplete) onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-4xl font-mono font-bold mb-4">{formatTime(timeLeft)}</div>
            <div className="space-x-2">
                <button onClick={toggle} className={`px-4 py-2 rounded text-white ${isActive ? 'bg-yellow-500' : 'bg-green-500'}`}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={reset} className="px-4 py-2 rounded bg-gray-500 text-white">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
