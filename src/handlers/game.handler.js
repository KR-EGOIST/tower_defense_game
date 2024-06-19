import { InitGold } from '../models/gold.model.js';
import { clearMonsters, getMonsters } from '../models/monster.model.js';
import { setScore, getScore } from '../models/score.model.js';
import { clearTower } from '../models/tower.model.js';

// 게임 시작 시 작동하는 핸들러
export const gameStart = (uuid, payload) => {
  InitGold(uuid);
  clearMonsters(uuid);
  clearTower();
  return { status: 'success', message: 'Game Start' };
};

// 게임 종료 시 작동하는 핸들러
export const gameEnd = async (uuid, payload) => {
  const userMonsters = getMonsters(uuid);

  if (!userMonsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  let verificationScore = 0;
  for (let i = 0; i < userMonsters.length; i++) {
    verificationScore += 100;
  }
  if (verificationScore !== payload.score) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  const currentScore = await getScore(payload);
  // 현재 점수가 DB의 점수보다 높으면 DB의 점수를 현재 점수로 업데이트
  if (currentScore < payload.score) {
    await setScore(payload);
  }

  return { status: 'success', message: 'Game End' };
};
