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
    if (size <= 3) return 'w-24 h-24 md:w-32 md:h-32 text-6xl';
    if (size <= 4) return 'w-20 h-20 md:w-28 md:h-28 text-5xl';
    if (size <= 5) return 'w-16 h-16 md:w-24 md:h-24 text-4xl';
    if (size <= 6) return 'w-14 h-14 md:w-20 md:h-20 text-3xl';
    return 'w-12 h-12 md:w-16 md:h-16 text-2xl';
  };

  return (
    <div className="animate-scale-in">
      {/* Внешнее свечение */}
      <div className={`relative p-1 rounded-3xl ${
        isDark 
          ? 'bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30' 
          : 'bg-gradient-to-br from-indigo-300/50 via-purple-300/40 to-pink-300/50'
      }`}>
        <div
          className={`grid gap-2 md:gap-3 p-4 md:p-6 rounded-3xl ${
            isDark 
              ? 'glass-dark' 
              : 'glass-light'
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
                  ${getCellSize()} flex items-center justify-center rounded-2xl font-black
                  transition-all duration-300 transform relative overflow-hidden
                  ${isWinning 
                    ? 'animate-win-glow bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 text-white scale-110 z-10' 
                    : cell 
                      ? isDark 
                        ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-inner' 
                        : 'bg-gradient-to-br from-white to-gray-50 shadow-inner'
                      : isDark 
                        ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-indigo-900/40 hover:to-purple-900/40 cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 cell-hover border border-white/5 hover:border-indigo-500/30' 
                        : 'bg-gradient-to-br from-white/80 to-gray-50/80 hover:from-indigo-50 hover:to-purple-50 cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 cell-hover border border-gray-200 hover:border-indigo-300'
                  }
                `}
              >
                {cell === 'X' && (
                  <span className="animate-bounce-in relative">
                    <span className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      ✕
                    </span>
                    {isDark && (
                      <span className="absolute inset-0 flex items-center justify-center text-blue-400 opacity-30 blur-sm">
                        ✕
                      </span>
                    )}
                  </span>
                )}
                {cell === 'O' && (
                  <span className="animate-bounce-in relative">
                    <span className="bg-gradient-to-br from-pink-400 via-rose-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                      ○
                    </span>
                    {isDark && (
                      <span className="absolute inset-0 flex items-center justify-center text-pink-400 opacity-30 blur-sm">
                        ○
                      </span>
                    )}
                  </span>
                )}
                {!cell && !disabled && (
                  <span className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-30 transition-all duration-300 ${
                    isDark ? 'text-white' : 'text-indigo-400'
                  }`}>
                    <span className="text-3xl">+</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
