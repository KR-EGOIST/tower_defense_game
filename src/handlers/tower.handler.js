import { getGold, setGold } from '../models/gold.model.js';
import { getTowers, removeTower, setTower } from '../models/tower.model.js';

// 클라이언트 타워 vs 서버 타워 비교 함수
function compareTowers(currentTowers, gameTowers) {
  //길이가 다르면 차이가 있음

  if (currentTowers.length !== gameTowers.length) {
    return true;
  }

  // currentTower와 gameTower의 각 요소를 순회하며 비교
  for (let i = 0; i < currentTowers.length; i++) {
    const currentTower = currentTowers[i];
    const gameTowerPosition = gameTowers[i];

    //좌표를 비교
    if (
      currentTower.tower.X !== gameTowerPosition.x ||
      currentTower.tower.Y !== gameTowerPosition.y
    ) {
      return true; //차이가 있음
    }
  }

  return false; //차이가 없음
}

//서버에 타워를 추가한다
export const towerAddOnHandler = (userId, payload) => {
  // 유저의 현재 타워 정보
  const currentTowers = getTowers(userId);

  let userGold = getGold(userId);
  if (userGold === undefined) {
    return {
      status: 'fail',
      message: 'Not found User Gold',
    };
  }

  // 클라이언트의 타워 정보
  const gameTowers = payload.gameTowers;

  // 클라이언트 타워 vs 서버 타워 비교
  const hasDifference = compareTowers(currentTowers, gameTowers);
  if (hasDifference) {
    return {
      status: 'fail',
      message: 'There are differences between the client and server tower information',
    };
  }

  userGold += payload.gold;
  setGold(userId, userGold);

  setTower(userId, payload.X, payload.Y, payload.level);
  return {
    status: 'success',
    message: `Tower Update: ${payload.X}, ${payload.Y}`,
    handlerId: 5,
    gold: userGold,
  };
};

// 타워 업그레이드 핸들러
export const upgradeTowerHandler = (userId, payload) => {
  const towers = getTowers(userId);
  const index = towers.findIndex(
    (element) => element.tower.X === payload.X && element.tower.Y === payload.Y,
  );

  let userGold = getGold(userId);
  if (userGold === undefined) {
    return {
      status: 'fail',
      message: 'Not found User Gold',
    };
  }

  if (index === -1) {
    return { status: 'fail', message: 'Tower not found' };
  }

  userGold += payload.gold;
  setGold(userId, userGold);

  towers[index].level = payload.level;

  return { status: 'success', message: 'Tower upgrade successfully', handlerId: 5, gold: userGold };
};

// 타워를 환불합니다.
export const towerRemoveHandler = (userId, payload) => {
  const towers = getTowers(userId);
  const index = towers.findIndex(
    (element) => element.tower.X === payload.X && element.tower.Y === payload.Y,
  );

  let userGold = getGold(userId);
  if (userGold === undefined) {
    return {
      status: 'fail',
      message: 'Not found User Gold',
    };
  }

  if (index === -1) {
    return { status: 'fail', message: 'Tower not found' };
  }

  userGold += payload.gold;
  setGold(userId, userGold);

  removeTower(userId, index);

  return { status: 'success', message: 'Tower removed successfully', handlerId: 5, gold: userGold };
};
