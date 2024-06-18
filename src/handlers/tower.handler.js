import { addTower, getTowers, removeTower } from '../models/tower.model.js';
import { clearTower } from '../models/tower.model.js';

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

  addTower(userId, payload.X, payload.Y);
  return { status: 'success', message: `Tower Update: ${payload.X}, ${payload.Y}` };
};

//서버에 저장된 타워들을 전부 삭제한다.
export const towerClearHandler = () => {
  clearTower();
  return { status: 'success', message: 'Tower Clear' };
};

export const upgradeTower = (userId, payload) => {};

// 타워를 환불합니다.
export const towerRemoveHandler = (userId, payload) => {
  const { X, Y } = payload;
  const result = removeTower(userId, X, Y);

  if (result.status === 'success') {
    return { status: 'success', message: result.message };
  } else {
    return { status: 'error', message: result.message };
  }
};
