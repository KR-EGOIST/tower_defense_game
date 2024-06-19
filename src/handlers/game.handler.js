import { InitGold } from '../models/gold.model.js';
import { setScore, getScore } from '../models/score.model.js';

// 게임 시작 시 작동하는 핸들러
export const gameStart = (uuid, payload) => {
  InitGold(uuid);
  return { status: 'success', handler: '11' };
};

// 게임 종료 시 작동하는 핸들러
export const gameEnd = async (uuid, payload) => {
  const currentScore = await getScore(payload);
  // 현재 점수가 DB의 점수보다 높으면 DB의 점수를 현재 점수로 업데이트
  if (currentScore < payload.score) {
    await setScore(payload);
  }

  return { status: 'success', handler: '12', highScore: payload.score };
};
