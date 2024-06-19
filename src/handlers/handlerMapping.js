import { monsterKillHandler } from './monster.handler.js';
import { towerAddOnHandler, towerRemoveHandler, upgradeTowerHandler } from './tower.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { goldChangeHandler } from './gold.handler.js';

const handlerMappings = {
  3: towerAddOnHandler,
  4: upgradeTowerHandler,
  5: towerRemoveHandler,
  6: goldChangeHandler,
  11: gameStart,
  12: gameEnd,
  21: monsterKillHandler,
};

export default handlerMappings;
