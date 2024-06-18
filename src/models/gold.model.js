const golds = []; //모든 유저의 골드
//gold = {userId: 유저아이디, gold: 현재 골드}

// 골드 초기화
export const InitGold = (userId) => {
    golds.length = 0;
    setGold(userId, 0);
};

//유저 정보와 현재 골드를 저장한다
export const setGold = (userId, gold) => {
  // 기존 유저를 찾기
  const userIndex = golds.findIndex((user) => user.userId === userId);

  if (userIndex != -1) {
    // 유저가 존재하면 gold 값을 업데이트
    golds[userIndex].gold = gold;
  } else {
    // 유저가 존재하지 않으면 객체를 추가
    golds.push({ userId, gold });
  }
};

//해당하는 유저의 골드를 반환한다
export const getGold = (userId) => {
  return golds.filter((gold) => gold.userId === userId);
};
