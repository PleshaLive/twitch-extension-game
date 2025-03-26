import { useState, useEffect } from 'react';

// Массив с данными для каждой головы (имя и путь к изображению)
const headsData = [
  { name: 'Donk', src: '/donk.png' },
  { name: 'Simple', src: '/simple.png' },
  { name: 'Head 3', src: '/head3.png' },
  { name: 'Head 4', src: '/head4.png' },
  { name: 'Head 5', src: '/head5.png' }
];

export default function Game() {
  const [playerName, setPlayerName] = useState('');
  const [target, setTarget] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [heads, setHeads] = useState([]);
  const [resultSent, setResultSent] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Запрашиваем имя игрока при загрузке страницы
  useEffect(() => {
    let name = prompt("Введите ваше имя игрока:");
    if (!name) {
      name = "Игрок_" + Math.floor(Math.random() * 1000);
    }
    setPlayerName(name);
  }, []);

  // Подписываемся на канал для получения команды старта игры
  useEffect(() => {
    const channel = new BroadcastChannel('twitch-game');

    channel.onmessage = (event) => {
      if (event.data.command === 'startGame') {
        startGame(event.data.target);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Функция запуска игры: сохраняем целевое имя, время старта и генерируем случайные позиции для голов
  const startGame = (targetName) => {
    setResultSent(false);
    setFeedback('');
    setTarget(targetName);
    setStartTime(Date.now());

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const newHeads = headsData.map(() => ({
      x: Math.random() * (vw - 100),
      y: Math.random() * (vh - 100)
    }));
    setHeads(newHeads);
  };

  // Обработка клика по изображению головы
  const handleHeadClick = (headName) => {
    // Если игра не запущена или результат уже отправлен, ничего не делаем
    if (!target || resultSent) return;

    if (headName === target) {
      const reactionTime = Date.now() - startTime;
      setFeedback(`Правильно! Ваше время: ${reactionTime} мс`);
      // Отправляем результат через BroadcastChannel
      const channel = new BroadcastChannel('twitch-game');
      channel.postMessage({ command: 'result', player: playerName, reactionTime });
      channel.close();
      setResultSent(true);
    } else {
      setFeedback("Неправильная голова! Попробуйте еще раз.");
    }
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
      {target && (
        <div style={{ textAlign: 'center', fontSize: '24px', margin: '20px' }}>
          Нажмите на голову: <strong>{target}</strong>
        </div>
      )}
      {feedback && (
        <div style={{ textAlign: 'center', margin: '10px', color: 'green', fontWeight: 'bold' }}>
          {feedback}
        </div>
      )}
      {heads.map((head, index) => (
        <img 
          key={index}
          src={headsData[index].src}
          alt={headsData[index].name}
          onClick={() => handleHeadClick(headsData[index].name)}
          style={{
            position: 'absolute',
            left: head.x,
            top: head.y,
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      ))}
    </div>
  );
}
