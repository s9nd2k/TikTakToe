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

  const cellSize = size <= 3 ? 'w-20 h-20 text-4xl' : size <= 5 ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl';

  return (
    <div
      className={`inline-grid gap-2 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          disabled={!!cell || disabled}
          className={`
            ${cellSize} flex items-center justify-center rounded-lg font-bold
            transition-all duration-200 transform
            ${winningCells.includes(index) 
              ? 'bg-green-400 text-white scale-110 shadow-lg' 
              : cell 
                ? isDark ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800'
                : isDark 
                  ? 'bg-gray-600 hover:bg-gray-500 cursor-pointer hover:scale-105' 
                  : 'bg-gray-50 hover:bg-blue-50 cursor-pointer hover:scale-105'
            }
            ${!cell && !disabled ? 'hover:shadow-md' : ''}
            border-2 ${isDark ? 'border-gray-500' : 'border-gray-200'}
          `}
        >
          {cell === 'X' && <span className="text-blue-500 font-extrabold">✕</span>}
          {cell === 'O' && <span className="text-red-500 font-extrabold">○</span>}
        </button>
      ))}
    </div>
  );
}
