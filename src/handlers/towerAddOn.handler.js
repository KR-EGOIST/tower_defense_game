import { addTower } from "../models/tower.model.js";

export const towerAddOnHandler = (userId, payload) => {
  addTower(userId, payload.X, payload.Y);
  return { status: 'success', message: `Tower Update: ${payload.X}, ${payload.Y}`};
};
