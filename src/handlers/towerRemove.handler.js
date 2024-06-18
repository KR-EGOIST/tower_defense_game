import { removeTower } from '../models/tower.model.js';

export const towerRemoveHandler = (userId, payload) => {
  const { X, Y } = payload;
  const result = removeTower(userId, X, Y);

  if (result.status === 'success') {
    return { status: 'success', message: result.message, goldRefunded: 600 }; // 예시로 골드 환불 추가
  } else {
    return { status: 'error', message: result.message };
  }
};
