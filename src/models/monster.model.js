const monsters = {};

export const createMonsters = (uuid) => {
  monsters[uuid] = [];
};

export const getMonsters = (uuid) => {
  return monsters[uuid];
};

export const setMonster = (uuid, id) => {
  return monsters[uuid].push({ id });
};

export const clearMonsters = (uuid) => {
  return (monsters[uuid] = []);
};
