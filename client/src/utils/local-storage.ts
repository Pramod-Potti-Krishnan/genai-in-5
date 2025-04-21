import { User } from "@/types";

// User storage
export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem('microlearn-user');
  return userJson ? JSON.parse(userJson) : null;
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem('microlearn-user', JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem('microlearn-user');
};

// Progress storage
export const getStoredProgress = () => {
  const progressJson = localStorage.getItem('microlearn-progress');
  return progressJson ? JSON.parse(progressJson) : null;
};

export const setStoredProgress = (progress: any): void => {
  localStorage.setItem('microlearn-progress', JSON.stringify(progress));
};

export const clearStoredProgress = (): void => {
  localStorage.removeItem('microlearn-progress');
};

// Audio position storage
export const saveAudioPosition = (audibleId: string, position: number): void => {
  const positions = getAudioPositions();
  positions[audibleId] = position;
  localStorage.setItem('microlearn-audio-positions', JSON.stringify(positions));
};

export const getAudioPosition = (audibleId: string): number => {
  const positions = getAudioPositions();
  return positions[audibleId] || 0;
};

export const getAudioPositions = (): Record<string, number> => {
  const positionsJson = localStorage.getItem('microlearn-audio-positions');
  return positionsJson ? JSON.parse(positionsJson) : {};
};
