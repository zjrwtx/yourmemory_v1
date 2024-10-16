import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, StopCircle, Settings } from 'lucide-react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            if (mode === 'work') {
              setMode('break');
              setMinutes(breakDuration);
              setCompletedPomodoros(prev => prev + 1);
            } else {
              setMode('work');
              setMinutes(workDuration);
            }
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(workDuration);
    setSeconds(0);
  };

  const stopTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(workDuration);
    setSeconds(0);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleWorkDurationChange = (e) => {
    const value = parseInt(e.target.value);
    setWorkDuration(value);
    if (mode === 'work' && !isActive) {
      setMinutes(value);
      setSeconds(0);
    }
  };

  const handleBreakDurationChange = (e) => {
    const value = parseInt(e.target.value);
    setBreakDuration(value);
    if (mode === 'break' && !isActive) {
      setMinutes(value);
      setSeconds(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-amber-800 mb-6 text-center">
          {mode === 'work' ? '专注时间' : '休息时间'}
        </h1>
        <div className="text-6xl font-bold text-amber-600 text-center mb-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={toggleTimer}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 transition-colors duration-300"
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors duration-300"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={stopTimer}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-4 transition-colors duration-300"
          >
            <StopCircle size={24} />
          </button>
          <button
            onClick={toggleSettings}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors duration-300"
          >
            <Settings size={24} />
          </button>
        </div>
        {showSettings && (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-amber-700 mb-2">工作时长 (分钟):</label>
              <input
                type="number"
                value={workDuration}
                onChange={handleWorkDurationChange}
                className="w-full p-2 border border-amber-300 rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-amber-700 mb-2">休息时长 (分钟):</label>
              <input
                type="number"
                value={breakDuration}
                onChange={handleBreakDurationChange}
                className="w-full p-2 border border-amber-300 rounded"
                min="1"
              />
            </div>
          </div>
        )}
        <div className="text-center text-amber-700">
          <p className="mb-2">已完成番茄钟</p>
          <div className="flex justify-center space-x-2">
            {[...Array(completedPomodoros)].map((_, i) => (
              <CheckCircle key={i} size={24} className="text-green-500" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;