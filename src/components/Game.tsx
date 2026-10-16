import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Confetti from './Confetti';
import AnimatedBg from './AnimatedBg';
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
  const [showConfetti, setShowConfetti] = useState(false);

  const winLength = boardSize <= 3 ? 3 : boardSize <= 5 ? 4 : 5;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && !winner && !isDraw) {
      interval = setInterval(() => setGameTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, winner, isDraw]);

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

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
    setShowConfetti(false);
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
    setShowConfetti(false);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 relative overflow-hidden ${
      isDark ? 'mesh-gradient-dark' : 'mesh-gradient-light'
    }`}>
      <AnimatedBg isDark={isDark} />
      <Confetti active={showConfetti} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Хедер */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-md opacity-50"></div>
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl animate-gradient">
                <span className="text-xl font-black text-white">✕</span>
              </div>
            </div>
            <div>
              <h1 className={`text-xl md:text-2xl font-black font-game bg-gradient-to-r ${
                isDark ? 'from-indigo-300 to-purple-300' : 'from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                КРЕСТИКИ-НОЛИКИ
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {boardSize}×{boardSize} • Цель: {winLength} в ряд
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl ${
              isDark ? 'glass-dark' : 'glass-light'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {username[0].toUpperCase()}
              </div>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                {username}
              </span>
            </div>
            <button
              onClick={onShowStats}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                isDark ? 'glass-dark text-white hover:bg-white/10' : 'glass-light text-gray-700 hover:bg-white'
              }`}
            >
              📊
            </button>
            <button
              onClick={onLogout}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                isDark ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }`}
            >
              🚪
            </button>
          </div>
        </div>

        {/* Настройки */}
        {showSettings && (
          <div className={`rounded-3xl p-6 md:p-8 mb-8 animate-fade-in-up ${
            isDark ? 'glass-dark' : 'glass-light shadow-xl shadow-indigo-100/50'
          }`}>
            <h2 className={`text-xl font-black mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-lg shadow-orange-500/30">⚙️</span>
              Настройки игры
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="animate-slide-left">
                <label className={`block text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  📐 Размер поля
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 4, 5, 6, 7].map(size => (
                    <button
                      key={size}
                      onClick={() => { setBoardSize(size); playClickSound(); }}
                      className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 ${
                        boardSize === size
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40 scale-105'
                          : isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {size}×{size}
                    </button>
                  ))}
                </div>
                <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                }`}>
                  <span className="text-lg">🎯</span>
                  Для победы нужно собрать <strong className="text-lg">{winLength}</strong> в ряд
                </div>
              </div>

              <div className="animate-slide-right space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    🔵 Игрок 1 (✕)
                  </label>
                  <input
                    type="text"
                    value={playerX}
                    onChange={(e) => setPlayerX(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      isDark ? 'bg-black/30 border-gray-700 text-white focus:border-blue-400 focus:ring-blue-400/20' : 'bg-white/60 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
                    🔴 Игрок 2 (○)
                  </label>
                  <input
                    type="text"
                    value={playerO}
                    onChange={(e) => setPlayerO(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      isDark ? 'bg-black/30 border-gray-700 text-white focus:border-pink-400 focus:ring-pink-400/20' : 'bg-white/60 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20'
                    }`}
                  />
                </div>
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
                  <div className={`w-12 h-7 rounded-full transition-colors peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  <div className="absolute left-0.5 top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔊 Звуковое сопровождение
                </span>
              </label>
            </div>

            <button
              onClick={startGame}
              className="mt-8 w-full py-4 px-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-black rounded-xl shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] text-lg animate-gradient btn-shine"
            >
              🚀 НАЧАТЬ ИГРУ
            </button>
          </div>
        )}

        {/* Игровая панель */}
        {gameStarted && (
          <div className="flex flex-col items-center animate-fade-in">
            {/* Статус */}
            <div className={`w-full rounded-2xl p-5 md:p-6 mb-8 ${
              isDark ? 'glass-dark' : 'glass-light shadow-xl shadow-indigo-100/50'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className={`px-6 py-4 rounded-xl font-black text-lg transition-all duration-500 ${
                  winner 
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl shadow-green-500/40 animate-pulse scale-105'
                    : isDraw
                      ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white shadow-2xl shadow-yellow-500/40'
                      : currentPlayer === 'X'
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl shadow-blue-500/40'
                        : 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-2xl shadow-pink-500/40'
                }`}>
                  {winner 
                    ? `🎉 Победил ${winner === 'X' ? playerX : playerO}!`
                    : isDraw
                      ? '🤝 Ничья!'
                      : `${currentPlayer === 'X' ? '✕' : '○'} Ходит: ${currentPlayer === 'X' ? playerX : playerO}`
                  }
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-5 py-3 rounded-xl ${
                    isDark ? 'bg-black/30 border border-white/5' : 'bg-white/60 border border-gray-200'
                  }`}>
                    <span className="text-xl">⏱️</span>
                    <span className={`font-mono font-black text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {formatTime(gameTime)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-5 py-3 rounded-xl ${
                    isDark ? 'bg-black/30 border border-white/5' : 'bg-white/60 border border-gray-200'
                  }`}>
                    <span className="text-xl">📝</span>
                    <span className={`font-black text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
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
            <div className="flex gap-4 mt-8">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black rounded-xl shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-gradient btn-shine"
              >
                🔄 Новая игра
              </button>
              <button
                onClick={resetGame}
                className={`px-8 py-4 rounded-xl font-black transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  isDark ? 'glass-dark text-white hover:bg-white/10 border border-white/10' : 'glass-light text-gray-700 hover:bg-white border border-gray-200'
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
