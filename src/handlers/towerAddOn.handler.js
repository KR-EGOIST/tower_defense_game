import { addTower, getTowers } from "../models/tower.model.js";

//서버에 타워를 추가한다
export const towerAddOnHandler = (userId, payload) => {
  // 유저의 현재 타워 정보
  let currentTowers = getTowers(userId);

  // 클라이언트 vs 서버 비교

  addTower(userId, payload.X, payload.Y);
  return { status: 'success', message: `Tower Update: ${payload.X}, ${payload.Y}`};
};
