import handlerMappings from './handlerMapping.js';

export const handleResponse = (data) => {
  if (data.status === 'fail') {
    console.log(data);
    return;
  }
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    return;
  }
  // 적절한 핸들러 호출
  handler(data);
};
