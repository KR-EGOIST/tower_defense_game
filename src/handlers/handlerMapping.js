import { monsterKillHandler } from './monster.handler.js';
import {
  towerAddOnHandler,
  towerClearHandler,
  towerRemoveHandler,
  upgradeTower,
} from './tower.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { InitGoldHandler, goldChangeHandler } from './gold.handler.js';

const handlerMappings = {
  // 1: 함수 이름,
  // 이런 식으로 사용하시면 됩니다.
  21: monsterKillHandler,
  2: towerClearHandler,
  3: towerAddOnHandler,
  4: upgradeTower,
  5: towerRemoveHandler,
  6: goldChangeHandler,
  7: InitGoldHandler,
  11: gameStart,
  12: gameEnd,
};

export default handlerMappings;
