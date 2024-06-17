const towers = [];

export const clearTower = () => {
    towers.length = 0;
    
};

export const addTower = (userId, coordinateX, coordinateY) => {
    towers.push({userId, tower: {X: coordinateX, Y: coordinateY}});
};

export const getTowers = (userId) => {
    return towers.filter(tower => tower.userId === userId);
};