import { monsterKillHandler } from './monster.handler.js';

const handlerMappings = {
  // 1: 함수 이름,
  // 이런 식으로 사용하시면 됩니다.
  21: monsterKillHandler,
};

export default handlerMappings;
