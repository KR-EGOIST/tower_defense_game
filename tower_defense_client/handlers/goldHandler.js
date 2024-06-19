import { setUserGold } from '../src/game.js';

// 서버에서 받아온 유저 골드 클라이언트에 업데이트 핸들러
export const updateUserGoldHandler = (payload) => {
  setUserGold(payload.gold);
};
