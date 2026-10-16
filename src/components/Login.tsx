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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Крестики-Нолики
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isRegister ? 'Регистрация' : 'Вход в систему'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500'
              }`}
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500'
              }`}
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); sndClick(); }}
            className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
          >
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>
      </div>
    </div>
  );
}
