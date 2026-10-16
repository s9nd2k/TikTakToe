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

  if (screen === 'login') {
    return (
      <>
        <Login onLogin={handleLogin} isDark={isDark} />
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </>
    );
  }

  if (!username) return null;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Кнопка переключения темы */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
          isDark ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
        }`}
        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {screen === 'game' && (
        <Game
          username={username}
          isDark={isDark}
          onShowStats={() => setScreen('statistics')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'statistics' && (
        <Statistics
          username={username}
          isDark={isDark}
          onBack={() => setScreen('game')}
        />
      )}
    </div>
  );
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
        isDark ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
      }`}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

export default App;
