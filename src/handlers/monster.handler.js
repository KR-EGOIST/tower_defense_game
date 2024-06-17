import { setMonster } from '../models/monster.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKillHandler = (uuid, payload) => {
  //setMonster();
  return { status: 'success' };
};
