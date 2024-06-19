const towers = []; //모든 유저의 타워 목록
//tower = {userId: 유저아이디, tower: {x좌표, y좌표}}

//유저 정보와 타워의 좌표를 저장한다
export const addTower = (userId, coordinateX, coordinateY, level) => {
  towers.push({ userId, tower: { X: coordinateX, Y: coordinateY }, level: level });
};

//해당하는 유저의 모든 타워를 반환한다
export const getTowers = (userId) => {
  return towers.filter((tower) => tower.userId === userId);
};

export const getTowerIndex = (userId, coordinateX, coordinateY) => {
  const index = towers.findIndex(
    (element) =>
      element.userId === userId &&
      element.tower.X === coordinateX &&
      element.tower.Y === coordinateY,
  );
  return index;
};

// 유저 정보와 타워의 자표를 가지고 index에서 제거합니다.
export const removeTower = (index) => {
  towers.splice(index, 1);
};
