import { monsterKillHandler } from './monster.handler.js';
import { towerAddOnHandler } from './towerAddOn.handler.js';
import { towerClearHandler } from './towerClear.handler.js';
import { towerRemoveHandler } from './towerRemove.handler.js';
import { checkTowerLocation, towerAddOnHandler, towerClearHandler } from './tower.handler.js';
import { gameStart, gameEnd } from './game.handler.js';

const handlerMappings = {
  // 1: 함수 이름,
  // 이런 식으로 사용하시면 됩니다.
  21: monsterKillHandler,
  2: towerClearHandler,
  3: towerAddOnHandler,
  4: checkTowerLocation,
  5: towerRemoveHandler,
  11: gameStart,
  12: gameEnd,
};

export default handlerMappings;
