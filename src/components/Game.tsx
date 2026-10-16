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

  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) line.push(row * size + col + k);
      lines.push(line);
    }
  }

  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - winLength; row++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) line.push((row + k) * size + col);
      lines.push(line);
    }
  }

  for (let row = 0; row <= size - winLength; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) line.push((row + k) * size + (col + k));
      lines.push(line);
    }
  }

  for (let row = 0; row <= size - winLength; row++) {
    for (let col = winLength - 1; col < size; col++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) line.push((row + k) * size + (col - k));
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
      interval = setInterval(() => setGameTime(prev => prev + 1), 1000);
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
    <div className={`min-h-screen p-4 md:p-8 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50'
    }`}>
      {/* Фоновые декорации */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/30'
        }`}></div>
        <div className={`absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-200/30'
        }`}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Хедер */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Крестики-Нолики
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Поле {boardSize}×{boardSize} • Цель: {winLength} в ряд
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${
              isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-sm shadow-sm'
            }`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {username[0].toUpperCase()}
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {username}
              </span>
            </div>
            <button
              onClick={onShowStats}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isDark ? 'glass-dark text-white hover:bg-white/10' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-sm'
              }`}
            >
              📊
            </button>
            <button
              onClick={onLogout}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isDark ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              🚪
            </button>
          </div>
        </div>

        {/* Настройки */}
        {showSettings && (
          <div className={`rounded-2xl p-6 md:p-8 mb-6 animate-fade-in-up ${
            isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-100/50'
          }`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm">⚙️</span>
              Настройки игры
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slide-left">
                <label className={`block text-xs font-semibold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  📐 Размер поля
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 4, 5, 6, 7].map(size => (
                    <button
                      key={size}
                      onClick={() => { setBoardSize(size); playClickSound(); }}
                      className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        boardSize === size
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                          : isDark ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {size}×{size}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                  🎯 Для победы нужно собрать <strong>{winLength}</strong> в ряд
                </div>
              </div>

              <div className="animate-slide-right">
                <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  🔵 Игрок 1 (✕)
                </label>
                <input
                  type="text"
                  value={playerX}
                  onChange={(e) => setPlayerX(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isDark ? 'bg-gray-800/50 border-gray-700 text-white focus:border-blue-400 focus:ring-blue-400/20' : 'bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20'
                  }`}
                />
                <label className={`block text-xs font-semibold mb-2 mt-4 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  🔴 Игрок 2 (○)
                </label>
                <input
                  type="text"
                  value={playerO}
                  onChange={(e) => setPlayerO(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isDark ? 'bg-gray-800/50 border-gray-700 text-white focus:border-pink-400 focus:ring-pink-400/20' : 'bg-gray-50 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20'
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔊 Звуковое сопровождение
                </span>
              </label>
            </div>

            <button
              onClick={startGame}
              className="mt-6 w-full py-4 px-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] text-lg animate-gradient"
            >
              🚀 Начать игру
            </button>
          </div>
        )}

        {/* Игровая панель */}
        {gameStarted && (
          <div className="flex flex-col items-center animate-fade-in">
            {/* Статус */}
            <div className={`w-full rounded-2xl p-4 md:p-5 mb-6 ${
              isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-100/50'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className={`px-5 py-3 rounded-xl font-bold text-lg transition-all duration-500 ${
                  winner 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 animate-pulse'
                    : isDraw
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                      : currentPlayer === 'X'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/30'
                }`}>
                  {winner 
                    ? `🎉 Победил ${winner === 'X' ? playerX : playerO}!`
                    : isDraw
                      ? '🤝 Ничья!'
                      : `${currentPlayer === 'X' ? '✕' : '○'} ${currentPlayer === 'X' ? playerX : playerO}`
                  }
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">⏱️</span>
                    <span className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {formatTime(gameTime)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">📝</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {moves}
                    </span>
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
            <div className="flex gap-3 mt-8">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
              >
                🔄 Новая игра
              </button>
              <button
                onClick={resetGame}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isDark ? 'glass-dark text-white hover:bg-white/10' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg'
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
