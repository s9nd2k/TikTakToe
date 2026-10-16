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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Кнопка переключения темы */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 transform hover:scale-110 hover:rotate-12 ${
          isDark 
            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 shadow-yellow-500/30' 
            : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-yellow-300 shadow-indigo-500/30'
        }`}
        title={isDark ? 'Светлая тема ☀️' : 'Тёмная тема 🌙'}
      >
        <span className="text-xl transition-transform duration-500">
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
