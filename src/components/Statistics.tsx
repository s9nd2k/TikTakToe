import { getStats, getLeaderboard } from '../utils/storage';

interface StatisticsProps {
  username: string;
  isDark: boolean;
  onBack: () => void;
}

export default function Statistics({ username, isDark, onBack }: StatisticsProps) {
  const allStats = getStats();
  const userStats = allStats.find(s => s.username === username);
  const leaderboard = getLeaderboard();

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity || seconds === 0) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}м ${secs}с` : `${secs}с`;
  };

  const winRate = userStats && userStats.totalGames > 0
    ? Math.round((userStats.wins / userStats.totalGames) * 100)
    : 0;

  return (
    <div className={`min-h-screen p-4 md:p-8 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50'
    }`}>
      {/* Фоновые декорации */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-200/30'
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/30'
        }`}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Хедер */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-xl">📊</span>
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Статистика
            </h1>
          </div>
          <button
            onClick={onBack}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
              isDark ? 'glass-dark text-white hover:bg-white/10' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg'
            }`}
          >
            ← Назад к игре
          </button>
        </div>

        {/* Персональная статистика */}
        <div className={`rounded-2xl p-6 md:p-8 mb-6 animate-fade-in-up ${
          isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-100/50'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {username[0].toUpperCase()}
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {username}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ваша игровая статистика
              </p>
            </div>
          </div>

          {userStats ? (
            <>
              {/* Процент побед */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Процент побед
                  </span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {winRate}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${winRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Игр" value={userStats.totalGames} icon="🎮" gradient="from-blue-500 to-indigo-500" />
                <StatCard label="Побед" value={userStats.wins} icon="🏆" gradient="from-green-500 to-emerald-500" />
                <StatCard label="Поражений" value={userStats.losses} icon="💔" gradient="from-red-500 to-pink-500" />
                <StatCard label="Ничьих" value={userStats.draws} icon="🤝" gradient="from-yellow-500 to-orange-500" />
                <StatCard label="Общее время" value={formatTime(userStats.totalTime)} icon="⏱️" gradient="from-purple-500 to-violet-500" />
                <StatCard label="Лучшее время" value={formatTime(userStats.bestTime)} icon="⚡" gradient="from-amber-500 to-orange-500" />
              </div>
            </>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-lg font-medium">Вы ещё не играли</p>
              <p className="text-sm mt-1">Сыграйте первую игру, чтобы увидеть статистику!</p>
            </div>
          )}
        </div>

        {/* Таблица рекордов */}
        <div className={`rounded-2xl p-6 md:p-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
          <div className={`${isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-100/50'} rounded-2xl p-6 md:p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Таблица рекордов
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Топ-20 лучших результатов
                </p>
              </div>
            </div>

            {leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b-2 ${isDark ? 'border-gray-600/50' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>#</th>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Игрок</th>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Поле</th>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Время</th>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ходов</th>
                      <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((record, index) => (
                      <tr
                        key={index}
                        className={`border-b transition-colors ${
                          isDark ? 'border-gray-700/50 hover:bg-white/5' : 'border-gray-100 hover:bg-indigo-50/50'
                        } ${record.username === username ? (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50') : ''}`}
                      >
                        <td className="py-3 px-3">
                          <span className="text-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (
                              <span className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {index + 1}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              index < 3 
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {record.username[0].toUpperCase()}
                            </div>
                            <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                              {record.username}
                            </span>
                            {record.username === username && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                                вы
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {record.boardSize}×{record.boardSize}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-mono font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {formatTime(record.duration)}
                          </span>
                        </td>
                        <td className={`py-3 px-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {record.moves}
                        </td>
                        <td className={`py-3 px-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(record.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-5xl mb-3">🏅</div>
                <p className="text-lg font-medium">Пока нет рекордов</p>
                <p className="text-sm mt-1">Выиграйте первую игру, чтобы попасть в таблицу!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient }: { label: string; value: string | number; icon: string; gradient: string }) {
  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br ${gradient} text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-80 font-medium mt-0.5">{label}</div>
    </div>
  );
}
