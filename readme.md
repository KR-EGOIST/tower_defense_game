# 일석4조 - Tower Defense Project

## 🎈 BGM 링크

### [AI-SEVEN-BGM](https://pixabay.com/ko/users/ai-seven-bgm-23012428/)

## 🎉 2D 에셋 링크

### [OpenGameArt](https://opengameart.org/)

## ✨ AWS 배포 링크

### [AWS링크]

## 👋 소개

- **일석4조**는 동시에 네 가지 이득을 본다라는 말이므로, 팀 구성원 모두 이번 팀 프로젝트로 많은 이득을 가져간다는 의미를 가진 팀 이름입니다.
- 우리 팀은 **타워 디펜스 게임**을 제작합니다.

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/KR-EGOIST"><img src="https://avatars.githubusercontent.com/u/54177070?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 윤진호 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Hoji1998"><img src="https://avatars.githubusercontent.com/u/166640354?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 박지호 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/rhwjdgns"><img src="https://avatars.githubusercontent.com/u/167050760?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 고정훈 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Ju-eeseul"><img src="https://avatars.githubusercontent.com/u/167306205?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 주이슬 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/diddntjd99"><img src="https://avatars.githubusercontent.com/u/71220570?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 양우성 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/socketdotio-010101?style=for-the-badge&logo=prisma&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white">

## 📄 프로젝트 도큐먼트

### [API명세서](https://industrious-lasagna-717.notion.site/Node-js-4-e71c9a7f34b8482aba410e823fe8c17a?pvs=4)

## 📄 패킷 구조

### [패킷 구조](https://industrious-lasagna-717.notion.site/Node-js-f4e53d9a013f4ae78a531d148f44f68e?pvs=4)

## 📃 와이어 프레임

![Blank diagram](https://github.com/KR-EGOIST/tower_defense_game/assets/54177070/181cebb2-1952-42cc-a2f3-11e9b791a60c)

## 📃 ERD Diagram

![Untitled](https://github.com/KR-EGOIST/tower_defense_game/assets/54177070/a6a20db2-f1be-47b0-8b9d-54bd479cb350)

## ⚽ 프로젝트 주요 기능

1. **회원가입 / 로그인 기능 (REST API로 통신)**
    - 회원가입 시 DB에 유저 데이터를 생성합니다.
    - 로그인 시 클라이언트에 토큰을 전달해줘서 클라이언트에서 쿠키를 생성합니다.

2. **유저 별 게임 데이터 관리**
    - 각각의 클라이언트 데이터들을 sendEvent함수를 통해 서버로 전달합니다.
    - 서버에서는 전달받은 payload 값들을 검증한 뒤 검증이 완료되면 success 를 반환합니다.
  
3. **클라이언트가 서버로부터 수신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)**
    - 커넥션 성공 이벤트 : 유저가 처음 서버에 접속하면 uuid를 발급해주고 이후 같은 아이디로 접속하면 기존의 uuid를 사용합니다. 접속 시 유저의 최고 점수도 연동됩니다.
    - 커넥션 실패 이벤트 : 유저가 서버에서 접속을 종료하면 서버에서 감지를 한 뒤 현재 접속중인 유저 데이터에서 해당 유저를 제외합니다.
    - 상태 동기화 이벤트
        - 타워
            - 클라이언트에 생성된 타워의 정보를 저장합니다.
            - 타워가 생성될 때 유저의 골드를 계산해 저장한 뒤 반환합니다.
            - 타워를 업그레이드 할 때 해당 타워의 위치정보를 전달받아 해당 위치에 타워가 존재하면 업그레이드를 하고 업그레이드 비용을 개산한 뒤 저장후 반환합니다.
            - 타워를 환불 할 때 해당 타워의 위치정보를 전달받아 해당 위치에 타워가 존재하면 환불을 하고 환불 비용을 계산한 뒤 저장후 반환합니다.
        - 몬스터
            - 몬스터를 잡으면 해당 몬스터의 id 와 level 를 저장한 뒤 반환합니다.
        - 골드
            - 클라이언트에서 골드를 획득하면 해당 유저의 골드와 전달 받은 골드를 더한 뒤 저장후 반환합니다.
         
4. **클라이언트가 서버로 송신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)**
     - 게임 시작 이벤트 : 게임 시작을 알리는 이벤트를 전달해 서버에서 해당 유저의 데이터를 새로 저장합니다.
     - 타워 추가 이벤트 : 타워가 추가되면 해당 타워의 x, y좌표와 타워의 정보, 타워의 level, 구매 비용을 전달합니다.
     - 타워 업그레이드 이벤트 : 타워가 업그레이드되면 해당 타워의 x, y좌표와 타워의 정보, 타워의 level, 업그레이드 비용을 전달합니다.
     - 타워 환불 이벤트 : 타워가 환불되면 해당 타워의 x, y좌표와 환불 비용을 전달합니다.
     - 골드 획득 이벤트 : 골든고블린을 잡을 시 500골드 획득을 전달합니다. 몬스터를 10마리 잡을 시 1000골드를 획득을 전달합니다.
     - 게임 종료 이벤트 : 게임 종료 시 최종 점수와 유저 검증을 위한 토큰을 전달합니다.
     - 몬스터 kill 이벤트 : 몬스터를 죽일 시 해당 몬스터의 id 와 level 을 전달합니다.

5. **유저 별 최고 기록 스코어 저장**
      - 클라이언트로부터 전달받은 토큰을 가지고 인증미들웨어를 거쳐 userId 값을 찾고 userId 값을 가지고 해당 유저의 DB에 최고 점수를 저장합니다.

## 🚀 추가 구현 기능

