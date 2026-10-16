import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import { playWinSound, playDrawSound, playClickSound } from '../utils/sounds';
import { addRecord, updateStats } from '../utils/storage';

interface GameProps {
  username: string;
  isDark: boolean;
  onShowStats: () => void;
  onLogout: () => void;
}

function checkWinner(board: (string | null)[], size: number, winLength: number): { winner: string | null; cells: number[] } {
  const lines: number[][] = [];

  // Горизонтали
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push(row * size + col + k);
      }
      lines.push(line);
    }
  }

  // Вертикали
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - winLength; row++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((row + k) * size + col);
      }
      lines.push(line);
    }
  }

  // Диагонали (↘)
  for (let row = 0; row <= size - winLength; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((row + k) * size + (col + k));
      }
      lines.push(line);
    }
  }

  // Диагонали (↙)
  for (let row = 0; row <= size - winLength; row++) {
    for (let col = winLength - 1; col < size; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((row + k) * size + (col - k));
      }
      lines.push(line);
    }
  }

  for (const line of lines) {
    const values = line.map(i => board[i]);
    if (values[0] && values.every(v => v === values[0])) {
      return { winner: values[0], cells: line };
    }
  }

  return { winner: null, cells: [] };
}

export default function Game({ username, isDark, onShowStats, onLogout }: GameProps) {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [playerX, setPlayerX] = useState(username);
  const [playerO, setPlayerO] = useState('Игрок 2');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const winLength = boardSize <= 3 ? 3 : boardSize <= 5 ? 4 : 5;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && !winner && !isDraw) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, winner, isDraw]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setGameStarted(true);
    setGameTime(0);
    setMoves(0);
    setShowSettings(false);
  };

  const handleCellClick = useCallback((index: number) => {
    if (winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setMoves(prev => prev + 1);

    const { winner: w, cells } = checkWinner(newBoard, boardSize, winLength);
    if (w) {
      setWinner(w);
      setWinningCells(cells);
      if (soundEnabled) playWinSound();
      
      const winnerName = w === 'X' ? playerX : playerO;
      addRecord({
        username: winnerName,
        boardSize,
        winner: winnerName,
        duration: gameTime,
        date: new Date().toISOString(),
        moves: moves + 1,
      });
      updateStats(username, true, false, gameTime);
    } else if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
      if (soundEnabled) playDrawSound();
      updateStats(username, false, true, gameTime);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, isDraw, boardSize, winLength, playerX, playerO, gameTime, moves, soundEnabled, username]);

  const resetGame = () => {
    setShowSettings(true);
    setGameStarted(false);
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Хедер */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">🎮 Крестики-Нолики</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-700' : 'bg-white shadow'}`}>
              👤 {username}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShowStats}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800 shadow'
              }`}
            >
              📊 Статистика
            </button>
            <button
              onClick={onLogout}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-800'
              }`}
            >
              Выход
            </button>
          </div>
        </div>

        {/* Настройки */}
        {showSettings && (
          <div className={`rounded-xl p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h2 className="text-xl font-bold mb-4">⚙️ Настройки игры</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Размер поля
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 4, 5, 6, 7].map(size => (
                    <button
                      key={size}
                      onClick={() => { setBoardSize(size); playClickSound(); }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        boardSize === size
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {size}×{size}
                    </button>
                  ))}
                </div>
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Для победы нужно собрать {winLength} в ряд
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Имя Игрока 1 (✕)
                </label>
                <input
                  type="text"
                  value={playerX}
                  onChange={(e) => setPlayerX(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                  }`}
                />
                <label className={`block text-sm font-medium mb-2 mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Имя Игрока 2 (○)
                </label>
                <input
                  type="text"
                  value={playerO}
                  onChange={(e) => setPlayerO(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔊 Звуки
                </span>
              </label>
            </div>

            <button
              onClick={startGame}
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              🚀 Начать игру
            </button>
          </div>
        )}

        {/* Игровая панель */}
        {gameStarted && (
          <div className="flex flex-col items-center">
            {/* Статус */}
            <div className={`w-full rounded-xl p-4 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg font-bold ${
                    currentPlayer === 'X' && !winner && !isDraw
                      ? 'bg-blue-500 text-white'
                      : currentPlayer === 'O' && !winner && !isDraw
                        ? 'bg-red-500 text-white'
                        : isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {winner 
                      ? `🎉 Победил ${winner === 'X' ? playerX : playerO}!`
                      : isDraw
                        ? '🤝 Ничья!'
                        : `Ходит: ${currentPlayer === 'X' ? playerX : playerO} (${currentPlayer})`
                    }
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    ⏱️ {formatTime(gameTime)}
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    📝 Ходов: {moves}
                  </div>
                </div>
              </div>
            </div>

            {/* Поле */}
            <Board
              board={board}
              size={boardSize}
              onCellClick={handleCellClick}
              winningCells={winningCells}
              isDark={isDark}
              disabled={!!winner || isDraw}
            />

            {/* Кнопки */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                🔄 Новая игра
              </button>
              <button
                onClick={resetGame}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800 shadow'
                }`}
              >
                ⚙️ Настройки
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
