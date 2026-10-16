import { useState, useEffect } from 'react';
import Login from './components/Login';
import Game from './components/Game';
import Statistics from './components/Statistics';
import { getCurrentUser, logoutUser } from './utils/storage';

type Screen = 'login' | 'game' | 'statistics';

function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [username, setUsername] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ttt_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUsername(user);
      setScreen('game');
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
    localStorage.setItem('ttt_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogin = (user: string) => {
    setUsername(user);
    setScreen('game');
  };

  const handleLogout = () => {
    logoutUser();
    setUsername(null);
    setScreen('login');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Кнопка переключения темы */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-12 active:scale-95 group ${
          isDark 
            ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 text-gray-900 shadow-yellow-500/40 hover:shadow-yellow-500/60' 
            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-yellow-300 shadow-indigo-500/40 hover:shadow-indigo-500/60'
        }`}
        title={isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема'}
      >
        <span className="text-2xl transition-transform duration-500 group-hover:rotate-180">
          {isDark ? '☀️' : '🌙'}
        </span>
      </button>

      {screen === 'login' && (
        <Login onLogin={handleLogin} isDark={isDark} />
      )}

      {screen === 'game' && username && (
        <Game
          username={username}
          isDark={isDark}
          onShowStats={() => setScreen('statistics')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'statistics' && username && (
        <Statistics
          username={username}
          isDark={isDark}
          onBack={() => setScreen('game')}
        />
      )}
    </div>
  );
}

export default App;
