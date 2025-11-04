import SoundManager from './SoundManager.js';
import { colorConfig, levelConfig } from './Main.js';
import { addHoverEffect } from './utils.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.soundManager = null;

    this.player = null;
    this.obstacles = null;
    this.boss = null;
    this.bossBullets = null; 
    this.bossBulletTimer = null; 
    this.playerBullets = null;
    this.bulletTimer = null;
    this.doubleTimer = null;
    this.background = null;
    this.backgroundSpeed = 426;
    this.obstacleSpeed = 426;

    this.playerShake = 0;
    this.score = 0;
    this.scoreText = null;
    this.distance = 0;
    this.distanceText = null;
    this.level = 1;
    this.walkies = null;

    this.isGameOver = false;
    this.isPaused = false;
    this.isBossShown = false;
    this.obstacleTimer = null;
    this.currentObstacleType = 0;
    this.obstacleCount = 0;
    this.maxObstacles = 30; // 최대 장애물 개수
    this.cursors = null;
    this.gameOverText = null;
    this.quizData = null; 
    this.overlay = null;
    this.repairSprite = null;

    this.isInvincible = false; // 쉴드 벗겨진 후 무적 상태
    this.isRevivePopupShown = false; // 충돌 팝업 중복 방지
  }

  create(data) {
    const { width, height } = this.scale;
    
    // 퀴즈 데이터 초기화
    this.quizData = data?.quizData || [];
  
    this.soundManager = SoundManager.getInstance(this);
    this.soundManager.createSoundButtons();
    this.soundManager.setBGM('bgm');

    // 배경 생성
    this.background = this.add.tileSprite(360, 640, 720, 1280, 'background');

    // 게임 재생 / 정지 버튼 생성
    this.createButtons();

    // 플레이어 생성
    this.player = this.physics.add.sprite(360, 1120, 'player').setScale(0.3);
    this.player.body.setSize(this.player.width * 0.9, this.player.height * 0.9);
    this.player.setCollideWorldBounds(true);
    this.playerBullets = this.physics.add.group({defaultKey: 'playerBullet'}); // 플레이어 총알
    this.bossBullets = this.physics.add.group({defaultKey: 'bossBullet'}); // 보스 총알 그룹 생성
    this.bulletTimer = this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.isGameOver) return;
        const bullet = this.playerBullets.get(this.player.x, this.player.y - 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocityY(-600);
        }
      },
      loop: true
    });

    this.obstacles = this.physics.add.group(); // 장애물 그룹 생성
    this.coins = this.physics.add.group(); // 코인 그룹 생성
    this.shields = this.physics.add.group();  // shield 그룹 생성
    this.doubles = this.physics.add.group(); // double 그룹 생성
    this.walkies = this.physics.add.group(); // walkie 그룹 생성 추가

    // 게임 ui > 점수
    const scoreDim = this.add.container(100, 50);
    scoreDim.setDepth(20);

    const scoreBg = this.add.graphics();
    scoreBg.fillStyle(0xffffff, 0.6);
    scoreBg.fillRoundedRect(-70, -28, 140, 56, 20); 

    const coinIcon = this.add.sprite(-35, 0, 'coin'); 
    coinIcon.setScale(0.2);
    coinIcon.play('coinAni'); // 애니메이션 재생

    this.scoreText = this.add.text(20, 0, '0', {
      fontSize: '24px',
      fill: '#333',
      fontFamily: 'Cafe24Surround',
    }).setOrigin(0.5);

    scoreDim.add([scoreBg, coinIcon, this.scoreText]);

    // 게임 ui > 거리
    const distanceDim = this.add.container(100, 120);
    distanceDim.setDepth(20);

    const distanceBg = this.add.graphics();
    distanceBg.fillStyle(0xffffff, 0.6);
    distanceBg.fillRoundedRect(-70, -28, 140, 56, 20);

    const distanceIcon = this.add.sprite(-35, 0, 'distance');
    distanceIcon.setScale(0.2);
    distanceIcon.play('distanceAni');

    this.distanceText = this.add.text(25, 0, '0m', {
      fontSize: '24px',
      fill: '#333',
      fontFamily: 'Cafe24Surround',
    }).setOrigin(0.5);

    distanceDim.add([distanceBg, distanceIcon, this.distanceText]);

    // 게임 ui > walkie
    const walkieDim = this.add.container(100, height - 40);
    walkieDim.setDepth(20);

    const walkieBg = this.add.graphics();
    walkieBg.fillStyle(0xffffff, 0.6);
    walkieBg.fillRoundedRect(-70, -28, 140, 56, 20);

    this.walkieText = this.add.text(20, 0, '3', {
      fontSize: '24px',
      fill: '#333',
      fontFamily: 'Cafe24Surround',
    }).setOrigin(0.5);

    const walkieIcon = this.add.image(-35, 0, 'walkie').setScale(0.2);
    walkieDim.add([walkieBg, walkieIcon, this.walkieText]);

    // 게임 ui > repair kit
    const repairDim = this.add.container(260, height - 40);
    repairDim.setDepth(20);

    const repairBg = this.add.graphics();
    repairBg.fillStyle(0xffffff, 0.6);
    repairBg.fillRoundedRect(-70, -28, 140, 56, 20);

    this.repairText = this.add.text(20, 0, '0', {
      fontSize: '24px',
      fill: '#333',
      fontFamily: 'Cafe24Surround',
    }).setOrigin(0.5);

    const repairIcon = this.add.image(-35, 0, 'repair').setScale(0.15);
    repairDim.add([repairBg, repairIcon, this.repairText]);

    // -------------------------------------------------------------------------------------------- 충돌 처리
    this.physics.add.overlap(this.player, this.obstacles, this.playerHitObstacle, null, this); // player vs obstacle 충돌 처리
    this.physics.add.overlap(this.player, this.bossBullets, this.bossBulletHitPlayer, null, this); // player vs boss bullet 충돌 처리
    this.physics.add.overlap(this.playerBullets, this.obstacles, this.playerBulletHitObstacle, null, this); // playerBullet vs obstacle 충돌 처리
    
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this); // player vs coin 충돌 처리
    this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this); // player vs shield 충돌 처리
    this.physics.add.overlap(this.player, this.doubles, this.collectDouble, null, this); // player vs double 충돌 처리
    this.physics.add.overlap(this.player, this.walkies, this.collectWalkie, null, this); // player vs walkie 충돌 처리

    this.cursors = this.input.keyboard.createCursorKeys();
    this.startObstacleTimer();
    this.isGameOver = false;
    this.createLevelProgressBar();

      // 드래그 이동 관련 변수 초기화
      this.isDragging = false;
      this.dragOffsetX = 0;

      // 모바일/PC 드래그 이벤트 등록
      this.input.on('pointerdown', (pointer) => {
        // 플레이어와 터치/마우스 위치가 가까울 때만 드래그 시작
        if (Phaser.Math.Distance.Between(pointer.x, pointer.y, this.player.x, this.player.y) < 150) {
          this.isDragging = true;
          this.dragOffsetX = this.player.x - pointer.x;
        }
      });
      this.input.on('pointerup', () => {
        this.isDragging = false;
      });
      this.input.on('pointermove', (pointer) => {
        if (this.isDragging) {
          if (this.isBossShown) {
            // 보스 등장 후: x, y 모두 이동
            let newX = pointer.x + this.dragOffsetX;
            let newY = pointer.y;
            // 화면 경계 체크
            newX = Math.max(150, Math.min(newX, this.scale.width - 150));
            newY = Math.max(150, Math.min(newY, this.scale.height - 150));
            this.player.x = newX;
            this.player.y = newY;
          } else {
            // 보스 등장 전: x만 이동
            let newX = pointer.x + this.dragOffsetX;
            newX = Math.max(150, Math.min(newX, this.scale.width - 150));
            this.player.x = newX;
          }
        }
      });
  }

  async update(time, delta) {
    if (this.isGameOver || this.isPaused) {
      return;
    }

    // deltaSeconds 변수는 한 번만 선언
    let deltaSeconds = delta / 1000;

    // 드래그 중에도 배경 흐름 유지
    if (!this.isPaused && !this.isGameOver && !this.isBossShown) {
      this.background.tilePositionY -= this.backgroundSpeed * deltaSeconds;
    }

    // 드래그 중일 때는 키보드 이동 무시, 플레이어 위치만 갱신
    if (this.isDragging) {
      this.player.setVelocityX(0);
      // 쉴드 오버레이도 같이 이동
      if (this.player && this.player.shieldOverlay) {
        this.player.shieldOverlay.x = this.player.x;
        this.player.shieldOverlay.y = this.player.y;
      }
      // 더블 타이머 UI도 같이 이동 및 진행 바 갱신
      if (this.doubleTimerBar && this.player) {
        const playerX = this.player.x;
        const playerY = this.player.y - 80;
        if (this.doubleTimerBg) {
          this.doubleTimerBg.x = playerX;
          this.doubleTimerBg.y = playerY;
        }
        if (this.doubleTimerBarBg) {
          this.doubleTimerBarBg.x = playerX;
          this.doubleTimerBarBg.y = playerY;
        }
        this.doubleTimerBar.x = playerX;
        this.doubleTimerBar.y = playerY;
        // 진행 바도 갱신
        this.updateDoubleTimerUI();
      }
      // 드래그 중에도 거리 증가 및 UI 갱신
      const targetBossDistance = levelConfig[this.level].bossDistance / 100;
      const shouldStopDistance = this.distance >= targetBossDistance;
      if (!this.isBossShown && !shouldStopDistance) {
        const deltaSeconds = delta / 1000;
        this.distance += deltaSeconds;
        this.distanceText.setText(`${Math.floor(this.distance)}m`);
      }
      // 드래그 중에도 보스 체력바 UI 갱신
      if (this.boss && this.boss.active) {
        this.updateBossHealthUI();
      }
      // 드래그 중에도 obstacle1(뱀) 좌우 이동
      this.obstacles.children.entries.forEach((obstacle) => {
        if (obstacle.texture.key === 'obstacle1') {
          // playerbullet에 맞은 obstacle1(뱀)은 좌우로 움직이지 않음
          if (obstacle.isHit) return;
          const newX = obstacle.x + Math.sin(Date.now() / 2000 + obstacle.y / 100) * 8.0;
          const obstacleHalfWidth = obstacle.width * obstacle.scaleX * 0.5;
          if (newX >= 150 + obstacleHalfWidth && newX <= this.scale.width - 150 - obstacleHalfWidth) {
            obstacle.setX(newX);
          }
        }
      });
      return;
    }

    // (중복) deltaSeconds 선언 및 배경 흐름 코드 제거

    // 보스 거리 도달 체크 및 거리 증가 중단
    const targetBossDistance = levelConfig[this.level].bossDistance / 100;
    const shouldStopDistance = this.distance >= targetBossDistance;
    
    // 보스 등장 조건: 장애물 30개 완료 + 모든 장애물 제거 + 거리 조건 달성
    if (this.obstacleCount >= this.maxObstacles && this.obstacles.children.entries.length == 0 && shouldStopDistance &&!this.isGameOver && !this.isBossShown) {
      this.isBossShown = true;

      this.sound.stopAll();
      this.soundManager.setBGM('bossBgm');

      const warningHeight = this.scale.height * 0.3;
      const warningOverlay = this.add.graphics({ x: 0, y: 0 }).setDepth(100);
      for (let i = 0; i < warningHeight; i += 4) {
        const alpha = 0.7 * (1 - i / warningHeight);
        warningOverlay.fillStyle(0xff0000, alpha);
        warningOverlay.fillRect(0, i, this.scale.width, 4);
      }

      this.tweens.add({
        targets: warningOverlay,
        alpha: 0.2,
        duration: 300,
        yoyo: true,
        repeat: 7
      });
      
      this.time.delayedCall(1000, () => {
        warningOverlay.destroy();
        this.showBoss();
      });

      return;
    }

    if (this.boss && this.boss.active) {
      const bossTargetY = 250;
      if (this.boss.y < bossTargetY - 5) {
        // tween이 알아서 처리하므로 아무것도 하지 않음
      } else {
        this.boss.y = bossTargetY;
        this.boss.setVelocityY(0);
      }
    }

    // 플레이어 이동
    if (this.isBossShown) { // 보스 등장 후
      if (this.cursors.left.isDown && this.player.x > 150) {
        this.player.setVelocityX(-540);
      } else if (this.cursors.right.isDown && this.player.x < this.scale.width - 150) {
        this.player.setVelocityX(540);
      } else {
        this.player.setVelocityX(0);
      }
      
      if (this.cursors.up.isDown && this.player.y > 150) {
        this.player.setVelocityY(-540);
      } else if (this.cursors.down.isDown && this.player.y < this.scale.height - 150) {
        this.player.setVelocityY(540);
      } else {
        this.player.setVelocityY(0);
      }
    } else { // 보스 등장 전: 좌우만 이동 가능
      if (this.cursors.left.isDown && this.player.x > 150) {
        this.player.setVelocityX(-540);
      } else if (this.cursors.right.isDown && this.player.x < this.scale.width - 150) {
        this.player.setVelocityX(540);
      } else {
        this.player.setVelocityX(0);
        this.playerShake = 3;
      }
    }

    if (this.player && this.player.shieldOverlay) { // 플레이어 쉴드
      this.player.shieldOverlay.x = this.player.x;
      this.player.shieldOverlay.y = this.player.y;
    }

    if (this.playerShake > 0) { // 플레이어 흔들림
      this.player.y += Math.sin(Date.now() / 40) * 2;
    }

    // 거리 1초에 1m 증가
    if (!this.isBossShown && !shouldStopDistance) {
      this.distance += deltaSeconds;
      this.distanceText.setText(`${Math.floor(this.distance)}m`);
    }

    this.playerBullets.children.entries.forEach((bullet) => (bullet.y < -50)  && bullet.destroy()); // 총알 정리
    this.bossBullets.children.entries.forEach((bullet) => (bullet.y > 1330) && bullet.destroy()); // 보스 총알 정리
    this.coins.children.entries.forEach((coin) => (coin.y > 1330) && coin.destroy()); // 코인 정리
    this.shields.children.entries.forEach((shield) => (shield.y > 1330) && shield.destroy()); // 쉴드 정리
    
    this.obstacles.children.entries.forEach((obstacle) => { // 장애물 정리 / 좌우 이동(obstacle1)
      if (obstacle.y > 1330) obstacle.destroy(); // 장애물 정리
      if (obstacle.texture.key === 'obstacle1') { // obstacle1 좌우로 움직이는 기능 추가
        // playerbullet에 맞은 obstacle1(뱀)은 좌우로 움직이지 않음
        if (obstacle.isHit) return;
        const newX = obstacle.x + Math.sin(Date.now() / 2000 + obstacle.y / 100) * 8.0;
        const obstacleHalfWidth = obstacle.width * obstacle.scaleX * 0.5;
        if (newX >= 150 + obstacleHalfWidth && newX <= this.scale.width - 150 - obstacleHalfWidth) {
          obstacle.setX(newX);
        }
      }
    });

    this.updateDoubleTimerUI(); // 더블 타이머 UI 업데이트
    if (this.boss && this.boss.active) this.updateBossHealthUI(); // 보스 체력 바 UI 업데이트
  }

  // ------------------------------------------------------------------------------------ 필요 메서드들
  createLevelProgressBar() {
    const { width } = this.scale;
    const barWidth = 350;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = 24;

    // 밝은 배경
    this.levelBarBg = this.add.graphics();
    this.levelBarBg.fillStyle(0xffffff, 0.8); // 밝은 흰색 배경
    this.levelBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 12);
    this.levelBarBg.setDepth(30);

    // 진행 바
    this.levelBar = this.add.graphics();
    this.levelBar.setDepth(31);
    this.updateLevelProgressBar();

    // 텍스트
    this.levelBarText = this.add.text(width / 2, barY + barHeight / 2, `Level ${this.level}`, {
      fontSize: '20px',
      fill: '#333',
      fontFamily: 'Cafe24Surround',
    }).setOrigin(0.5).setDepth(32);
  }

  updateLevelProgressBar() {
    if (!this.levelBar) return;
    const { width } = this.scale;
    const barWidth = 350;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = 24;
    const progress = Math.min(this.level, 10) / 10;

    this.levelBar.clear();
    this.levelBar.fillStyle(colorConfig.hex_mint, 1);
    this.levelBar.fillRoundedRect(barX, barY, barWidth * progress, barHeight, 12);

    if (this.levelBarText) this.levelBarText.setText(`Level ${this.level}`);
  }

  createButtons() {
    const { width } = this.scale;
  
    // 게임 재생 버튼
    this.playButton = this.add.image(width - 50, 50, 'playButton').setScale(0.2).setDepth(40).setVisible(false).setInteractive();
    addHoverEffect(this.playButton, this);
    this.playButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.playButton.setVisible(false);
      this.pauseButton.setVisible(true);
      this.gameResume();
    });

    // 게임 일시정지 버튼
    this.pauseButton = this.add.image(width - 50, 50, 'pauseButton').setScale(0.2).setDepth(40).setVisible(true).setInteractive();
    addHoverEffect(this.pauseButton, this);
    this.pauseButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.pauseButton.setVisible(false);
      this.playButton.setVisible(true);
      this.gamePause();
      // 일시정지 UI 표시
      this.showPauseMenu();
    });
  }

  gamePause() {
    this.isPaused = true;
    this.physics.pause(); // 물리 엔진 일시정지
    this.sound.pauseAll(); // 음악 정지
    
    // 개별 애니메이션들만 선택적으로 일시정지 (playerDance 제외)
    this.children.list.forEach(child => {
      if (child.anims && child.anims.currentAnim) {
        if (child.anims.currentAnim.key !== 'playerDanceAni') {
          child.anims.pause();
        }
      }
    });
    
    // 개별 그룹 객체 애니메이션 정지
    this.coins.children.entries.forEach(coin => {
      if (coin.anims && coin.anims.currentAnim) coin.anims.pause();
    });
    this.shields.children.entries.forEach(shield => {
      if (shield.anims && shield.anims.currentAnim) shield.anims.pause();
    });
    this.doubles.children.entries.forEach(double => {
      if (double.anims && double.anims.currentAnim) double.anims.pause();
    });
    this.obstacles.children.entries.forEach(obstacle => {
      if (obstacle.anims && obstacle.anims.currentAnim) obstacle.anims.pause();
    });
    
    // 타이머들 일시정지
    if (this.bulletTimer) this.bulletTimer.paused = true;
    if (this.obstacleTimer) this.obstacleTimer.paused = true;
    if (this.doubleTimer) this.doubleTimer.paused = true;
    if (this.bossBulletTimer) this.bossBulletTimer.paused = true;
  }

  gameResume() {
    this.isPaused = false;
    this.physics.resume(); // 물리 엔진 재개
    this.sound.resumeAll(); // 음악 재생
    
    // 개별 애니메이션들 재개 (playerDance는 이미 실행 중이므로 건드리지 않음)
    this.children.list.forEach(child => {
      if (child.anims && child.anims.currentAnim && child.anims.isPaused) {
        if (child.anims.currentAnim.key !== 'playerDanceAni') {
          child.anims.resume();
        }
      }
    });
    
    // 개별 그룹 객체 애니메이션 재개
    this.coins.children.entries.forEach(coin => {
      if (coin.anims && coin.anims.currentAnim) coin.anims.resume();
    });
    this.shields.children.entries.forEach(shield => {
      if (shield.anims && shield.anims.currentAnim) shield.anims.resume();
    });
    this.doubles.children.entries.forEach(double => {
      if (double.anims && double.anims.currentAnim) double.anims.resume();
    });
    this.obstacles.children.entries.forEach(obstacle => {
      if (obstacle.anims && obstacle.anims.currentAnim) obstacle.anims.resume();
    });
    
    // 타이머들 재개
    if (this.bulletTimer) this.bulletTimer.paused = false;
    if (this.obstacleTimer) this.obstacleTimer.paused = false;
    if (this.doubleTimer) this.doubleTimer.paused = false;
    if (this.bossBulletTimer) this.bossBulletTimer.paused = false;
    
    // 일시정지 UI 제거
    this.hidePauseMenu();
  }

  createObstacle() {
    if (this.isGameOver || this.isPaused || this.obstacleCount >= this.maxObstacles) {
      if (this.obstacleCount >= this.maxObstacles && this.obstacleTimer) {
        this.obstacleTimer.destroy();
        this.obstacleTimer = null;
      }
      return;
    }

    this.currentObstacleType = (this.currentObstacleType + 1) % 3;
    const obstacleKey = 'obstacle' + (this.currentObstacleType + 1);

    // 장애물별 설정값 정의
    const obstacleConfig = {
      'obstacle1': { scale: 0.3, margin: 150 },   // 뱀
      'obstacle2': { scale: 0.3, margin: 150 },   // 선인장
      'obstacle3': { scale: 0.4, margin: 200 }    // 쿠키 바위
    };

    const config = obstacleConfig[obstacleKey];

    // obstacle1의 경우 레벨별 obstacleCount만큼 생성하지만 카운트는 1로
    if (obstacleKey === 'obstacle1') {
      const spawnCount = levelConfig[this.level].obstacleCount;
      const spacing = 220; // 뱀들 사이의 간격
      const totalWidth = (spawnCount - 1) * spacing;
      const startX = (720 - totalWidth) / 2; // 중앙 정렬을 위한 시작 X 위치
      
      for (let i = 0; i < spawnCount; i++) {
        let x = startX + (i * spacing);
        x = Math.max(config.margin, Math.min(x, 720 - config.margin));
        const obstacle = this.obstacles.create(x, -100, obstacleKey);
        obstacle.originalType = obstacleKey;
        obstacle.setScale(config.scale);
        obstacle.play('obstacle1Ani');
        obstacle.setSize(obstacle.width * 0.9, obstacle.height * 0.9);
        obstacle.setVelocityY(this.obstacleSpeed);
      }
      this.obstacleCount++; // 뱀 그룹 전체를 하나의 장애물로 카운트
    } else { // 다른 장애물들은 기존대로 1개씩 생성
      const x = Phaser.Math.Between(config.margin, 720 - config.margin);
      const obstacle = this.obstacles.create(x, -100, obstacleKey);
      this.obstacleCount++;
      obstacle.originalType = obstacleKey;
      obstacle.setScale(config.scale);
      obstacle.setSize(obstacle.width * 0.9, obstacle.height * 0.9);
      obstacle.setVelocityY(this.obstacleSpeed);
    }
  }

  // ------------------------------------------------------------------------------------ 오버레이 관리 메서드들
  createOverlay(depth = 45) {
    if (this.overlay) this.overlay.destroy();
    const { width, height } = this.scale;
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(depth).setInteractive();
    return this.overlay;
  }

  removeOverlay() {
    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
    }
  }

  // ------------------------------------------------------------------------------------ 충돌 처리 메서드들
  // 공통 플레이어 피격 처리 함수
  handlePlayerHit(player, otherObject) {
  if (this.isGameOver || this.isInvincible) return;

    // 쉴드가 있으면 쉴드 제거하고 충돌한 객체만 파괴
    if (player.shieldOverlay) {
      player.shieldOverlay.destroy();
      player.shieldOverlay = null;
      if (otherObject && otherObject.destroy) {
        otherObject.destroy();
      } else {
        player.y += 400;
      }
      return;
    }

    // 쉴드가 없으면 게임오버
    if (otherObject) otherObject.destroy();
    player.setTexture('playerHit');
  
    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
      this.obstacleTimer = null; 
    }
    this.gamePause();
    this.showRevivePopup();
  }

  // 플레이어 vs 장애물(player 처리)
  playerHitObstacle(player, obstacle) {
    if (this.isGameOver) return;
    this.handlePlayerHit(player, obstacle);
  }

  // 보스 총알 vs 플레이어(player 처리)
  bossBulletHitPlayer(player, bullet) {
    if (this.isGameOver) return;
    this.handlePlayerHit(player, bullet);
  }

  // 보스 vs 플레이어(player 처리)
  bossHitPlayer(player, boss) {
    if (this.isGameOver) return;
    this.handlePlayerHit(player, null);
  }

  // 플레이어 총알 vs 장애물(obstacle 처리)
  playerBulletHitObstacle(bullet, obstacle) {
    this.soundManager.playSound('bulletHitSound');
    bullet.destroy();

    obstacle.hitCount = (obstacle.hitCount || 0);
    obstacle.hitCount += 1;

    const hitText = this.add.text(obstacle.x, obstacle.y - 30, `Hit ${obstacle.hitCount}`, { 
      fontFamily: 'Cafe24Surround', 
      fontSize: '20px', 
      fontStyle: 'bold', 
      fill: colorConfig.color_lollipop, 
      stroke: colorConfig.color_snow, 
      strokeThickness: 4 
    });

    this.time.delayedCall(500, () => hitText.destroy());

    // 저장된 원래 타입 사용
    switch (obstacle.originalType) {
      case 'obstacle1': // 뱀
        if (obstacle.hitCount === 1) {
          obstacle.isHit = true;
        } else {
          const rewardType = Phaser.Math.Between(0, 1) === 0 ? 'double' : 'shield';
          let reward;
          if (rewardType === 'double') {
            reward = this.doubles.create(obstacle.x, obstacle.y, 'double');
          } else {
            reward = this.shields.create(obstacle.x, obstacle.y, 'shield');
          }
          reward.setScale(0.3);
          reward.setSize(reward.width * 0.8, reward.height * 0.8);
          reward.play(rewardType + 'Ani');
          reward.body.setVelocityY(this.obstacleSpeed);
          obstacle.destroy();
        }
        break;
      case 'obstacle2': // 선인장
        if (obstacle.hitCount === 1) {
          obstacle.setTexture('obstacle2Ice');
        } else {
          const coin = this.coins.create(obstacle.x, obstacle.y, 'coin');
          coin.setScale(0.3);
          coin.setSize(coin.width * 0.8, coin.height * 0.8);
          coin.play('coinAni');
          coin.body.setVelocityY(this.obstacleSpeed);
          obstacle.destroy();
        }
        break;
      case 'obstacle3': // 쿠키 바위
        if (obstacle.hitCount === 1) {
          obstacle.setScale(obstacle.scaleX * 0.8);
          obstacle.setSize(obstacle.width * 0.8, obstacle.height * 0.8);
        } else {
          for (let i = -1; i <= 1; i += 2) {
            const coin = this.coins.create(obstacle.x + i * 20, obstacle.y, 'coin');
            coin.setScale(0.3);
            coin.setSize(coin.width * 0.8, coin.height * 0.8);
            coin.play('coinAni');
            coin.body.setVelocityY(this.obstacleSpeed);
          }
          obstacle.destroy();
        }
        break;
    }
  }

  // 플레이어 총알 vs 보스(boss 처리)
  playerBulletHitBoss(boss, bullet) {
    this.soundManager.playSound('bulletHitSound');
    bullet.destroy();
    
    boss.hitCount += 1;
    
    // 보스 체력 바 업데이트
    this.updateBossHealthUI();

    switch (boss.hitCount) {
      case 1:
        boss.setTexture('boss2');
        break;
      case levelConfig[this.level].bossHit / 4:
        boss.setTexture('boss3');
        break;
      case levelConfig[this.level].bossHit / 2:
        boss.setTexture('boss4');
        break;
      case levelConfig[this.level].bossHit:
        boss.setTexture('boss5');
        this.defeatBoss(boss);
        break;
    }
  }
  // ------------------------------------------------------------------------------------ 아이템 수집 메서드들

  collectCoin(player, coin) { // 코인 수집
    this.soundManager.playSound('coinSound');
    coin.destroy();
    
    this.score += 10;
    this.scoreText.setText(this.score);
    
    const collectText = this.add.text(coin.x, coin.y - 30, '+10', {
      fontFamily: 'Cafe24Surround', 
      fontSize: '20px', 
      fontStyle: 'bold', 
      fill: colorConfig.color_lollipop, 
      stroke: colorConfig.color_snow, 
      strokeThickness: 4 
    });
    
    this.tweens.add({
      targets: collectText,
      y: collectText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => collectText.destroy()
    });
  }

  collectShield(player, shield) { // 쉴드 수집
    this.soundManager.playSound('helperSound');
    shield.destroy();

    if (player.shieldOverlay) {
      player.shieldOverlay.destroy();
      player.shieldOverlay = null;
      // 쉴드가 벗겨진 직후 일정 시간 무적
      this.isInvincible = true;
      this.time.delayedCall(1000, () => {
        this.isInvincible = false;
      });
    }

    const shieldOverlay = this.add.graphics();
    shieldOverlay.fillStyle(0x66ccff, 0.3);
    shieldOverlay.fillCircle(0, 0, player.width * 0.2);
    shieldOverlay.setDepth(1);
    shieldOverlay.x = player.x;
    shieldOverlay.y = player.y;
    player.shieldOverlay = shieldOverlay;
  }

  collectDouble(player, double) { // 더블 총알
    this.soundManager.playSound('helperSound');
    double.destroy();
    
    if (this.doubleTimer) this.doubleTimer.destroy();
    if (this.bulletTimer) this.bulletTimer.destroy();

    // 더블 효과 UI 생성
    this.createDoubleTimerUI();

    this.bulletTimer = this.time.addEvent({
      delay: 500,
      callback: () => {
      if (this.isGameOver || this.isInvincible) return;
        
        // 왼쪽 총알 추가
        const leftBullet = this.playerBullets.get(this.player.x - 25, this.player.y - 50);
        if (leftBullet) {
          leftBullet.setScale(0.1);
          leftBullet.body.setVelocityY(-600);
        }
        
        // 오른쪽 총알 추가
        const rightBullet = this.playerBullets.get(this.player.x + 25, this.player.y - 50);
        if (rightBullet) {
          rightBullet.setScale(0.1);
          rightBullet.body.setVelocityY(-600);
        }
      },
      loop: true
    });

    this.doubleTimer = this.time.delayedCall(20000, () => { // 새로운 20초 타이머 시작
      if (this.bulletTimer) {
        this.bulletTimer.destroy();
      }
      
      this.removeDoubleTimerUI(); // 더블 UI 제거
      
      this.bulletTimer = this.time.addEvent({ // 원래 단일 총알 타이머 복구
        delay: 500,
        callback: () => {
        if (this.isGameOver || this.isInvincible) return;
          const bullet = this.playerBullets.get(this.player.x, this.player.y - 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocityY(-600);
          }
        },
        loop: true
      });
      
      this.doubleTimer = null; // 타이머 초기화
    });
  }

  collectWalkie(player, walkie) { // 워키토키 수집
    walkie.destroy();
    
    // 워키토키 개수 증가
    const currentCount = parseInt(this.walkieText.text);
    this.walkieText.setText(currentCount + 1);
  }
  // ------------------------------------------------------------------------------------ 
  // 더블 타이머 UI 업데이트
  updateDoubleTimerUI() {
    if (!this.doubleTimerBg || !this.player || !this.doubleCountdownText) return;

    const elapsed = this.time.now - this.doubleStartTime;
    const remaining = Math.max(0, this.doubleDuration - elapsed);
    const countdown = Math.ceil(remaining / 1000); // 초 단위로 변환

    // UI를 플레이어 위에 위치시키기
    const playerX = this.player.x;
    const playerY = this.player.y - 80;

    // 모든 UI 요소의 위치 업데이트
    this.doubleTimerBg.x = playerX;
    this.doubleTimerBg.y = playerY;
    this.doubleCountdownText.x = playerX;
    this.doubleCountdownText.y = playerY;

    // 카운트다운 텍스트 업데이트
    this.doubleCountdownText.setText(countdown.toString());
    
    // 시간에 따른 색상 변경
    if (countdown <= 5) {
      this.doubleCountdownText.setFill(colorConfig.color_lollipop); // 빨강
    } else if (countdown <= 10) {
      this.doubleCountdownText.setFill(colorConfig.color_candy); // 노랑
    } else {
      this.doubleCountdownText.setFill(colorConfig.color_snow); // 흰색
    }
    
    // 카운트다운이 0이 되면 UI 제거
    if (countdown <= 0) {
      this.removeDoubleTimerUI();
    }
  }

  // 더블 타이머 UI 생성
  createDoubleTimerUI() {
    this.removeDoubleTimerUI();
    
    // 원형 배경
    this.doubleTimerBg = this.add.graphics();
    this.doubleTimerBg.fillStyle(colorConfig.hex_black, 0.7);
    this.doubleTimerBg.fillCircle(0, 0, 35);
    this.doubleTimerBg.setDepth(10);

    // 카운트다운 텍스트
    this.doubleCountdownText = this.add.text(0, 0, '20', {
      fontSize: '28px',
      fill: colorConfig.color_snow,
      fontFamily: 'Cafe24Surround',
      stroke: colorConfig.color_deepBlue,
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(12);

    // 시작 시간 저장
    this.doubleStartTime = this.time.now;
    this.doubleDuration = 20000; // 20초
  }

  // 더블 타이머 UI 제거
  removeDoubleTimerUI() {
    if (this.doubleTimerBg) {
      this.doubleTimerBg.destroy();
      this.doubleTimerBg = null;
    }
    if (this.doubleCountdownText) {
      this.doubleCountdownText.destroy();
      this.doubleCountdownText = null;
    }
  }

  // 보스 체력 바 UI 업데이트
  updateBossHealthUI() {
    if (!this.bossHealthBar || !this.boss) return;

    const maxHealth = levelConfig[this.level].bossHit;
    const currentHealth = Math.max(0, maxHealth - this.boss.hitCount);
    const progress = currentHealth / maxHealth;

    // UI를 보스 위에 위치시키기 (보스와 함께 움직임)
    const bossX = this.boss.x;
    const bossY = this.boss.y - 160;

    // 모든 UI 요소의 위치 업데이트
    this.bossHealthBg.x = bossX;
    this.bossHealthBg.y = bossY;
    this.bossHealthBarBg.x = bossX;
    this.bossHealthBarBg.y = bossY;
    this.bossHealthBar.x = bossX;
    this.bossHealthBar.y = bossY;

    // 체력 바 그리기
    this.bossHealthBar.clear();
    
    // 진행률에 따른 색상 결정
    let color = colorConfig.hex_greenTea;
    if (progress < 0.3) {
      color = colorConfig.hex_lollipop;
    } else if (progress < 0.6) {
      color = colorConfig.hex_candy;
    }
    
    this.bossHealthBar.fillStyle(color, 1);
    
    const barWidth = 200 * progress; // 체력 바의 너비 계산
    this.bossHealthBar.fillRoundedRect(-100, -10, barWidth, 20, 10);
  }

  // 보스 체력 바 UI 생성
  createBossHealthUI() {
    this.removeBossHealthUI();
    
    // 배경 직사각형
    this.bossHealthBg = this.add.graphics();
    this.bossHealthBg.fillStyle(colorConfig.hex_black, 0.7);
    this.bossHealthBg.fillRoundedRect(-110, -20, 220, 40, 15);
    this.bossHealthBg.setDepth(15);

    // 체력 바 배경
    this.bossHealthBarBg = this.add.graphics();
    this.bossHealthBarBg.fillStyle(0x333333, 0.8);
    this.bossHealthBarBg.fillRoundedRect(-100, -10, 200, 20, 10);
    this.bossHealthBarBg.setDepth(16);

    // 체력 바
    this.bossHealthBar = this.add.graphics();
    this.bossHealthBar.setDepth(17);
  }

  removeBossHealthUI() { // 보스 체력 바 UI 제거
    if (this.bossHealthBg) {
      this.bossHealthBg.destroy();
      this.bossHealthBg = null;
    }
    if (this.bossHealthBarBg) {
      this.bossHealthBarBg.destroy();
      this.bossHealthBarBg = null;
    }
    if (this.bossHealthBar) {
      this.bossHealthBar.destroy();
      this.bossHealthBar = null;
    }
  }

  createBossBullet() { // 보스 총알 생성
    if (!this.boss || !this.boss.active || this.isGameOver || this.isPaused) {
      return;
    }

    // 총알 패턴
    const bulletPatterns = [
      () => { // 직선 패턴
        for (let i = 0; i < levelConfig[this.level].bossBullet; i++) {
          const bullet = this.bossBullets.get(this.boss.x + (i - 1) * 30, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocityY(300);
            bullet.body.setVelocityX((i - 1) * 50);
          }
        }
      },
      () => { // 부채꼴로 퍼지는 패턴
        const angleStep = 30; // 각도 간격
        const bulletCount = levelConfig[this.level].bossBullet;
        const startAngle = -angleStep * Math.floor(bulletCount / 2);
        for (let i = 0; i < bulletCount; i++) {
          const angle = Phaser.Math.DegToRad(startAngle + i * angleStep);
          const bullet = this.bossBullets.get(this.boss.x, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocity(Math.sin(angle) * 250, Math.cos(angle) * 250);
          }
        }
      },
      () => { // 플레이어 추적 패턴
        const playerDirection = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
        for (let i = 0; i < levelConfig[this.level].bossBullet; i++) {
          const spread = (i - 1) * 0.3;
          const angle = playerDirection + spread;
          const bullet = this.bossBullets.get(this.boss.x, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
          }
        }
      },
      () => { // 원형 패턴
        const bulletCount = 6;
        for (let i = 0; i < bulletCount; i++) {
          const angle = (i / bulletCount) * Math.PI * 2;
          const bullet = this.bossBullets.get(this.boss.x, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
          }
        }
      },
      () => { // 나선형 패턴
        const spiralBullets = 4;
        const spiralOffset = Date.now() * 0.005; // 시간에 따라 회전
        for (let i = 0; i < spiralBullets; i++) {
          const angle = (i / spiralBullets) * Math.PI * 2 + spiralOffset;
          const bullet = this.bossBullets.get(this.boss.x, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
          }
        }
      },
      () => { // V자 패턴
        const vBullets = 4;
        for (let i = 0; i < vBullets; i++) {
          const side = i % 2 === 0 ? -1 : 1;
          const bulletIndex = Math.floor(i / 2);
          const angle = Phaser.Math.DegToRad(side * (15 + bulletIndex * 10));
          const bullet = this.bossBullets.get(this.boss.x, this.boss.y + 50);
          if (bullet) {
            bullet.setScale(0.1);
            bullet.body.setVelocity(Math.sin(angle) * 300, Math.cos(angle) * 300);
          }
        }
      }
    ];
    const patternIndex = Phaser.Math.Between(0, bulletPatterns.length - 1);
    bulletPatterns[patternIndex]();
    this.soundManager.playSound('bossShootSound');
  }

  defeatBoss(boss) { // 보스 처치
    if (this.bossBulletTimer) {
      this.bossBulletTimer.destroy();
      this.bossBulletTimer = null;
    }
    
    this.removeBossHealthUI(); // 보스 체력 바 UI 제거
    
    this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: boss,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          boss.destroy();
          this.bossBullets.clear(true, true);
          this.sound.stopAll();
          this.soundManager.setBGM('coinBgm');

          // 보상 뿌리기 (코인 + 워키토키)
          for (let i = 0; i < 20; i++) {
            const coinX = Phaser.Math.Between(100, 620);
            const coinY = Phaser.Math.Between(200, 800);
            const coin = this.coins.create(coinX, coinY, 'coin');
            coin.setScale(0.3);
            coin.setSize(coin.width * 0.8, coin.height * 0.8);
            coin.play('coinAni');
          }

          for (let i = 0; i < levelConfig[this.level].walkieReward; i++) {
            const walkieX = Phaser.Math.Between(100, 620);
            const walkieY = Phaser.Math.Between(200, 800);
            const walkie = this.walkies.create(walkieX, walkieY, 'walkie');
            walkie.setScale(0.3);
            walkie.body.setSize(walkie.width * 0.8, walkie.height * 0.8);
          }
          
          this.time.delayedCall(6000, () =>  this.nextLevel());
        }
      });
    })
  }

  startObstacleTimer() {
    this.obstacleTimer = this.time.addEvent({ delay: 1000, callback: this.createObstacle, callbackScope: this, loop: true });
  }

  showBoss() { // 보스 등장
    this.boss = this.physics.add.sprite(this.scale.width / 2, -100, 'boss1');
    this.boss.type = 'boss1';
    this.boss.body.setSize(this.boss.width * 0.8, this.boss.height * 0.8);
    this.boss.setScale(0.4);
    this.boss.hitCount = 0;
    this.createBossHealthUI();

    const bossEndY = 250;
    const bossMoveDuration = 3500; // 내려오는 시간(ms)
    const bossSwingAmplitude = 120; // 좌우 이동 폭
    const bossSwingDuration = 900; // 좌우 왕복 시간(ms)

    // y축 tween (천천히 내려오기)
    this.tweens.add({
      targets: this.boss,
      y: bossEndY,
      duration: bossMoveDuration,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.boss,
      x: {
        getStart: () => this.scale.width / 2 - bossSwingAmplitude,
        getEnd: () => this.scale.width / 2 + bossSwingAmplitude
      },
      duration: bossSwingDuration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.bossBulletTimer = this.time.addEvent({  delay: 3000, callback: this.createBossBullet, callbackScope: this, loop: true }); // 보스 총알 발사 타이머 시작
    this.physics.add.overlap(this.playerBullets, this.boss, this.playerBulletHitBoss, null, this); // 플레이어 총알 vs 보스(boss 처리)
    this.physics.add.overlap(this.player, this.boss, this.bossHitPlayer, null, this); // 플레이어 vs 보스(player 처리)
  }

  showRevivePopup(isIncorrectAnswer = false) {
    if (this.isRevivePopupShown) return;
    this.isRevivePopupShown = true;
    if (this.isGameOver) this.soundManager.stopAll();
    this.soundManager.playSound('hitPlayerSound');
    const { width, height } = this.scale;
    const currentHitCount = this.player.hitCount || 0;
    const requiredWalkies = (currentHitCount * 2) + 1;
    const playerWalkies = parseInt(this.walkieText.text);
    const canRevive = playerWalkies >= requiredWalkies;

    // 반투명 배경 (딤 처리)
    this.createOverlay(45);
    const popupBg = this.add.image(width / 2, height / 2, 'revivePopup').setScale(0).setDepth(50).setAlpha(0);
    
    this.tweens.add({ targets: this.overlay, fillAlpha: 0.7, duration: 300, ease: 'Power2.out' }); // 배경 페이드인 애니메이션
    this.tweens.add({ targets: popupBg, scaleX: 1.6, scaleY: 1.6, alpha: 1, duration: 400, ease: 'Back.out', delay: 100 }); // 팝업 등장 애니메이션
    
    // 1. 텍스트
    const infoContainer = this.add.container(width / 2 + 20, height / 2 - 260).setDepth(51).setAlpha(0);
    const hitText = this.add.text(0, -30, isIncorrectAnswer ? '오답이에요!' : `${currentHitCount + 1}번째 충돌!`, {
      fontSize: '32px',
      fill: isIncorrectAnswer ? colorConfig.color_lollipop : colorConfig.color_chocolate, 
      fontFamily: 'Cafe24Surround',
      align: 'center'
    }).setOrigin(0.5);
    const walkieIcon = this.add.image(-110, -45, 'walkie').setScale(0.3).setOrigin(0.5);
    infoContainer.add([hitText, walkieIcon]);

    const infoText = this.add.text(width / 2, height / 2 + 10, `워키토키 ${requiredWalkies}개를 사용해 \n긴급 수리를\n요청할 수 있어요!`, {
      fontSize: '26px',
      fill: colorConfig.color_deepBlue,
      fontFamily: 'Cafe24Surround',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5).setDepth(51).setAlpha(0);

    // 텍스트들 페이드인 애니메이션
    this.tweens.add({ targets: [infoContainer, infoText], alpha: 1, duration: 300, ease: 'Power2.out', delay: 300 });

    // 수리하기 버튼과 끝내기 버튼
    const reviveButton = this.add.image(width / 2 - 70, height / 2 + 110, 'reviveButton').setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0.2);
    const endGameButton = this.add.image(width / 2 + 70, height / 2 + 110, 'endGameButton').setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0.2);

    // 버튼들 등장 애니메이션
    this.tweens.add({ targets: [reviveButton, endGameButton], alpha: 1, scaleX: 0.2, scaleY: 0.2, duration: 300, ease: 'Back.out', delay: 500 });
    
    if (canRevive) {
      this.soundManager.playSound('incorrectSound');
      this.repairSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 140, 'playerRepair').setDepth(52).setScale(1);
      this.repairSprite.play('playerRepairAni');
      addHoverEffect(reviveButton, this);
      reviveButton.on('pointerdown', () => {
        this.soundManager.playSound('buttonSound');
        this.walkieText.setText(playerWalkies - requiredWalkies); // 워키토키 차감
        // repair 횟수 증가
        const currentRepairCount = parseInt(this.repairText.text);
        this.repairText.setText(currentRepairCount + 1);
        // 팝업 제거
        this.removeOverlay();
        popupBg.destroy();
        infoContainer.destroy();
        infoText.destroy();
        reviveButton.destroy();
        endGameButton.destroy();
        this.game.canvas.style.cursor = 'default';
        this.showQuizPopup(); // 퀴즈 팝업 열기
        this.isRevivePopupShown = false;
      });
    } else {
      this.soundManager.playSound('gameOverSound');
      if (this.repairSprite) {
        this.repairSprite.destroy();
        this.repairSprite = null;
      }
      infoText.setText(`워키토키가 부족해\n수리가 불가능해요!`);
      const sadSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 140, 'playerSad').setDepth(52).setScale(1);
      sadSprite.play('playerSadAni');
      reviveButton.setTint(0x888888);
    }

    addHoverEffect(endGameButton, this);

    endGameButton.on('pointerdown', () => {
      this.removeOverlay();
      this.handleQuit();
      this.isRevivePopupShown = false;
    });
    this.game.canvas.style.cursor = 'default';
  }

  showQuizPopup() {
    if (this.repairSprite) {
      this.repairSprite.destroy();
      this.repairSprite = null;
    }
    const { width, height } = this.scale;
    const randomQuiz = this.quizData[Phaser.Math.Between(0, this.quizData.length - 1)]; // 랜덤 퀴즈 선택
    const quizContainer = this.add.image(width / 2, height / 2, 'quizContainer').setScale(0.7).setDepth(60).setAlpha(0);
    
    this.createOverlay(55);
    this.tweens.add({ targets: this.overlay, fillAlpha: 0.7, duration: 300, ease: 'Power2.out' });
    this.tweens.add({ targets: quizContainer, scaleX: 0.8, scaleY: 0.8, alpha: 1, duration: 400, ease: 'Back.out', delay: 100 });

    // 퀴즈 질문
    const questionText = this.add.text(width / 2, height / 2 - 70, randomQuiz.question, {
      fontSize: '28px',
      fill: colorConfig.color_lollipop,
      fontFamily: 'Cafe24Surround',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5).setDepth(61).setAlpha(0);
    
    this.tweens.add({ targets: questionText, alpha: 1, duration: 300, ease: 'Power2.out', delay: 300 }); // 텍스트들 페이드인 애니메이션
    
    const quizItemButtons = []; // 선택지 버튼들 생성
    const buttonSpacing = 160; // 버튼 간격
    const startX = width / 2 - ((randomQuiz.examples.length - 1) * buttonSpacing) / 2;
    
    randomQuiz.examples.forEach((example, index) => {
      const buttonX = startX + (index * buttonSpacing);
      const buttonY = height / 2 + 60;
      const buttonBg = this.add.image(buttonX, buttonY, 'quizItemBox').setOrigin(0.5).setDepth(61).setInteractive().setAlpha(0).setScale(0.5); // 배경 이미지
      
      let displayText = example;
      if (example.length > 4) { // 텍스트 길이에 따른 줄바꿈 처리
        const lines = [];
        for (let i = 0; i < example.length; i += 4) lines.push(example.substring(i, i + 4));
        displayText = lines.join('\n');
      }
      
      // 텍스트
      const buttonText = this.add.text(buttonX, buttonY, displayText, {
        fontSize: '50px',
        fill: '#333',
        fontFamily: 'Cafe24Surround',
        align: 'center',
        lineSpacing: 10 
      }).setOrigin(0.5).setDepth(62).setAlpha(0);
      
      // 버튼 그룹으로 관리
      quizItemButtons.push({ bg: buttonBg, text: buttonText });

      // 호버 효과
      buttonBg.on('pointerover', () => {
        buttonBg.setTint(0xcccccc);
        this.game.canvas.style.cursor = 'pointer';
      });

      buttonBg.on('pointerout', () => {
        buttonBg.clearTint();
        this.game.canvas.style.cursor = 'default';
      });

      buttonBg.on('pointerdown', () => { // 클릭 이벤트
        this.soundManager.playSound('buttonSound');
        this.handleQuizAnswer(example, randomQuiz.answer, { quizContainer, questionText, quizItemButtons });
      });
    });
    
    // 버튼들 등장 애니메이션
    quizItemButtons.forEach((button, index) => {
      this.tweens.add({ 
        targets: [button.bg, button.text], 
        alpha: 1, 
        scaleX: button.bg ? 0.5 : 1.5,
        scaleY: button.bg ? 0.5 : 1.5,
        duration: 300, 
        ease: 'Back.out', 
        delay: 500 + (index * 100)
      });
    });
  }

  handleQuizAnswer(selectedAnswer, correctAnswer, popupElements) {
    const isCorrect = selectedAnswer === correctAnswer;
    isCorrect ? this.correctAnswer() : this.incorrectAnswer();
    
    Object.values(popupElements).forEach(element => { // 퀴즈 팝업 제거
      if (Array.isArray(element)) {
        element.forEach(btn => {
          if (btn.bg && btn.text) {
            btn.bg.destroy();
            btn.text.destroy();
          } else if (btn.destroy) {
            btn.destroy();
          }
        });
      } else {
        element.destroy();
      }
    });
    
    this.game.canvas.style.cursor = 'default';
  }

  correctAnswer() {
    this.soundManager.playSound('correctSound');
    const danceSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'playerDance').setDepth(70).setScale(1.2);
    danceSprite.play('playerDanceAni');
    const successText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 200, '정답입니다!', {
      fontSize: '40px',
      fill: colorConfig.color_lollipop,
      fontFamily: 'Cafe24Surround',
      align: 'center'
    }).setOrigin(0.5).setDepth(70);
    
    this.time.delayedCall(2000, () => {
      successText.destroy();
      danceSprite.destroy();
      const currentHitCount = this.player.hitCount || 0;
      this.player.hitCount = currentHitCount + 1;
      this.player.setTexture('player');
      if (this.isBossShown) this.player.y += 400;
      this.removeOverlay();
      this.gameResume();
      
      // 장애물 타이머가 없으면 다시 시작
      if (!this.obstacleTimer && !this.isBossShown) {
        this.startObstacleTimer();
      }
    });
  }

  incorrectAnswer() {
    this.player.hitCount = (this.player.hitCount || 0) + 1;
    this.showRevivePopup(true);
  }

  nextLevel() {
    if (this.isGameOver || this.isPaused) return;
    this.sound.stopAll();
    this.level++;

    this.backgroundSpeed = 426 * (1 + (this.level - 1) * 0.12); // 12%씩 증가
    this.obstacleSpeed = 426 * (1 + (this.level - 1) * 0.12);
    
    if (this.level > 10) {
      this.showGameComplete();
      return;
    }
    
    this.updateLevelProgressBar();

    // 게임 상태 초기화 (거리, 점수, 워키토키, 수리 횟수는 유지)
    this.isBossShown = false;
    this.obstacleCount = 0;
    this.currentObstacleType = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.playerShake = 0;
    
    // 모든 게임 객체 제거
    this.obstacles.clear(true, true);
    this.coins.clear(true, true);
    this.shields.clear(true, true);
    this.doubles.clear(true, true);
    this.walkies.clear(true, true);
    this.bossBullets.clear(true, true);
    this.playerBullets.clear(true, true);
    
    // 플레이어 상태 초기화
    this.player.setTexture('player');
    this.tweens.add({
      targets: this.player,
      x: 360,
      y: 1120,
      duration: 1000,
      ease: 'Power2'
    });
    this.player.setVelocity(0, 0);
    if (this.player.shieldOverlay) {
      this.player.shieldOverlay.destroy();
      this.player.shieldOverlay = null;
    }
    
    // 타이머들 정리 및 재설정
    if (this.doubleTimer) {
      this.doubleTimer.destroy();
      this.doubleTimer = null;
    }
    if (this.bulletTimer) {
      this.bulletTimer.destroy();
    }
    if (this.bossBulletTimer) {
      this.bossBulletTimer.destroy();
      this.bossBulletTimer = null;
    }
    
    // UI 정리
    this.removeDoubleTimerUI();
    this.removeBossHealthUI();
    
    // 기본 총알 타이머 재설정
    this.bulletTimer = this.time.addEvent({
      delay: 500,
      callback: () => {
      if (this.isGameOver || this.isInvincible) return;
        const bullet = this.playerBullets.get(this.player.x, this.player.y - 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocityY(-600);
        }
      },
      loop: true
    });

    // 레벨업 알림 표시
    this.showLevelUpNotification();
    this.gamePause();

    // 2초 후 게임 재개
    this.time.delayedCall(2000, () => {
      this.gameResume();
      this.soundManager.setBGM('bgm');
      // 장애물 타이머 재시작
      if (!this.obstacleTimer) {
        this.startObstacleTimer();
      }
    });    
  }

  showLevelUpNotification() {
    this.soundManager.playSound('explosionSound');

    const { width, height } = this.scale;
    const nextContainer = this.add.image(width / 2, height / 2, 'nextContainer').setScale(0).setDepth(20).setAlpha(0);
    const levelText = this.add.text(width / 2, height / 2 + 50, `Level ${this.level}`, {
      fontSize: '45px',
      fill: colorConfig.color_lollipop,
      fontFamily: 'Cafe24Surround',
      align: 'center'
    }).setOrigin(0.5).setDepth(21).setAlpha(0);

    // 팝업 등장 애니메이션
    this.tweens.add({
      targets: [nextContainer, levelText],
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 500,
      ease: 'Back.out'
    });

    this.createOverlay(19);
    this.tweens.add({ targets: this.overlay, fillAlpha: 0.7, duration: 300, ease: 'Power2.out' });

    // 2초 후 팝업 제거 애니메이션
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [nextContainer, levelText],
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 300,
        ease: 'Back.in',
        onComplete: () => {
          nextContainer.destroy();
          levelText.destroy();
          this.removeOverlay();
        }
      });
    });
  }

  showGameComplete() {
    this.soundManager.setBGM('finalSound');
    const { width, height } = this.scale;

    const finishBg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'finishBackground').setDepth(80).setAlpha(0);

    const finalScoreText = this.add.text(width / 2, height / 2 + 60, `최종 점수: ${this.score}`, {
      fontSize: '36px',
      fill: colorConfig.color_chocolate,
      fontFamily: 'Cafe24Surround',
      align: 'center',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(81).setAlpha(0);

    const menuButton = this.add.image(width / 2, height - 80, 'goHomeButton').setOrigin(0.5).setDepth(81).setInteractive().setAlpha(0).setScale(0.3);
    addHoverEffect(menuButton, this);

    this.tweens.add({
      targets: [finishBg, finalScoreText, menuButton],
      alpha: 1,
      duration: 500,
      ease: 'Power2.out',
      delay: 200
    });

    menuButton.on('pointerdown', () => this.handleQuit()); // 버튼 클릭 시 메인 메뉴로 이동
  }

  // ------------------------------------------------------------------------------- 일시정지 메뉴
  showPauseMenu() {
    const { width, height } = this.scale;
    
    // 딤 처리 배경
    this.pauseOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setDepth(100)
      .setInteractive();
    
    // 다시 시작 버튼
    this.resumeButton = this.add.image(width / 2 - 140, height / 2 + 20, 'replayButton')
      .setScale(0.3)
      .setDepth(101)
      .setInteractive();
    addHoverEffect(this.resumeButton, this);
    this.resumeButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.playButton.setVisible(false);
      this.pauseButton.setVisible(true);
      this.gameResume();
    });
    
    // 끝내기 버튼
    this.quitButton = this.add.image(width / 2 + 140, height / 2 + 20, 'goHomeButton')
      .setScale(0.3)
      .setDepth(101)
      .setInteractive();
    addHoverEffect(this.quitButton, this);
    this.quitButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.hidePauseMenu();
      this.handleQuit();
    });
    
    // 버튼들 등장 애니메이션
    this.resumeButton.setAlpha(0).setScale(0);
    this.quitButton.setAlpha(0).setScale(0);
    
    this.tweens.add({
      targets: [this.resumeButton, this.quitButton],
      alpha: 1,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 400,
      ease: 'Back.out',
      delay: 200
    });
  }
  
  hidePauseMenu() {
    if (this.pauseOverlay) {
      this.pauseOverlay.destroy();
      this.pauseOverlay = null;
    }
    if (this.pauseText) {
      this.pauseText.destroy();
      this.pauseText = null;
    }
    if (this.resumeButton) {
      this.resumeButton.destroy();
      this.resumeButton = null;
    }
    if (this.quitButton) {
      this.quitButton.destroy();
      this.quitButton = null;
    }
    this.game.canvas.style.cursor = 'default';
  }
  
  // ------------------------------------------------------------------------------- 기본
  handleQuit() { // 게임 끝내기
    this.soundManager.playSound('buttonSound');

    // 모든 타이머 정리
    if (this.obstacleTimer) {
      this.obstacleTimer.destroy();
      this.obstacleTimer = null;
    }
    if (this.bulletTimer) {
      this.bulletTimer.destroy();
      this.bulletTimer = null;
    }
    if (this.doubleTimer) {
      this.doubleTimer.destroy();
      this.doubleTimer = null;
    }
    if (this.bossBulletTimer) {
      this.bossBulletTimer.destroy();
      this.bossBulletTimer = null;
    }

    // 모든 게임 오브젝트 그룹 정리
    if (this.obstacles) {
      this.obstacles.clear(true, true);
      this.obstacles = null;
    }
    if (this.coins) {
      this.coins.clear(true, true);
      this.coins = null;
    }
    if (this.shields) {
      this.shields.clear(true, true);
      this.shields = null;
    }
    if (this.doubles) {
      this.doubles.clear(true, true);
      this.doubles = null;
    }
    if (this.walkies) {
      this.walkies.clear(true, true);
      this.walkies = null;
    }
    if (this.playerBullets) {
      this.playerBullets.clear(true, true);
      this.playerBullets = null;
    }
    if (this.bossBullets) {
      this.bossBullets.clear(true, true);
      this.bossBullets = null;
    }

    // 보스 정리
    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }

    // 플레이어 쉴드 오버레이 정리
    if (this.player && this.player.shieldOverlay) {
      this.player.shieldOverlay.destroy();
      this.player.shieldOverlay = null;
    }

    // UI 요소들 정리
    this.removeDoubleTimerUI();
    this.removeBossHealthUI();
    this.removeOverlay();
    this.hidePauseMenu();

    // 레벨 진행 바 정리
    if (this.levelBarBg) {
      this.levelBarBg.destroy();
      this.levelBarBg = null;
    }
    if (this.levelBar) {
      this.levelBar.destroy();
      this.levelBar = null;
    }
    if (this.levelBarText) {
      this.levelBarText.destroy();
      this.levelBarText = null;
    }

    // 버튼들 정리
    if (this.playButton) {
      this.playButton.destroy();
      this.playButton = null;
    }
    if (this.pauseButton) {
      this.pauseButton.destroy();
      this.pauseButton = null;
    }

    // 수리 스프라이트 정리
    if (this.repairSprite) {
      this.repairSprite.destroy();
      this.repairSprite = null;
    }

    // 모든 트윈 정지
    this.tweens.killAll();
    
    // 모든 사운드 정지
    this.sound.stopAll();
    
    // 물리 엔진 정지
    this.physics.pause();
    
    // 씬 전환
    this.scene.stop('GameScene'); 
    this.scene.start('MenuScene');
    this.game.canvas.style.cursor = 'default';
    
    // 모든 변수 초기화
    this.isPaused = false;
    this.isGameOver = false;
    this.isBossShown = false;
    this.isRevivePopupShown = false;
    this.isInvincible = false;
    this.isDragging = false;
    this.obstacleCount = 0;
    this.currentObstacleType = 0;
    this.distance = 0;
    this.score = 0;
    this.level = 1;
    this.playerShake = 0;
    this.dragOffsetX = 0;
    this.backgroundSpeed = 426;
    this.obstacleSpeed = 426;
    this.maxObstacles = 30;
    
    // 텍스트 객체들 초기화
    this.scoreText = null;
    this.distanceText = null;
    this.walkieText = null;
    this.repairText = null;
    this.gameOverText = null;
    
    // 기타 객체들 초기화
    this.player = null;
    this.background = null;
    this.cursors = null;
    this.overlay = null;
    this.quizData = null;
    this.soundManager = null;
  }
}