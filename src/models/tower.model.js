const towers = []; //모든 유저의 타워 목록
//tower = {userId: 유저아이디, tower: {x좌표, y좌표}}

//전체 타워 삭제
export const clearTower = () => {
  towers.length = 0;
};

//유저 정보와 타워의 좌표를 저장한다
export const addTower = (userId, coordinateX, coordinateY) => {
  towers.push({ userId, tower: { X: coordinateX, Y: coordinateY } });
};

//해당하는 유저의 모든 타워를 반환한다
export const getTowers = (userId) => {
  return towers.filter((tower) => tower.userId === userId);
};

// 유저 정보와 타워의 자표를 가지고 index에서 제거합니다.
export const removeTower = (userId, coordinateX, coordinateY) => {
  const index = towers.findIndex(
    (tower) =>
      tower.userId === userId && tower.tower.X === coordinateX && tower.tower.Y === coordinateY,
  );
  if (index === -1) {
    return { status: 'error', message: 'Tower not found' };
  }

  towers.splice(index, 1);
  return { status: 'success', message: 'Tower removed successfully' };
};
