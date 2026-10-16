export interface User {
  username: string;
  password: string;
  createdAt: string;
}

export interface GameRecord {
  username: string;
  boardSize: number;
  winner: string;
  duration: number; // в секундах
  date: string;
  moves: number;
}

export interface GameStats {
  username: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  totalTime: number; // в секундах
  bestTime: number; // лучшее время победы в секундах
}

const USERS_KEY = 'ttt_users';
const RECORDS_KEY = 'ttt_records';
const STATS_KEY = 'ttt_stats';
const CURRENT_USER_KEY = 'ttt_current_user';

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUser(username: string): User | undefined {
  return getUsers().find(u => u.username === username);
}

export function setCurrentUser(username: string): void {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getRecords(): GameRecord[] {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addRecord(record: GameRecord): void {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getStats(): GameStats[] {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : [];
}

export function updateStats(username: string, won: boolean, draw: boolean, duration: number): void {
  const stats = getStats();
  let userStats = stats.find(s => s.username === username);
  
  if (!userStats) {
    userStats = {
      username,
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalTime: 0,
      bestTime: Infinity,
    };
    stats.push(userStats);
  }

  userStats.totalGames++;
  userStats.totalTime += duration;
  
  if (won) {
    userStats.wins++;
    if (duration < userStats.bestTime) {
      userStats.bestTime = duration;
    }
  } else if (draw) {
    userStats.draws++;
  } else {
    userStats.losses++;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getLeaderboard(): GameRecord[] {
  return getRecords()
    .filter(r => r.winner !== 'Ничья')
    .sort((a, b) => a.duration - b.duration)
    .slice(0, 20);
}
