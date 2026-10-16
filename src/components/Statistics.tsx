import { getStats, getLeaderboard, GameStats, GameRecord } from '../utils/storage';

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

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📊 Статистика</h1>
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800 shadow'
            }`}
          >
            ← Назад
          </button>
        </div>

        {/* Персональная статистика */}
        <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className="text-xl font-bold mb-4">👤 Ваша статистика ({username})</h2>
          {userStats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Игр" value={userStats.totalGames} isDark={isDark} color="blue" />
              <StatCard label="Побед" value={userStats.wins} isDark={isDark} color="green" />
              <StatCard label="Поражений" value={userStats.losses} isDark={isDark} color="red" />
              <StatCard label="Ничьих" value={userStats.draws} isDark={isDark} color="yellow" />
              <StatCard label="Общее время" value={formatTime(userStats.totalTime)} isDark={isDark} color="purple" />
              <StatCard label="Лучшее время" value={formatTime(userStats.bestTime)} isDark={isDark} color="orange" />
            </div>
          ) : (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Вы ещё не играли. Сыграйте первую игру!
            </p>
          )}
        </div>

        {/* Таблица рекордов */}
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className="text-xl font-bold mb-4">🏆 Таблица рекордов</h2>
          {leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-2">#</th>
                    <th className="text-left py-3 px-2">Игрок</th>
                    <th className="text-left py-3 px-2">Поле</th>
                    <th className="text-left py-3 px-2">Время</th>
                    <th className="text-left py-3 px-2">Ходов</th>
                    <th className="text-left py-3 px-2">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((record, index) => (
                    <tr
                      key={index}
                      className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                        record.username === username ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                      </td>
                      <td className="py-3 px-2 font-medium">{record.username}</td>
                      <td className="py-3 px-2">{record.boardSize}×{record.boardSize}</td>
                      <td className="py-3 px-2">{formatTime(record.duration)}</td>
                      <td className="py-3 px-2">{record.moves}</td>
                      <td className="py-3 px-2 text-sm">
                        {new Date(record.date).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Пока нет рекордов. Будьте первым!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isDark, color }: { label: string; value: string | number; isDark: boolean; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`rounded-lg p-4 bg-gradient-to-br ${colorClasses[color]} text-white shadow-md`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}
