import { InitGold, getGold, setGold } from '../models/gold.model.js';

//골드의 변화를 업데이트한다
export const goldChangeHandler = (userId, payload) => {
  // 유저의 현재 골드 정보
  const currentGold = getGold(userId)[0].gold;

  // 클라이언트의 골드 정보
  const gameGold = payload.currentGold;

  // 클라이언트 골드 vs 서버 골드 비교
  const hasDifference = currentGold !== gameGold;
  if (hasDifference) {
    return {
      status: 'fail',
      message: 'There are differences between the client and server gold information',
    };
  }

  setGold(userId, payload.targetGold);
  return { status: 'success', message: `Gold Update: ${payload.targetGold}` };
};

//서버에 저장된 gold를 지우고, 현재 userId에 0원을 추가한다
export const InitGoldHandler = (userId) => {
  InitGold(userId);
  return { status: 'success', message: 'Gold Init' };
};
