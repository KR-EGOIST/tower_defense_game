import { addTower, getTowers } from '../models/tower.model.js';

// 클라이언트 타워 vs 서버 타워 비교 함수
function compareTowers(currentTowers, gameTowers) {
  //길이가 다르면 차이가 있음
  if (currentTowers.length !== gameTowers.length) {
    return true;
  }

  // currentTower와 gameTower의 각 요소를 순회하며 비교
  for (let i = 0; i < currentTowers.length; i++) {
    const currentTower = currentTowers[i];
    const gameTower = gameTowers[i];

    //좌표를 비교
    if (currentTower.tower.X !== gameTower.tower.X || currentTower.tower.Y !== gameTower.tower.Y) {
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
    return { status: 'fail', message: 'There are differences between the client and server tower information'};
  }

  addTower(userId, payload.X, payload.Y);
  return { status: 'success', message: `Tower Update: ${payload.X}, ${payload.Y}` };
};
