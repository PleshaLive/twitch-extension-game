import { useState, useEffect } from 'react';

const headsData = [
  { name: 'Голова 1' },
  { name: 'Голова 2' },
  { name: 'Голова 3' },
  { name: 'Голова 4' },
  { name: 'Голова 5' }
];

export default function Game() {
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    const channel = new BroadcastChannel('twitch-game');
    channel.onmessage = (event) => {
      if (event.data.command === 'startGame') {
        startGame();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const startGame = () => {
    // Получаем размеры окна
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Создаём 5 голов с случайными позициями
    const newHeads = headsData.map(() => ({
      x: Math.random() * (vw - 100), // отступ для корректного отображения
      y: Math.random() * (vh - 100)
    }));

    setHeads(newHeads);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#f0f0f0',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Игра Twitch Extension</h1>
      {heads.map((head, index) => (
        <div 
          key={index}
          style={{
            position: 'absolute',
            left: head.x,
            top: head.y,
            width: '80px',
            height: '80px',
            background: '#fff',
            border: '2px solid #000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {headsData[index].name}
        </div>
      ))}
    </div>
  );
}
