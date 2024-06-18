import { prisma } from '../utils/prisma/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

// 유저의 점수를 업데이트
export const setScore = async (user) => {
  const userData = await authMiddleware(user.token);
  const { userId } = userData;
  await prisma.users.update({
    where: { userId: userId },
    data: {
      score: user.score,
    },
  });
};

// 유저의 점수를 가져옴
export const getScore = async (user) => {
  const userData = await authMiddleware(user.token);
  const { userId } = userData;
  const score = await prisma.users.findFirst({
    where: { userId: userId },
    select: {
      score: true,
    },
  });
  return score.score;
};
