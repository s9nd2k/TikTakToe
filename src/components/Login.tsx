import { useState } from 'react';
import { findUser, saveUser, setCurrentUser } from '../utils/storage';
import { playClickSound as sndClick, playErrorSound as sndError } from '../utils/sounds';
import AnimatedBg from './AnimatedBg';

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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    setTimeout(() => {
      if (isRegister) {
        const existing = findUser(username);
        if (existing) {
          setError('Пользователь уже существует');
          sndError();
          setIsLoading(false);
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
          setIsLoading(false);
          return;
        }
        setCurrentUser(username);
        sndClick();
        onLogin(username);
      }
    }, 600);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isDark ? 'mesh-gradient-dark' : 'mesh-gradient-light'
    }`}>
      <AnimatedBg isDark={isDark} />

      <div className="w-full max-w-md relative z-10">
        {/* Карточка */}
        <div className={`rounded-3xl p-8 md:p-10 animate-scale-in ${
          isDark 
            ? 'glass-dark shadow-2xl shadow-indigo-500/20' 
            : 'glass-light shadow-2xl shadow-indigo-200/50'
        }`}>
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-gradient">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-2xl font-black text-white animate-bounce-in" style={{ animationDelay: '0.2s' }}>✕</span>
                  <span className="text-2xl font-black text-white/60 animate-bounce-in" style={{ animationDelay: '0.4s' }}>○</span>
                  <span className="text-2xl font-black text-white/60 animate-bounce-in" style={{ animationDelay: '0.6s' }}>○</span>
                  <span className="text-2xl font-black text-white animate-bounce-in" style={{ animationDelay: '0.8s' }}>✕</span>
                </div>
              </div>
            </div>
            
            <h1 className={`mt-6 text-3xl md:text-4xl font-black font-game bg-gradient-to-r ${
              isDark ? 'from-indigo-300 via-purple-300 to-pink-300' : 'from-indigo-600 via-purple-600 to-pink-600'
            } bg-clip-text text-transparent animate-gradient`}>
              КРЕСТИКИ-НОЛИКИ
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isRegister ? 'Создайте свой аккаунт' : 'Добро пожаловать обратно!'}
            </p>
          </div>

          {/* Табы */}
          <div className={`flex rounded-2xl p-1.5 mb-6 ${isDark ? 'bg-black/30' : 'bg-gray-100/80'}`}>
            <button
              onClick={() => { setIsRegister(false); setError(''); sndClick(); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${
                !isRegister
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🚀 Вход
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); sndClick(); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${
                isRegister
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ✨ Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                👤 Логин
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-5 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isDark 
                      ? 'bg-black/30 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                      : 'bg-white/60 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  placeholder="Введите логин"
                />
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none ${
                  isDark ? 'neon-blue' : ''
                }`}></div>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                🔒 Пароль
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-3.5 pr-14 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isDark 
                      ? 'bg-black/30 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20' 
                      : 'bg-white/60 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up backdrop-blur-sm">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] btn-shine ${
                isLoading ? 'opacity-70 cursor-wait' : ''
              } ${
                isRegister
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-purple-500/40 hover:shadow-purple-500/60 animate-gradient'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-indigo-500/40 hover:shadow-indigo-500/60 animate-gradient'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Загрузка...
                </span>
              ) : (
                <span className="text-lg">{isRegister ? '✨ Создать аккаунт' : '🚀 Войти в игру'}</span>
              )}
            </button>
          </form>

          {/* Декоративная нижняя часть */}
          <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200/50'}`}>
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span>Онлайн</span>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>•</div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
