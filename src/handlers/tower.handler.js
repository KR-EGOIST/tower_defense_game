import { addTower, getTowers } from '../models/tower.model.js';
import { clearTower } from '../models/tower.model.js';

export const checkTowerLocation = (userId, payload) => {
  const towers = getTowers(userId);
  if (!towers) {
    return { status: 'fail', message: 'Not found towers' };
  }

  console.log(towers);

  towers.forEach((element) => {
    if (
      element.tower.X < payload.X ||
      (element.tower.X + 80 > payload.X && element.tower.Y < payload.Y) ||
      element.tower.Y + 170 > payload.Y
    ) {
      console.log('tttttt');
    }
  });

  return { status: 'success' };
};
