'use strict';

let Game = {};

// 스테이지 객체
Game.Stage = {
  'el': document.querySelector('.stage'),
  'width': document.querySelector('.stage').offsetWidth,
  'height': document.querySelector('.stage').offsetHeight,
};

// 스테이지 만들기
Game.makeStage = function(){
  // 키 이벤트 걸기
  document.body.addEventListener('keydown', event => {
    Game.playerMoving(event.keyCode);
  });
};

// 플레이어 객체
Game.Player = {};

// 플레이어 만들기
Game.makePlayer = function(){
  const thisStage = Game.Stage,
  playerEl = document.createElement('div'),
  playerTop = thisStage.height - 30 - 30,
  playerLeft = (thisStage.width/2) - 15;
  // Dom 그리기
  playerEl.className = 'player';
  playerEl.style.top = playerTop + 'px';
  playerEl.style.left = playerLeft + 'px';
  thisStage.el.appendChild(playerEl);
  // 객체 만들기
  this.el = playerEl;
  this.isFired = false;
  this.posX = playerLeft;
  this.posY = playerTop;
};

// 플레이어 움직임
Game.playerMoving = function(keyCode){
  const thisKeyCode = keyCode,
  thisPlayer = Game.Player,
  thisPosX = thisPlayer.posX;
  let nextPosX = 0;
  // 키 입력 체크
  switch (thisKeyCode) {
    case 37 :
      // <- : 좌측으로 이동
      console.log('left');
      nextPosX = thisPosX - 10;
      thisPlayer.el.style.left = nextPosX + 'px';
      thisPlayer.posX = nextPosX;
      break;
    case 39 :
      // -> : 우측으로 이동
      console.log('right');
      nextPosX = thisPosX + 10;
      thisPlayer.el.style.left = nextPosX + 'px';
      thisPlayer.posX = nextPosX;
      break;
    case 32 :
      // space : 미사일 발사
      if (!thisPlayer.isFired) {
        console.log('fire');
        thisPlayer.isFired = true;
        Game.fireAction();
        setTimeout(() => {
          thisPlayer.isFired = false;
        }, 500);
      }
      break;
  }
};

// 미사일 만들기
Game.fireAction = function(){
  const missileEl = document.createElement('div'),
  thisPlayer = Game.Player,
  thisPosX = thisPlayer.posX,
  thisPosY = thisPlayer.posY;
  // Dom 그리기
  missileEl.className = 'missile';
  missileEl.style.top = thisPosY + 'px';
  missileEl.style.left = thisPosX + 10 + 2 + 'px';
  Game.Stage.el.appendChild(missileEl);
  // 발사 액션
  Game.missileMoving(missileEl);
};

// 미사일 움직임
Game.missileMoving = function(target){
  const thisMissile = target;
  let timer = setInterval(() => {
    const posX = parseInt(thisMissile.style.left),
    posY = parseInt(thisMissile.style.top);
    if(posY < 0) {
      // 스테이지 벗어날 시 미사일 삭제
      clearInterval(timer);
      Game.Stage.el.removeChild(thisMissile);
    } else {
      // 움직임
      thisMissile.style.top = posY - 10 + 'px';
      if (posY < 1000) {
        Game.checkHit(posX, posY, thisMissile, timer);
      }
    }
  }, 30);
};

// 적 그룹
Game.EnemyGroup = [];

// 적 만들기
Game.makeEnemy = function(){
  const enemyGroupEl = document.createElement('div');
  enemyGroupEl.className = 'enemy_group';
  
  for (let c = 0; c < 30; c++) {
    const enemyEl = document.createElement('div');
    let enemy = {},
    line = Math.floor(c/10),
    idx = c % 10,
    thisPosX, thisPosY = 0;

    console.log(line, idx);

    thisPosX = (idx * 30) + ((idx) * 30),
    thisPosY = (line * 30) + ((line + 1) * 30);

    enemyEl.className = 'enemy';
    enemyEl.style.top = thisPosY + 'px';
    enemyEl.style.left = thisPosX + 'px';
    
    enemyGroupEl.appendChild(enemyEl);

    enemy.el = enemyEl;
    enemy.posX = thisPosX;
    enemy.posY = thisPosY;

    this.EnemyGroup.push(enemy);
  }

  this.Stage.el.appendChild(enemyGroupEl);
};

// 적 제거
Game.checkHit = function(thisX, thisY, missile, interval){
  const targetX = thisX,
  targetY = thisY;
  this.EnemyGroup.forEach(enemy => {
    if ((enemy.posX <= targetX) && ((enemy.posX + 30) >= targetX)) {
      if ((enemy.posY <= targetY) && ((enemy.posY + 30) >= targetY)) {
        console.log('Hit!');
        clearInterval(interval);
        Game.Stage.el.removeChild(missile);
        document.querySelector('.enemy_group').removeChild(enemy.el);
        Game.EnemyGroup.splice(Game.EnemyGroup.indexOf(enemy), 1);
      }
    }
  });
};

// 적 움직임
Game.enemyGroupMoving = function(){
  let vec = 1,
  vLine = 0;
  let timer = setInterval(() => {
    if (vLine > 3) {
      this.EnemyGroup.forEach(enemy => {
        let nextPosY = enemy.posY + 30;
        enemy.el.style.top = nextPosY + 'px';
        enemy.posY = nextPosY;
      });
      vec = vec * -1;
      vLine = 0;
    } else {
      this.EnemyGroup.forEach(enemy => {
        let nextPosX = enemy.posX + (30 * vec);
        enemy.el.style.left = nextPosX + 'px';
        enemy.posX = nextPosX;
      });
      vLine++;
    }
  }, 1000);
};

// 게임 초기화
Game.init = function(){
  // 스테이지 초기화
  this.makeStage();

  document.querySelector('.btn_start').addEventListener('click', () => {

    document.querySelector('.modal_start').style.display = 'none';

    // 플레이어 만들기
    this.Player = new this.makePlayer();
    // 적 만들기
    this.makeEnemy();
    // 적 움직이기 시작
    setTimeout(() => {
      this.enemyGroupMoving();
    }, 1000);
  });
};

Game.init();