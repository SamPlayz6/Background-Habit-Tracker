import React, { useState, useEffect } from 'react';
import { Bell, Sun, Book, Moon, Film, Clock, Coffee, Droplet, Music } from 'lucide-react';

const { ipcRenderer } = window.require('electron');

const HabitDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [flashcardTimer, setFlashcardTimer] = useState(3600);
  const [isFlashcardPaused, setIsFlashcardPaused] = useState(false);
  const [showFlashcardAlert, setShowFlashcardAlert] = useState(false);
  const [studyQuota, setStudyQuota] = useState({ research: 0, modules: 0 });
  const [meditationCount, setMeditationCount] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(7200);
  const [showMeditationAlert, setShowMeditationAlert] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [mealTimer, setMealTimer] = useState(10800);
  const [showMealAlert, setShowMealAlert] = useState(false);
  const [mediaConsumption, setMediaConsumption] = useState({ web: 0, spotify: 0, youtube: 0 });
  const [digitalSunset, setDigitalSunset] = useState({ hour: 21, minute: 0 });
  const [sleepSchedule, setSleepSchedule] = useState({ bedtime: { hour: 23, minute: 0 }, wakeup: { hour: 7, minute: 0 } });
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  useEffect(() => {
    ipcRenderer.invoke('load-data').then((savedData) => {
      if (savedData) {
        setDigitalSunset(savedData.digitalSunset);
        setSleepSchedule(savedData.sleepSchedule);
        setLastResetDate(savedData.lastResetDate || new Date().toDateString());

        if (savedData.lastResetDate === new Date().toDateString()) {
          setStudyQuota(savedData.studyQuota);
          setWaterIntake(savedData.waterIntake);
          setMeditationCount(savedData.meditationCount);
          setMediaConsumption(savedData.mediaConsumption);
        }
      }
    });

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      if (now.toDateString() !== lastResetDate) {
        resetDailyValues();
        setLastResetDate(now.toDateString());
      }

      if (!isFlashcardPaused) {
        setFlashcardTimer(prev => {
          if (prev <= 0) {
            setShowFlashcardAlert(true);
            return 3600;
          }
          return prev - 1;
        });
      }

      setMeditationTimer(prev => {
        if (prev <= 0) {
          setShowMeditationAlert(true);
          return 7200;
        }
        return prev - 1;
      });

      setMealTimer(prev => {
        if (prev <= 0) {
          setShowMealAlert(true);
          return 10800;
        }
        return prev - 1;
      });

      setMediaConsumption(prev => ({
        web: prev.web + (Math.random() > 0.5 ? 1/60 : 0),
        spotify: prev.spotify + (Math.random() > 0.7 ? 1/60 : 0),
        youtube: prev.youtube + (Math.random() > 0.8 ? 1/60 : 0),
      }));

    }, 1000);

    return () => clearInterval(timer);
  }, [isFlashcardPaused, lastResetDate]);

  useEffect(() => {
    const dataToSave = {
      digitalSunset,
      sleepSchedule,
      studyQuota,
      waterIntake,
      meditationCount,
      mediaConsumption,
      lastResetDate
    };
    ipcRenderer.invoke('save-data', dataToSave);
  }, [digitalSunset, sleepSchedule, studyQuota, waterIntake, meditationCount, mediaConsumption, lastResetDate]);

  const resetDailyValues = () => {
    setStudyQuota({ research: 0, modules: 0 });
    setWaterIntake(0);
    setMeditationCount(0);
    setMediaConsumption({ web: 0, spotify: 0, youtube: 0 });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const confirmFlashcards = () => {
    setFlashcardTimer(3600);
    setShowFlashcardAlert(false);
  };

  const pauseFlashcards = () => {
    setIsFlashcardPaused(true);
    setTimeout(() => setIsFlashcardPaused(false), 1800000);
  };

  const incrementStudyQuota = (type) => {
    setStudyQuota(prev => ({
      ...prev,
      [type]: Math.min(prev[type] + 10, 100)
    }));
  };

  const incrementMeditation = () => {
    setMeditationCount(prev => prev + 1);
    setShowMeditationAlert(false);
  };

  const incrementWater = () => setWaterIntake(prev => Math.min(prev + 1, 8));

  const confirmMeal = () => {
    setMealTimer(10800);
    setShowMealAlert(false);
  };

  const updateDigitalSunset = (e) => {
    const [hour, minute] = e.target.value.split(':');
    setDigitalSunset({ hour: parseInt(hour), minute: parseInt(minute) });
  };

  const updateSleepSchedule = (type, e) => {
    const [hour, minute] = e.target.value.split(':');
    setSleepSchedule(prev => ({
      ...prev,
      [type]: { hour: parseInt(hour), minute: parseInt(minute) }
    }));
  };

  return (
    <div className="p-4 bg-white bg-opacity-80 text-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Habit Dashboard</h1>
      
      {showFlashcardAlert && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          <h2 className="font-bold">Flashcard Time!</h2>
          <p>It's time for your flashcard session.</p>
          <button onClick={confirmFlashcards} className="mr-2 mt-2 px-4 py-2 bg-green-500 text-white rounded">Confirm</button>
          <button onClick={pauseFlashcards} className="px-4 py-2 bg-red-500 text-white rounded">Pause for 30 mins</button>
        </div>
      )}

      {showMeditationAlert && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
          <h2 className="font-bold">Meditation Reminder</h2>
          <p>It's time for a meditation break.</p>
          <button onClick={incrementMeditation} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Log Meditation</button>
        </div>
      )}

      {showMealAlert && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          <h2 className="font-bold">Meal Reminder</h2>
          <p>It's time to eat something.</p>
          <button onClick={confirmMeal} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Confirm Meal</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Clock className="mr-2" /> Current Time
          </h2>
          <p className="text-3xl font-bold">{time.toLocaleTimeString()}</p>
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Bell className="mr-2" /> Flashcard Timer
          </h2>
          <p className="text-3xl font-bold mb-2">{formatTime(flashcardTimer)}</p>
          {isFlashcardPaused && <p className="text-sm text-gray-500">Paused for 30 minutes</p>}
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Sun className="mr-2" /> Digital Sunset
          </h2>
          <input
            type="time"
            value={`${digitalSunset.hour.toString().padStart(2, '0')}:${digitalSunset.minute.toString().padStart(2, '0')}`}
            onChange={updateDigitalSunset}
            className="mb-2 p-2 border rounded"
          />
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: `${(time.getHours() * 60 + time.getMinutes()) / (digitalSunset.hour * 60 + digitalSunset.minute) * 100}%`}}></div>
          </div>
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Book className="mr-2" /> Study Quota
          </h2>
          <p>Research:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${studyQuota.research}%`}}></div>
          </div>
          <button onClick={() => incrementStudyQuota('research')} className="mb-2 px-4 py-2 bg-blue-500 text-white rounded">Log Research</button>
          <p>Modules:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${studyQuota.modules}%`}}></div>
          </div>
          <button onClick={() => incrementStudyQuota('modules')} className="px-4 py-2 bg-green-500 text-white rounded">Log Modules</button>
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Moon className="mr-2" /> Sleep Schedule
          </h2>
          <p>Bedtime:</p>
          <input
            type="time"
            value={`${sleepSchedule.bedtime.hour.toString().padStart(2, '0')}:${sleepSchedule.bedtime.minute.toString().padStart(2, '0')}`}
            onChange={(e) => updateSleepSchedule('bedtime', e)}
            className="mb-2 p-2 border rounded"
          />
          <p>Wake up:</p>
          <input
            type="time"
            value={`${sleepSchedule.wakeup.hour.toString().padStart(2, '0')}:${sleepSchedule.wakeup.minute.toString().padStart(2, '0')}`}
            onChange={(e) => updateSleepSchedule('wakeup', e)}
            className="mb-2 p-2 border rounded"
          />
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Film className="mr-2" /> Media Consumption
          </h2>
          <p>Web: {mediaConsumption.web.toFixed(2)} minutes</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${Math.min(mediaConsumption.web / 120 * 100, 100)}%`}}></div>
          </div>
          <p>Spotify: {mediaConsumption.spotify.toFixed(2)} minutes</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${Math.min(mediaConsumption.spotify / 120 * 100, 100)}%`}}></div>
          </div>
          <p>YouTube: {mediaConsumption.youtube.toFixed(2)} minutes</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${Math.min(mediaConsumption.youtube / 120 * 100, 100)}%`}}></div>
          </div>
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Coffee className="mr-2" /> Breaks/Meditation
          </h2>
          <p className="text-2xl font-bold mb-2">Count: {meditationCount}</p>
          <button onClick={incrementMeditation} className="px-4 py-2 bg-purple-500 text-white rounded">Log Break/Meditation</button>
          <p className="mt-2">Next reminder in: {formatTime(meditationTimer)}</p>
        </div>

        <div className="p-6 border rounded shadow-lg bg-white bg-opacity-90">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <Droplet className="mr-2" /> Water & Meals
          </h2>
          <p>Water Intake: {waterIntake}/8 glasses</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${waterIntake / 8 * 100}%`}}></div>
          </div>
          <button onClick={incrementWater} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Log Water</button>
          <p>Next meal reminder in: {formatTime(mealTimer)}</p>
          {showMealAlert && <button onClick={confirmMeal} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Confirm Meal</button>}
        </div>
      </div>
    </div>
  );
};

export default HabitDashboard;