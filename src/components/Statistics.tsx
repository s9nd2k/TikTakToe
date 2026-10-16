import { getStats, getLeaderboard } from '../utils/storage';
import AnimatedBg from './AnimatedBg';

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
      isDark ? 'mesh-gradient-dark' : 'mesh-gradient-light'
    }`}>
      <AnimatedBg isDark={isDark} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Хедер */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-md opacity-50"></div>
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-xl animate-gradient">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black font-game bg-gradient-to-r ${
                isDark ? 'from-amber-300 to-orange-300' : 'from-amber-600 to-orange-600'
              } bg-clip-text text-transparent`}>
                СТАТИСТИКА
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ваша игровая аналитика
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 btn-shine ${
              isDark ? 'glass-dark text-white hover:bg-white/10 border border-white/10' : 'glass-light text-gray-700 hover:bg-white border border-gray-200'
            }`}
          >
            ← Назад
          </button>
        </div>

        {/* Персональная статистика */}
        <div className={`rounded-3xl p-6 md:p-8 mb-6 animate-fade-in-up ${
          isDark ? 'glass-dark' : 'glass-light shadow-xl shadow-indigo-100/50'
        }`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl blur-md opacity-50"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-xl animate-gradient">
                {username[0].toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>
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
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    🏆 Процент побед
                  </span>
                  <span className={`text-2xl font-black font-game ${
                    winRate >= 70 ? 'text-green-400' : winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {winRate}%
                  </span>
                </div>
                <div className={`w-full h-4 rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      winRate >= 70 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : winRate >= 40 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${winRate}%` }}
                  >
                    <div className="h-full w-full animate-shimmer"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Игр" value={userStats.totalGames} icon="🎮" gradient="from-blue-500 to-indigo-600" />
                <StatCard label="Побед" value={userStats.wins} icon="🏆" gradient="from-green-500 to-emerald-600" />
                <StatCard label="Поражений" value={userStats.losses} icon="💔" gradient="from-red-500 to-pink-600" />
                <StatCard label="Ничьих" value={userStats.draws} icon="🤝" gradient="from-yellow-500 to-amber-600" />
                <StatCard label="Время" value={formatTime(userStats.totalTime)} icon="⏱️" gradient="from-purple-500 to-violet-600" />
                <StatCard label="Рекорд" value={formatTime(userStats.bestTime)} icon="⚡" gradient="from-orange-500 to-red-600" />
              </div>
            </>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4 animate-float">🎯</div>
              <p className="text-xl font-bold">Вы ещё не играли</p>
              <p className="text-sm mt-2">Сыграйте первую игру, чтобы увидеть статистику!</p>
            </div>
          )}
        </div>

        {/* Таблица рекордов */}
        <div className={`rounded-3xl p-6 md:p-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
          <div className={`${isDark ? 'glass-dark' : 'glass-light shadow-xl shadow-indigo-100/50'} rounded-3xl p-6 md:p-8`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl blur-md opacity-50"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl animate-gradient">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <div>
                <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Таблица рекордов
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Топ-20 лучших результатов по времени
                </p>
              </div>
            </div>

            {leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>#</th>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Игрок</th>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Поле</th>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Время</th>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ходов</th>
                      <th className={`text-left py-4 px-3 text-xs font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((record, index) => (
                      <tr
                        key={index}
                        className={`border-b transition-all duration-300 ${
                          isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-indigo-50/50'
                        } ${record.username === username ? (isDark ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'bg-indigo-50 border-l-4 border-l-indigo-500') : ''}`}
                      >
                        <td className="py-4 px-3">
                          {index < 3 ? (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-400/30' :
                              'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                            }`}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </div>
                          ) : (
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                              isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {index + 1}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                              index < 3 
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' 
                                : isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {record.username[0].toUpperCase()}
                            </div>
                            <div>
                              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {record.username}
                              </span>
                              {record.username === username && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                                  вы
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {record.boardSize}×{record.boardSize}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`font-mono font-black text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {formatTime(record.duration)}
                          </span>
                        </td>
                        <td className={`py-4 px-3 font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {record.moves}
                        </td>
                        <td className={`py-4 px-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(record.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-6xl mb-4 animate-float">🏅</div>
                <p className="text-xl font-bold">Пока нет рекордов</p>
                <p className="text-sm mt-2">Выиграйте первую игру, чтобы попасть в таблицу!</p>
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
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${gradient} text-white shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xs">→</span>
          </div>
        </div>
        <div className="text-2xl font-black font-game">{value}</div>
        <div className="text-xs opacity-80 font-bold mt-1">{label}</div>
      </div>
    </div>
  );
}
