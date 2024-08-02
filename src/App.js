import React from 'react';
import HabitDashboard from './HabitDashboard';

function App() {
  return (
    <div className="App" style={{
      backgroundColor: 'white',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <HabitDashboard />
    </div>
  );
}

export default App;