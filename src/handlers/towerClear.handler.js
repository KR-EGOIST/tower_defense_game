import { clearTower } from '../models/tower.model.js';

//서버에 저장된 타워들을 전부 삭제한다.
export const towerClearHandler = () => {
  clearTower();
  return { status: 'success', message: 'Tower Clear' };
};
