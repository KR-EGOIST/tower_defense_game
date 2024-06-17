import { clearTower } from '../models/tower.model.js';

export const towerClearHandler = () => {
  clearTower();
  return { status: 'success', message: 'Tower Clear' };
};
