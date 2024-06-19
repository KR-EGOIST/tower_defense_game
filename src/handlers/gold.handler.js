import { getGold, setGold } from '../models/gold.model.js';

//골드의 변화를 업데이트한다
export const goldChangeHandler = (userId, payload) => {
  let userGold = getGold(userId);
  if (userGold === undefined) {
    return {
      status: 'fail',
      message: 'Not found User Gold',
    };
  }

  const plusGold = payload.gold;

  userGold += plusGold;
  setGold(userId, userGold);

  return {
    status: 'success',
    message: `Gold Update: ${payload.gold}`,
    handlerId: 5,
    gold: userGold,
  };
};
