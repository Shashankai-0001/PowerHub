import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setTime(0);
    };

    const formatTime = (milliseconds) => {
        const mins = Math.floor(milliseconds / 60000);
        const secs = Math.floor((milliseconds % 60000) / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}.${ms < 10 ? '0' : ''}${ms}`;
    };

    return (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-4xl font-mono font-bold mb-4">{formatTime(time)}</div>
            <div className="space-x-2">
                <button onClick={toggle} className={`px-4 py-2 rounded text-white ${isActive ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={reset} className="px-4 py-2 rounded bg-gray-500 text-white">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Stopwatch;
