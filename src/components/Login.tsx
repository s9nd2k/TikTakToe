import { useState } from 'react';
import { findUser, saveUser, setCurrentUser } from '../utils/storage';
import { playClickSound as sndClick, playErrorSound as sndError } from '../utils/sounds';

interface LoginProps {
  onLogin: (username: string) => void;
  isDark: boolean;
}

export default function Login({ onLogin, isDark }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
      sndError();
      return;
    }

    if (username.trim().length < 3) {
      setError('Логин должен содержать минимум 3 символа');
      sndError();
      return;
    }

    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      sndError();
      return;
    }

    if (isRegister) {
      const existing = findUser(username);
      if (existing) {
        setError('Пользователь уже существует');
        sndError();
        return;
      }
      saveUser({ username, password, createdAt: new Date().toISOString() });
      setCurrentUser(username);
      sndClick();
      onLogin(username);
    } else {
      const user = findUser(username);
      if (!user || user.password !== password) {
        setError('Неверный логин или пароль');
        sndError();
        return;
      }
      setCurrentUser(username);
      sndClick();
      onLogin(username);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100'
    }`}>
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${
          isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
        }`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDark ? 'bg-purple-600/20' : 'bg-purple-300/30'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl animate-float ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-300/20'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Плавающие символы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[15%] left-[10%] text-6xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>✕</span>
        <span className="absolute top-[25%] right-[15%] text-7xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>○</span>
        <span className="absolute bottom-[20%] left-[20%] text-5xl opacity-10 animate-float" style={{ animationDelay: '2.5s' }}>✕</span>
        <span className="absolute bottom-[30%] right-[25%] text-6xl opacity-10 animate-float" style={{ animationDelay: '0.8s' }}>○</span>
      </div>

      <div className={`w-full max-w-md relative z-10 animate-fade-in-up`}>
        <div className={`rounded-3xl p-8 md:p-10 ${
          isDark 
            ? 'glass-dark shadow-2xl shadow-indigo-500/10' 
            : 'bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-200/50'
        }`}>
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4 animate-bounce-in">
              <span className="text-4xl">🎮</span>
            </div>
            <h1 className={`text-3xl font-extrabold bg-gradient-to-r ${
              isDark ? 'from-indigo-300 to-purple-300' : 'from-indigo-600 to-purple-600'
            } bg-clip-text text-transparent`}>
              Крестики-Нолики
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isRegister ? 'Создайте новый аккаунт' : 'Войдите в свой аккаунт'}
            </p>
          </div>

          {/* Табы */}
          <div className={`flex rounded-xl p-1 mb-6 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <button
              onClick={() => { setIsRegister(false); setError(''); sndClick(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isRegister
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); sndClick(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isRegister
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                👤 Логин
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                placeholder="Введите логин"
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                🔒 Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] animate-gradient"
            >
              {isRegister ? '✨ Создать аккаунт' : '🚀 Войти'}
            </button>
          </form>

          {/* Декоративная нижняя часть */}
          <div className="mt-6 pt-6 border-t border-dashed border-gray-300/20">
            <p className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Играйте в крестики-нолики с друзьями 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
