import React, { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const App = () => {
  const [habits, setHabits] = useState({
    flashcards: { timer: 3600, isActive: false },
    studyQuota: 0,
    meditationCount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (habits.flashcards.isActive) {
        setHabits(prevHabits => ({
          ...prevHabits,
          flashcards: {
            ...prevHabits.flashcards,
            timer: prevHabits.flashcards.timer > 0 ? prevHabits.flashcards.timer - 1 : 3600
          }
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [habits.flashcards.isActive]);

  useEffect(() => {
    saveData();
  }, [habits]);

  const loadData = async () => {
    const savedData = await ipcRenderer.invoke('load-data');
    if (savedData) {
      setHabits(savedData);
    }
  };

  const saveData = () => {
    ipcRenderer.send('save-data', habits);
  };

  const toggleFlashcardTimer = () => {
    setHabits(prevHabits => ({
      ...prevHabits,
      flashcards: {
        ...prevHabits.flashcards,
        isActive: !prevHabits.flashcards.isActive
      }
    }));
  };

  const incrementStudyQuota = () => {
    setHabits(prevHabits => ({
      ...prevHabits,
      studyQuota: Math.min(prevHabits.studyQuota + 25, 100)
    }));
  };

  const incrementMeditation = () => {
    setHabits(prevHabits => ({
      ...prevHabits,
      meditationCount: prevHabits.meditationCount + 1
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Habit Tracker</h1>
      
      <div className="mb-4">
        <h2 className="font-bold">Flashcards</h2>
        <p className="text-lg font-semibold">{formatTime(habits.flashcards.timer)}</p>
        <button 
          className={`px-2 py-1 rounded ${habits.flashcards.isActive ? 'bg-red-500' : 'bg-green-500'} text-white`}
          onClick={toggleFlashcardTimer}
        >
          {habits.flashcards.isActive ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-bold">Study Quota</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${habits.studyQuota}%`}}></div>
        </div>
        <button 
          className="mt-2 px-2 py-1 rounded bg-blue-500 text-white"
          onClick={incrementStudyQuota}
        >
          Log 25% Progress
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-bold">Meditation/Breaks</h2>
        <p className="text-lg font-semibold">Count: {habits.meditationCount}</p>
        <button 
          className="px-2 py-1 rounded bg-purple-500 text-white"
          onClick={incrementMeditation}
        >
          Log Meditation
        </button>
      </div>
    </div>
  );
};

export default App;