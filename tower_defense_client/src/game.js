import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { CLIENT_VERSION } from './Constants.js';
import { handleResponse } from '../handlers/helper.js';

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 로그인 아이디를 로컬스토리지에서 가져온다.
let id = localStorage.getItem('userId');
// uuid를 저장할 userId 변수
let userId;

const NUM_OF_MONSTERS = 6; // 몬스터 개수
const NUM_OF_TOWERS = 4; // 타워 업그레이드 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 50; // 기지 체력

let towerCost = 600; // 타워 구입 비용
let numOfInitialTowers = 3; // 초기 타워 개수
let towerMaxLevel = 3; // 타워 최대 레벨

let monsterLevel = 0; // 몬스터 레벨
let monsterSpawnInterval = 5000; // 몬스터 생성 주기
let intervalId = null;
let goldGoblinintervalId = null;
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;
let isPlay = true;
let isRefundMode = false; // 타워 환불 모드(기본off)

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImages = [];
for (let i = 1; i <= NUM_OF_TOWERS; i++) {
  const img = new Image();
  img.src = `images/tower${i}.png`;
  towerImages.push(img);
}

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

let monsterPath;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeInitialTowers() {
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);

    //타워가 생성될 때, 좌표를 서버에 저장한다. 타워가 생성되기 전에 검증한다.
    sendEvent(3, { X: x, Y: y, gameTowers: towers, level: 0, gold: 0 });

    const tower = new Tower(x, y, towerCost, towerImages[0]);
    towers.push(tower);
    tower.draw(ctx);
  }
}

// 타워 구입
function placeNewTower() {
  /* 
    타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
    빠진 코드들을 채워넣어주세요! 
  */
  // 유저가 가진 골드가 타워 금액(600원)보다 크거나 같다면 유저골드 차감 후 타워구매
  if (userGold >= towerCost) {
    const { x, y } = getRandomPositionNearPath(200);

    //타워가 생성될 때, 좌표를 서버에 저장한다. 타워가 생성되기 전에 검증한다.
    sendEvent(3, { X: x, Y: y, gameTowers: towers, level: 0, gold: -towerCost });

    const tower = new Tower(x, y, towerCost, towerImages[0]);
    towers.push(tower);
    tower.draw(ctx);
    console.log(`타워 위치: X=${tower.x}, Y=${tower.y}`);
  } else {
    alert(`타워 구매비용은 ${towerCost}원 입니다`);
  }
}

// 타워 환불 모드
function toggleRefundMode() {
  isRefundMode = !isRefundMode;
  alert(isRefundMode ? '타워 환불 모드 활성화' : '타워 환불 모드 비활성화');
}

//타워 클릭 이벤트
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const refundRangeX = 35;
  const refundRangeY = 75;
  const toleranceY = 10;

  for (let i = 0; i < towers.length; i++) {
    const tower = towers[i];

    const towerCenterX = tower.x + tower.width / 2;
    const towerCenterY = tower.y + tower.height / 2;

    const deltaX = Math.abs(towerCenterX - clickX);
    const deltaY = Math.abs(towerCenterY - clickY);

    if (deltaX <= refundRangeX && deltaY <= refundRangeY + toleranceY) {
      // 타워가 있는 곳을 클릭했다면
      if (isRefundMode) {
        // 환불 모드일 때
        sendEvent(5, { X: tower.x, Y: tower.y, gold: towerCost });

        towers.splice(i, 1);
        i--;

        isRefundMode = false;
        break;
      } else {
        // 환불모드가 아닐 때 업그레이드 창 띄우기
        if (tower.getTowerLevel() < towerMaxLevel) {
          // 타워 레벨이 최고 레벨이 아니면
          const upgrade = confirm('타워를 업그레이드 하시겠습니까?');
          if (upgrade) {
            if (userGold >= 100) {
              const towerLevel = tower.getTowerLevel();
              tower.setTowerLevel(towerLevel + 1, towerImages[towerLevel + 1]);
              sendEvent(4, { X: tower.x, Y: tower.y, level: towerLevel + 1, gold: -100 });
            } else {
              alert(`타워 업그레이드 비용은 100Gold 입니다`);
            }
          }
        } else {
          alert('타워가 최고 레벨입니다.');
        }
      }
    }
  }
});

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  const imageIndex = Math.floor(Math.random() * (monsterImages.length - 1));
  monsters.push(new Monster(monsterPath, monsterImages, imageIndex, monsterLevel));
}

function spawnGoldGoblin() {
  monsters.push(new Monster(monsterPath, monsterImages, 5, monsterLevel));
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        sendEvent(12, { score: score, token: getCookieValue('authorization') });
        isPlay = false;
        requestAnimationFrame(gameLoop);

        setTimeout(function () {
          alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
          location.reload();
        }, 1000);
      }
      monster.draw(ctx);
    } else if (monster.hp === -1000) {
      // 몬스터가 기지를 공격한 후
      monsters.splice(i, 1);
    } else {
      /* 몬스터가 타워에 죽었을 때 */
      monsters.splice(i, 1);

      if (monster.getMonsterId() === 5) {
        sendEvent(6, { gold: 500 });
      } else {
        score += 2000;
        sendEvent(21, { monsterId: monster.getMonsterId() });
      }

      if (score % 2000 === 0) {
        monsterLevel += 1;

        sendEvent(6, { gold: 1000 });

        //setInterval(spawnMonster, monsterSpawnInterval);
        if (monsterSpawnInterval !== 1000) {
          monsterSpawnInterval -= 500;
          startSpawning();
        }
      }
    }
  }

  if (isPlay) {
    requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
  }
}

function initGame() {
  if (isInitGame) {
    return;
  }
  sendEvent(11, {});
  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

  startGoldGoblinSpawning(); //황금 고블린 생성
  startSpawning(); // 몬스터 생성 시작
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

function getCookieValue(name) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`);
  const match = document.cookie.match(regex);
  if (match) {
    return match[2];
  }
}
// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
  ...towerImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  serverSocket = io('http://localhost:8080', {
    query: {
      clientVersion: CLIENT_VERSION,
      id: id,
      token: getCookieValue('authorization'),
    },
  });

  serverSocket.on('response', (data) => {
    handleResponse(data);
  });

  serverSocket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
    highScore = data.highScore;
    if (!isInitGame) {
      initGame();
    }
  });
});

//몬스터의 스폰주기 설정
function startSpawning() {
  // 기존 interval이 있다면 중지
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  // 새로운 interval 시작
  intervalId = setInterval(spawnMonster, monsterSpawnInterval);
}

//황금 고블린 스폰주기 설정
function startGoldGoblinSpawning() {
  // 기존 interval이 있다면 중지
  if (goldGoblinintervalId !== null) {
    clearInterval(goldGoblinintervalId);
  }
  // 새로운 interval 시작
  goldGoblinintervalId = setInterval(spawnGoldGoblin, monsterSpawnInterval * 3);
}

// 타워 구매 버튼
const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);

document.body.appendChild(buyTowerButton);

// 타워 환불 버튼
const refundTowerButton = document.createElement('button');
refundTowerButton.textContent = '타워 환불';
refundTowerButton.style.position = 'absolute';
refundTowerButton.style.top = '10px';
refundTowerButton.style.right = '130px';
refundTowerButton.style.padding = '10px 20px';
refundTowerButton.style.fontSize = '16px';
refundTowerButton.style.cursor = 'pointer';

refundTowerButton.addEventListener('click', toggleRefundMode);

document.body.appendChild(refundTowerButton);

function sendEvent(handlerId, payload) {
  serverSocket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
}

function getUserGold() {
  return userGold;
}

function setUserGold(gold) {
  userGold = gold;
}

export { getUserGold, setUserGold };
