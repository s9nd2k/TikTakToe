import { playMoveSound } from '../utils/sounds';

interface BoardProps {
  board: (string | null)[];
  size: number;
  onCellClick: (index: number) => void;
  winningCells: number[];
  isDark: boolean;
  disabled: boolean;
}

export default function Board({ board, size, onCellClick, winningCells, isDark, disabled }: BoardProps) {
  const handleClick = (index: number) => {
    if (!board[index] && !disabled) {
      playMoveSound();
      onCellClick(index);
    }
  };

  const getCellSize = () => {
    if (size <= 3) return 'w-24 h-24 md:w-28 md:h-28 text-5xl';
    if (size <= 4) return 'w-20 h-20 md:w-24 md:h-24 text-4xl';
    if (size <= 5) return 'w-16 h-16 md:w-20 md:h-20 text-3xl';
    return 'w-12 h-12 md:w-16 md:h-16 text-2xl';
  };

  return (
    <div className="animate-scale-in">
      <div
        className={`inline-grid gap-2 md:gap-3 p-4 md:p-6 rounded-2xl ${
          isDark 
            ? 'glass-dark shadow-2xl shadow-indigo-500/10' 
            : 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-200/30'
        }`}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.map((cell, index) => {
          const isWinning = winningCells.includes(index);
          const row = Math.floor(index / size);
          const col = index % size;
          const delay = (row + col) * 30;

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || disabled}
              style={{ animationDelay: `${delay}ms` }}
              className={`
                ${getCellSize()} flex items-center justify-center rounded-xl font-bold
                transition-all duration-300 transform relative overflow-hidden
                ${isWinning 
                  ? 'animate-win-glow bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105' 
                  : cell 
                    ? isDark 
                      ? 'bg-gray-700/80 shadow-inner' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner'
                    : isDark 
                      ? 'bg-gray-700/50 hover:bg-gray-600/80 cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95 cell-hover' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95 cell-hover'
                }
                border-2 ${
                  isWinning 
                    ? 'border-green-300' 
                    : isDark 
                      ? 'border-gray-600/50 hover:border-indigo-500/50' 
                      : 'border-gray-200 hover:border-indigo-300'
                }
              `}
            >
              {cell === 'X' && (
                <span className="animate-bounce-in relative">
                  <span className="bg-gradient-to-br from-blue-400 to-indigo-600 bg-clip-text text-transparent font-black drop-shadow-lg">
                    ✕
                  </span>
                </span>
              )}
              {cell === 'O' && (
                <span className="animate-bounce-in relative">
                  <span className="bg-gradient-to-br from-pink-400 to-red-500 bg-clip-text text-transparent font-black drop-shadow-lg">
                    ○
                  </span>
                </span>
              )}
              {!cell && !disabled && (
                <span className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity text-2xl ${
                  isDark ? 'text-white' : 'text-gray-400'
                }`}>
                  •
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
