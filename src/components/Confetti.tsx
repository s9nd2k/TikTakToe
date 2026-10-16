import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
}

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];
      const shapes: ('square' | 'circle' | 'triangle')[] = ['square', 'circle', 'triangle'];
      
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 6 + Math.random() * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));
      
      setPieces(newPieces);

      const timeout = setTimeout(() => {
        setPieces([]);
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      setPieces([]);
    }
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.shape !== 'triangle' ? piece.color : 'transparent',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px',
            borderLeft: piece.shape === 'triangle' ? `${piece.size/2}px solid transparent` : undefined,
            borderRight: piece.shape === 'triangle' ? `${piece.size/2}px solid transparent` : undefined,
            borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : undefined,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
