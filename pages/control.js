import { useState, useEffect } from 'react';

// Определяем массив с названиями голов (для выбора целевого имени)
const headsData = [
  { name: 'Donk' },
  { name: 'Simple' },
  { name: 'Head 3' },
  { name: 'Head 4' },
  { name: 'Head 5' }
];

export default function ControlPanel() {
  const [results, setResults] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);

  // Подписываемся на канал для получения результатов игры
  useEffect(() => {
    const channel = new BroadcastChannel('twitch-game');

    channel.onmessage = (event) => {
      if (event.data.command === 'result') {
        // event.data содержит: { player, reactionTime }
        setResults((prevResults) => {
          const updatedResults = [...prevResults, event.data];
          // Сортируем по времени реакции (чем меньше — тем лучше)
          updatedResults.sort((a, b) => a.reactionTime - b.reactionTime);
          // Оставляем только топ 20
          return updatedResults.slice(0, 20);
        });
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // При нажатии на кнопку выбирается случайная голова и начинается игра
  const handleStart = () => {
    // Выбираем случайное целевое имя из массива
    const randomIndex = Math.floor(Math.random() * headsData.length);
    const targetName = headsData[randomIndex].name;
    setCurrentTarget(targetName);
    // Очищаем предыдущие результаты
    setResults([]);
    // Отправляем сообщение о начале игры с выбранным целевым именем
    const channel = new BroadcastChannel('twitch-game');
    channel.postMessage({ command: 'startGame', target: targetName });
    channel.close();
    alert(`Начало игры! Целевая голова: ${targetName}`);
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
        Start Game
      </button>
      {currentTarget && (
        <div style={{ marginTop: '20px' }}>
          <h2>Целевая голова: {currentTarget}</h2>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h2>Топ 20 игроков</h2>
        {results.length === 0 ? (
          <p>Ожидание результатов...</p>
        ) : (
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Место</th>
                <th>Игрок</th>
                <th>Время реакции (мс)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={`${result.player}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{result.player}</td>
                  <td>{result.reactionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
