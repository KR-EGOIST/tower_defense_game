const towers = [];

export const clearTower = () => {
  towers.length = 0;
};

export const addTower = (userId, coordinateX, coordinateY) => {
  towers.push({ userId, tower: { X: coordinateX, Y: coordinateY } });
};

export const getTowers = (userId) => {
  return towers.filter((tower) => tower.userId === userId);
};

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
