import { useEffect } from 'react';

export default function ControlPanel() {
  const handleStart = () => {
    const channel = new BroadcastChannel('twitch-game');
    channel.postMessage({ command: 'startGame' });
    alert("Сигнал старта отправлен!");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Панель управления Twitch Extension</h1>
      <button 
        onClick={handleStart}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Start
      </button>
    </div>
  );
}
