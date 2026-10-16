interface AnimatedBgProps {
  isDark: boolean;
}

export default function AnimatedBg({ isDark }: AnimatedBgProps) {
  const symbols = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    symbol: i % 2 === 0 ? '✕' : '○',
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 30 + Math.random() * 60,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 10,
    opacity: isDark ? 0.03 + Math.random() * 0.05 : 0.04 + Math.random() * 0.06,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Большие блобы */}
      <div 
        className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl animate-morph ${
          isDark ? 'bg-indigo-600/15' : 'bg-indigo-300/25'
        }`}
        style={{ animationDelay: '0s' }}
      />
      <div 
        className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-3xl animate-morph ${
          isDark ? 'bg-purple-600/15' : 'bg-purple-300/25'
        }`}
        style={{ animationDelay: '2s' }}
      />
      <div 
        className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl animate-morph ${
          isDark ? 'bg-pink-600/10' : 'bg-pink-300/15'
        }`}
        style={{ animationDelay: '4s' }}
      />
      <div 
        className={`absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl animate-morph ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-300/15'
        }`}
        style={{ animationDelay: '3s' }}
      />

      {/* Вращающиеся кольца */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`w-[800px] h-[800px] rounded-full border animate-rotate-slow ${
            isDark ? 'border-indigo-500/5' : 'border-indigo-300/20'
          }`}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`w-[600px] h-[600px] rounded-full border animate-rotate-reverse ${
            isDark ? 'border-purple-500/5' : 'border-purple-300/20'
          }`}
        />
      </div>

      {/* Плавающие символы */}
      {symbols.map((s) => (
        <div
          key={s.id}
          className={`absolute font-bold animate-float-slow select-none ${
            isDark ? 'text-white' : 'text-indigo-600'
          }`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.symbol}
        </div>
      ))}

      {/* Сетка */}
      <div 
        className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(99,102,241,0.5)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(99,102,241,0.5)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
