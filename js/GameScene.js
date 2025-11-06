import SoundManager from './SoundManager.js';
import { colorConfig, levelConfig, FONT_FAMILY } from './Main.js';
import {  addHoverEffect,  createScaleInAni,  createFadeInAni,  createOverlay,  removeOverlay, createTextEffectAni, createWarningAni, createCustomAni, destroyElement } from './utils.js';
import { OBSTACLE_CONFIGS, getObstacleConfig, getObstacleConfigByType } from './ObstacleConfig.js';
import { executeBossPattern, getRandomPatternForLevel } from './BossPatterns.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    // 화면 및 기본
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.background = null;
    this.backgroundSpeed = 426;
    this.cursors = null;
    this.quizData = null; 
    this.overlay = null;
    this.soundManager = null;

    // 플레이어
    this.player = null;
    this.playerBullets = null;
    this.playerShake = 0;
    this.bulletTime = null;
    this.doubleTime = null;

    // 보스
    this.boss = null;
    this.bossBullets = null; 
    this.bossBulletTime = null; 
    this.bossHealthBg = null;
    this.bossBarBg = null;
    this.bossBar = null;

    // 장애물
    this.obstacles = null;
    this.obstacleSpeed = 426;
    this.obstacleTime = null;
    this.obstacleType = 0;
    this.obstacleNum = 0;
    this.maxObstacles = 30; // 최대 장애물 개수
    
    // 게임 상태
    this.score = 0;
    this.distance = 0;
    this.level = 1;
    this.maxLevel = 10;
    this.walkies = null;
    this.repairSprite = null;

    // 플래그들
    this.isGameOver = false;
    this.isPaused = false;
    this.isBossShown = false;
    this.isInvincible = false; // 쉴드 벗겨진 후 무적 상태
    this.isRevivePopupShown = false; // 충돌 팝업 중복 방지

    // UI 요소들
    this.scoreUI = null;
    this.distanceUI = null;
    this.walkieUI = null;
    this.repairUI = null;
    this.levelBg = null;
    this.levelBar = null;
    this.levelText = null;

    this.isDragging = false;
    this.dragOffsetX = 0;
  }

  // ------------------------------------------------------------------------------------
  // CREATE
  // ------------------------------------------------------------------------------------
  create(data) {
    this.initScreen();
    this.initSound();
    this.initQuiz(data);
    this.createGameObjects();
    this.setCollisions();
    this.setInput();
    this.setTimers();
    this.setUI();
  }

  initScreen() {
    const { width, height } = this.scale;
    this.screenWidth = width;
    this.screenHeight = height;
  }

  initSound() {
    this.soundManager = SoundManager.getInstance(this);
    this.soundManager.createSoundButtons();
    this.soundManager.setBGM('bgm');
  }

  initQuiz(data) {
    this.quizData = data?.quizData || []; // 퀴즈 데이터 초기화
    this.isGameOver = false;
  }

  createGameObjects() {
    this.background = this.add.tileSprite(360, 640, 720, 1280, 'background'); // 배경 생성
    this.player = this.physics.add.sprite(360, 1120, 'player').setScale(0.3); // 플레이어 생성
    this.player.body.setSize(this.player.width * 0.9, this.player.height * 0.9);
    this.player.setCollideWorldBounds(true);
    this.playerBullets = this.physics.add.group({defaultKey: 'playerBullet'}); // 플레이어 총알
    this.bossBullets = this.physics.add.group({defaultKey: 'bossBullet'}); // 보스 총알 그룹 생성
    this.obstacles = this.physics.add.group(); // 장애물 그룹 생성
    this.coins = this.physics.add.group(); // 코인 그룹 생성
    this.shields = this.physics.add.group(); // shield 그룹 생성
    this.doubles = this.physics.add.group(); // double 그룹 생성
    this.walkies = this.physics.add.group(); // walkie 그룹 생성 추가
  }

  setCollisions() {
    this.physics.add.overlap(this.player, this.obstacles, this.playerHitObstacle, null, this); // player vs obstacle 충돌 처리
    this.physics.add.overlap(this.player, this.bossBullets, this.bossBulletHitPlayer, null, this); // player vs boss bullet 충돌 처리
    this.physics.add.overlap(this.playerBullets, this.obstacles, this.playerBulletHitObstacle, null, this); // playerBullet vs obstacle 충돌 처리
    
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this); // player vs coin 충돌 처리
    this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this); // player vs shield 충돌 처리
    this.physics.add.overlap(this.player, this.doubles, this.collectDouble, null, this); // player vs double 충돌 처리
    this.physics.add.overlap(this.player, this.walkies, this.collectWalkie, null, this); // player vs walkie 충돌 처리
  }

  setInput() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // 모바일/PC 드래그 이벤트 등록
    this.input.on('pointerdown', (pointer) => {
      if (this.player && Phaser.Math.Distance.Between(pointer.x, pointer.y, this.player.x, this.player.y) < 150) {
        this.isDragging = true;
        this.dragOffsetX = this.player.x - pointer.x;
      }
    });
    this.input.on('pointerup', () => this.isDragging = false);
    this.input.on('pointermove', (pointer) => {
      if (this.isDragging) {
        if (this.isBossShown) { // 보스 등장 후: x, y 모두 이동
          let newX = pointer.x + this.dragOffsetX;
          let newY = pointer.y;
          // 화면 경계 체크
          newX = Math.max(150, Math.min(newX, this.screenWidth - 150));
          newY = Math.max(150, Math.min(newY, this.screenHeight - 150));
          this.player.x = newX;
          this.player.y = newY;
        } else { // 보스 등장 전: x만 이동
          let newX = pointer.x + this.dragOffsetX;
          newX = Math.max(150, Math.min(newX, this.screenWidth - 150));
          this.player.x = newX;
        }
      }
    });
  }

  setTimers() {
    this.createObstacleTimer();
    this.createBulletTimer();
  }

  setUI() {
    this.createButtons(); // 게임 재생 / 정지 버튼 생성
    this.createGameUI(); // 게임 UI 생성
  }

  createGameUI() { // 게임 UI 생성
    const uiConfigs = [
      { name: 'score', x: 100, y: 50, iconKey: 'coin', iconScale: 0.2, initialValue: '0', textColor: colorConfig.color_black, animation: 'coinAni', textProperty: 'scoreUI'},
      { name: 'distance', x: 100, y: 120, iconKey: 'distance', iconScale: 0.2, initialValue: '0m', textColor: colorConfig.color_black, animation: 'distanceAni', textProperty: 'distanceUI' },
      { name: 'walkie', x: 100, y: this.screenHeight - 40, iconKey: 'walkie', iconScale: 0.2, initialValue: '3', textColor: colorConfig.color_black, textProperty: 'walkieUI' },
      { name: 'repair', x: 260, y: this.screenHeight - 40, iconKey: 'repair', iconScale: 0.15, initialValue: '0', textColor: colorConfig.color_black, textProperty: 'repairUI' }
    ];

    uiConfigs.forEach(config => { // UI 요소 생성
      const uiElement = this.createUIElement(config);
      this[config.textProperty] = uiElement.text;
    });

    this.createLevelProgressBar(); // 레벨 진행 바 생성
  }

  createUIElement(config) {
    const container = this.add.container(config.x, config.y).setDepth(20);
    const bg = this.add.graphics().fillStyle(colorConfig.hex_snow, 0.6).fillRoundedRect(-70, -28, 140, 56, 20);
    const hasAnimation = config.animation !== undefined;
    const icon = hasAnimation ? this.add.sprite(-35, 0, config.iconKey) : this.add.image(-35, 0, config.iconKey);
    
    icon.setScale(config.iconScale);
    if (hasAnimation) icon.play(config.animation);
    const text = this.add.text(20, 0, config.initialValue, { fontSize: '24px', fill: config.textColor, fontFamily: FONT_FAMILY }).setOrigin(0.5);

    container.add([bg, icon, text]);

    return { container, icon, text };
  }

  createLevelProgressBar() {
    const barWidth = 350;
    const barHeight = 30;
    const barX = (this.screenWidth - barWidth) / 2;
    const barY = 24;

    this.levelBg = this.add.graphics();
    this.levelBg.fillStyle(colorConfig.hex_snow, 0.6).fillRoundedRect(barX, barY, barWidth, barHeight, 12).setDepth(30);

    this.levelBar = this.add.graphics();
    this.levelBar.setDepth(31);
    this.updateLevelProgressBar();

    this.levelText = this.add.text(this.screenWidth / 2, barY + barHeight / 2, `Level ${this.level}`, {
      fontSize: '20px',
      fill: colorConfig.color_black,
      fontFamily: FONT_FAMILY,
    }).setOrigin(0.5).setDepth(32);
  }

  updateLevelProgressBar() {
    if (!this.levelBar) return;
    const barWidth = 350;
    const barHeight = 30;
    const barX = (this.screenWidth - barWidth) / 2;
    const barY = 24;
    const progress = Math.min(this.level, 10) / 10;

    this.levelBar.clear();
    this.levelBar.fillStyle(colorConfig.hex_mint, 1);
    this.levelBar.fillRoundedRect(barX, barY, barWidth * progress, barHeight, 12);

    if (this.levelText) this.levelText.setText(`Level ${this.level}`);
  }

  createButtons() {
    this.playButton = this.add.image(this.screenWidth - 50, 50, 'playButton').setScale(0.2).setDepth(40).setVisible(false).setInteractive(); // 게임 재생 버튼
    this.playButton.on('pointerdown', () => {
      this.playButton.setVisible(false);
      this.pauseButton.setVisible(true);
      this.gameResume();
    });

    this.pauseButton = this.add.image(this.screenWidth - 50, 50, 'pauseButton').setScale(0.2).setDepth(40).setVisible(true).setInteractive(); // 게임 일시정지 버튼
    addHoverEffect(this.pauseButton, this);
    this.pauseButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.pauseButton.setVisible(false);
      this.playButton.setVisible(true);
      this.gamePause();
      this.showPauseMenu(); // 일시정지 UI 표시
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
    if (this.bulletTime) this.bulletTime.paused = true;
    if (this.obstacleTime) this.obstacleTime.paused = true;
    if (this.doubleTime) this.doubleTime.paused = true;
    if (this.bossBulletTime) this.bossBulletTime.paused = true;
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
    if (this.bulletTime) this.bulletTime.paused = false;
    if (this.obstacleTime) this.obstacleTime.paused = false;
    if (this.doubleTime) this.doubleTime.paused = false;
    if (this.bossBulletTime) this.bossBulletTime.paused = false;
    
    // 일시정지 UI 제거
    this.hidePauseMenu();
  }

  showPauseMenu() {
    this.pauseOverlay = createOverlay(this, 100);
    createCustomAni(this, this.pauseOverlay, { type: 'fillAlpha', to: 1 });

    // 다시 시작 버튼
    this.resumeButton = this.add.image(this.screenWidth / 2 - 140, this.screenHeight / 2 + 20, 'replayButton')
      .setScale(0)
      .setAlpha(0)
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
    this.quitButton = this.add.image(this.screenWidth / 2 + 140, this.screenHeight / 2 + 20, 'goHomeButton')
      .setScale(0)
      .setAlpha(0)
      .setDepth(101)
      .setInteractive();
    addHoverEffect(this.quitButton, this);
    this.quitButton.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      this.hidePauseMenu();
      this.handleQuit();
    });
    
    // 버튼들 등장 애니메이션 - utils 함수 사용
    createScaleInAni(this, [this.resumeButton, this.quitButton], 0.3, { delay: 200 });
  }
  
  hidePauseMenu() {
    this.pauseOverlay = destroyElement(this.pauseOverlay);
    this.resumeButton = destroyElement(this.resumeButton);
    this.quitButton = destroyElement(this.quitButton);
    this.game.canvas.style.cursor = 'default';
  }

  createObstacle() {
    if (this.isGameOver || this.isPaused || this.obstacleNum >= this.maxObstacles) {
      if (this.obstacleNum >= this.maxObstacles && this.obstacleTime) {
        this.obstacleTime.destroy();
        this.obstacleTime = null;
      }
      return;
    }

    this.obstacleType = (this.obstacleType + 1) % 3;
    const config = getObstacleConfigByType(this.obstacleType);
    
    if (config.key === 'obstacle1') { // obstacle1(뱀)의 경우 레벨별 여러 개 생성
      const spawnCount = levelConfig[this.level].obstacleNum;
      const spacing = 220; 
      const totalWidth = (spawnCount - 1) * spacing;
      const startX = (720 - totalWidth) / 2;
      
      for (let i = 0; i < spawnCount; i++) {
        let x = startX + (i * spacing);
        x = Math.max(config.margin, Math.min(x, 720 - config.margin));
        const obstacle = this.obstacles.create(x, -100, config.key);
        this.setupObstacle(obstacle, config);
      }
      this.obstacleNum++;
    } else { // 다른 장애물들은 1개씩 생성
      const x = Phaser.Math.Between(config.margin, 720 - config.margin);
      const obstacle = this.obstacles.create(x, -100, config.key);
      this.setupObstacle(obstacle, config);
      this.obstacleNum++;
    }
  }

  setupObstacle(obstacle, config) {
    obstacle.originalType = config.key;
    obstacle.configKey = Object.keys(OBSTACLE_CONFIGS).find(key => OBSTACLE_CONFIGS[key].key === config.key);
    obstacle.setScale(config.scale);
    obstacle.setSize(obstacle.width * 0.9, obstacle.height * 0.9);
    obstacle.setVelocityY(this.obstacleSpeed);
    if (config.animation) obstacle.play(config.animation);
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
  
    if (this.obstacleTime) {
      this.obstacleTime.remove();
      this.obstacleTime = null; 
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
      fontFamily: FONT_FAMILY, 
      fontSize: '20px', 
      fontStyle: 'bold', 
      fill: colorConfig.color_lollipop, 
      stroke: colorConfig.color_snow, 
      strokeThickness: 4 
    });

    this.time.delayedCall(500, () => hitText.destroy());

    // 설정 기반 장애물 처리
    const config = getObstacleConfig(obstacle.originalType);
    if (!config) return;

    if (obstacle.hitCount === 1) {
      config.onFirstHit(obstacle);
    } else if (obstacle.hitCount >= config.hitCount) {
      config.onSecondHit(obstacle, this);
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
    this.scoreUI.setText(this.score);
    
    const collectText = this.add.text(coin.x, coin.y - 30, '+10', {
      fontFamily: FONT_FAMILY, 
      fontSize: '20px', 
      fontStyle: 'bold', 
      fill: colorConfig.color_lollipop, 
      stroke: colorConfig.color_snow, 
      strokeThickness: 4 
    });
    
    createTextEffectAni(this, collectText);
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
    
    if (this.doubleTime) this.doubleTime.destroy();
    if (this.bulletTime) this.bulletTime.destroy();

    // 더블 효과 UI 생성
    this.createDoubleTimerUI();

    this.bulletTime = this.time.addEvent({
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

    this.doubleTime = this.time.delayedCall(20000, () => { // 새로운 20초 타이머 시작
      if (this.bulletTime) {
        this.bulletTime.destroy();
      }
      
      this.removeDoubleTimerUI(); // 더블 UI 제거
      
      this.bulletTime = this.time.addEvent({ // 원래 단일 총알 타이머 복구
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
      
      this.doubleTime = null; // 타이머 초기화
    });
  }

  collectWalkie(player, walkie) { // 워키토키 수집
    walkie.destroy();
    
    // 워키토키 개수 증가
    const currentCount = parseInt(this.walkieUI.text);
    this.walkieUI.setText(currentCount + 1);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------
  async update(time, delta) {
    if (this.isGameOver || this.isPaused || this.level > this.maxLevel) return;

    this.updateBackground(delta);
    
    if (this.isDragging) {
      this.handleDragMode(delta);
      return;
    }

    this.handleBossSpawn();
    this.handlePlayerMovement();
    this.updateGameElements(delta);
    this.cleanupObjects();
    this.updateUI();
  }

  updateBackground(delta) {
    if (!this.isPaused && !this.isGameOver && !this.isBossShown) {
      this.background.tilePositionY -= this.backgroundSpeed * (delta / 1000);
    }
  }

  handleDragMode(delta) {
    this.player.setVelocityX(0);
    this.updateAttachedElements();
    this.updateDistance(delta);
    this.updateSnakeMovement();
    if (this.boss && this.boss.active) this.updateBossHealthUI();
  }

  updateAttachedElements() {
    if (this.player && this.player.shieldOverlay) {
      this.player.shieldOverlay.x = this.player.x;
      this.player.shieldOverlay.y = this.player.y;
    }

    if (this.player && this.doubleTimerBar) {
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
      this.updateDoubleTimerUI();
    }
  }

  updateDistance(delta) {
    const targetBossDistance = levelConfig[this.level].bossDistance / 100;
    const shouldStopDistance = this.distance >= targetBossDistance;
    
    if (!this.isBossShown && !shouldStopDistance) {
      this.distance += delta / 1000;
      this.distanceUI.setText(`${Math.floor(this.distance)}m`);
    }
  }

  updateSnakeMovement() {
    this.obstacles.children.entries.forEach((obstacle) => {
      const config = getObstacleConfig(obstacle.originalType);
      if (config && config.behavior.type === 'wave' && !obstacle.isHit) {
        const { amplitude, frequency, offset } = config.behavior;
        const newX = obstacle.x + Math.sin(Date.now() / frequency + obstacle.y / offset) * amplitude;
        const obstacleHalfWidth = obstacle.width * obstacle.scaleX * 0.5;
        const minX = 150 + obstacleHalfWidth;
        const maxX = this.scale.width - 150 - obstacleHalfWidth;
        if (newX >= minX && newX <= maxX) obstacle.setX(newX);
      }
    });
  }

  handleBossSpawn() {
    const targetBossDistance = levelConfig[this.level].bossDistance / 100;
    const shouldStopDistance = this.distance >= targetBossDistance;
    const allObstaclesCleared = this.obstacles.children.entries.length === 0;
    const allObstaclesSpawned = this.obstacleNum >= this.maxObstacles;
    
    if (allObstaclesSpawned && allObstaclesCleared && shouldStopDistance && !this.isGameOver && !this.isBossShown) {
      this.triggerBossAppearance();
      return;
    }

    // 보스 위치 조정
    if (this.boss && this.boss.active) {
      const bossTargetY = 250;
      if (this.boss.y >= bossTargetY - 5) {
        this.boss.y = bossTargetY;
        this.boss.setVelocityY(0);
      }
    }
  }

  triggerBossAppearance() {
    this.isBossShown = true;
    this.sound.stopAll();
    this.soundManager.setBGM('bossBgm');

    const warningHeight = this.scale.height * 0.3;
    const warningOverlay = this.add.graphics({ x: 0, y: 0 }).setDepth(100);
    
    for (let i = 0; i < warningHeight; i += 4) {
      const alpha = 0.7 * (1 - i / warningHeight);
      warningOverlay.fillStyle(colorConfig.hex_lollipop, alpha);
      warningOverlay.fillRect(0, i, this.scale.width, 4);
    }

    createWarningAni(this, warningOverlay);
    this.time.delayedCall(1000, () => {
      warningOverlay.destroy();
      this.showBoss();
    });
  }

  handlePlayerMovement() {
    const speed = 540;
    const margin = 150;

    if (this.isBossShown) { // 보스 모드: X, Y 모두 이동 가능
      if (this.cursors.left.isDown && this.player.x > margin) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown && this.player.x < this.screenWidth - margin) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
      }
      
      if (this.cursors.up.isDown && this.player.y > margin) {
        this.player.setVelocityY(-speed);
      } else if (this.cursors.down.isDown && this.player.y < this.screenHeight - margin) {
        this.player.setVelocityY(speed);
      } else {
        this.player.setVelocityY(0);
      }
    } else { // 일반 모드: X축만 이동 가능
      if (this.cursors.left.isDown && this.player.x > margin) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown && this.player.x < this.screenWidth - margin) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
        this.playerShake = 3;
      }
    }
    
    this.updateAttachedElements(); // 공통 처리
    if (this.playerShake > 0) this.player.y += Math.sin(Date.now() / 40) * 2; // 플레이어 흔들림 효과
  }

  updateGameElements(delta) {
    this.updateDistance(delta);
    this.updateSnakeMovement();
  }

  cleanupObjects() {
    const screenBounds = { top: -50, bottom: 1330 };
    this.playerBullets.children.entries.forEach((bullet) => (bullet.y < screenBounds.top) && bullet.destroy());
    this.bossBullets.children.entries.forEach((bullet) => (bullet.y > screenBounds.bottom) && bullet.destroy());
    this.obstacles.children.entries.forEach((obstacle) => (obstacle.y > screenBounds.bottom) && obstacle.destroy());
    [this.coins, this.shields].forEach(group => group.children.entries.forEach((item) => (item.y > screenBounds.bottom) && item.destroy()));
  }

  updateUI() {
    this.updateDoubleTimerUI();
    if (this.boss && this.boss.active) this.updateBossHealthUI();
  }

  updateDoubleTimerUI() {
    if (!this.doubleTimerBg || !this.player || !this.doubleCountdownText) return;

    const elapsed = this.time.now - this.doubleStartTime;
    const remaining = Math.max(0, this.doubleDuration - elapsed);
    const countdown = Math.ceil(remaining / 1000);

    const playerX = this.player.x;
    const playerY = this.player.y - 80;

    this.doubleTimerBg.x = playerX;
    this.doubleTimerBg.y = playerY;
    this.doubleCountdownText.x = playerX;
    this.doubleCountdownText.y = playerY;
    this.doubleCountdownText.setText(countdown.toString());
    
    if (countdown <= 5) {
      this.doubleCountdownText.setFill(colorConfig.color_lollipop); 
    } else if (countdown <= 10) {
      this.doubleCountdownText.setFill(colorConfig.color_candy); 
    } else {
      this.doubleCountdownText.setFill(colorConfig.color_snow); 
    }
    
    if (countdown <= 0) this.removeDoubleTimerUI();
  }

  createDoubleTimerUI() {
    this.removeDoubleTimerUI();
    
    this.doubleTimerBg = this.add.graphics();
    this.doubleTimerBg.fillStyle(colorConfig.hex_black, 0.7);
    this.doubleTimerBg.fillCircle(0, 0, 35);
    this.doubleTimerBg.setDepth(10);

    this.doubleCountdownText = this.add.text(0, 0, '20', {
      fontSize: '28px',
      fill: colorConfig.color_snow,
      fontFamily: FONT_FAMILY,
      stroke: colorConfig.color_deepBlue,
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(12);

    this.doubleStartTime = this.time.now;
    this.doubleDuration = 20000; // 20초
  }

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

  updateBossHealthUI() {
    if (!this.bossBar || !this.boss) return;

    const maxHealth = levelConfig[this.level].bossHit;
    const currentHealth = Math.max(0, maxHealth - this.boss.hitCount);
    const progress = currentHealth / maxHealth;

    const bossX = this.boss.x;
    const bossY = this.boss.y - 160;

    this.bossHealthBg.x = bossX;
    this.bossHealthBg.y = bossY;
    this.bossBarBg.x = bossX;
    this.bossBarBg.y = bossY;
    this.bossBar.x = bossX;
    this.bossBar.y = bossY;

    this.bossBar.clear();
    
    let color = colorConfig.hex_greenTea;
    if (progress < 0.3) {
      color = colorConfig.hex_lollipop;
    } else if (progress < 0.6) {
      color = colorConfig.hex_candy;
    }
    
    this.bossBar.fillStyle(color, 1);
    const barWidth = 200 * progress; 
    this.bossBar.fillRoundedRect(-100, -10, barWidth, 20, 10);
  }

  createBossHealthUI() {
    this.removeBossHealthUI();
    
    this.bossHealthBg = this.add.graphics();
    this.bossHealthBg.fillStyle(colorConfig.hex_black, 0.7);
    this.bossHealthBg.fillRoundedRect(-110, -20, 220, 40, 15);
    this.bossHealthBg.setDepth(15);

    this.bossBarBg = this.add.graphics();
    this.bossBarBg.fillStyle(colorConfig.hex_black, 0.7);
    this.bossBarBg.fillRoundedRect(-100, -10, 200, 20, 10);
    this.bossBarBg.setDepth(16);

    // 체력 바
    this.bossBar = this.add.graphics();
    this.bossBar.setDepth(17);
  }

  removeBossHealthUI() {
    if (this.bossHealthBg) {
      this.bossHealthBg.destroy();
      this.bossHealthBg = null;
    }
    if (this.bossBarBg) {
      this.bossBarBg.destroy();
      this.bossBarBg = null;
    }
    if (this.bossBar) {
      this.bossBar.destroy();
      this.bossBar = null;
    }
  }

  createBossBullet() {
    if (!this.boss || !this.boss.active || this.isGameOver || this.isPaused) return;

    const patternName = getRandomPatternForLevel(this.level);
    executeBossPattern(this, patternName);
    this.soundManager.playSound('bossShootSound');
  }

  defeatBoss(boss) { 
    if (this.bossBulletTime) {
      this.bossBulletTime.destroy();
      this.bossBulletTime = null;
    }
    
    this.removeBossHealthUI(); 
    
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

  createObstacleTimer() {
    this.obstacleTime = this.time.addEvent({ delay: 1000, callback: this.createObstacle, callbackScope: this, loop: true });
  }

  createBulletTimer() {
    this.bulletTime = this.time.addEvent({
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
}

  showBoss() { 
    this.boss = this.physics.add.sprite(this.scale.width / 2, -100, 'boss1');
    this.boss.type = 'boss1';
    this.boss.body.setSize(this.boss.width * 0.8, this.boss.height * 0.8);
    this.boss.setScale(0.4);
    this.boss.hitCount = 0;
    this.createBossHealthUI();

    const bossEndY = 250;
    const bossMoveDuration = 3500;
    const bossSwingAmplitude = 120; 
    const bossSwingDuration = 900; 

    this.tweens.add({ targets: this.boss, y: bossEndY, duration: bossMoveDuration, ease: 'Sine.easeInOut' });
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
    
    this.bossBulletTime = this.time.addEvent({  delay: 3000, callback: this.createBossBullet, callbackScope: this, loop: true }); // 보스 총알 발사 타이머 시작
    this.physics.add.overlap(this.playerBullets, this.boss, this.playerBulletHitBoss, null, this); // 플레이어 총알 vs 보스(boss 처리)
    this.physics.add.overlap(this.player, this.boss, this.bossHitPlayer, null, this); // 플레이어 vs 보스(player 처리)
  }

  showRevivePopup(isIncorrectAnswer = false) {
    if (this.isRevivePopupShown) return;
    this.isRevivePopupShown = true;
    if (this.isGameOver) this.soundManager.stopAll();
    this.soundManager.playSound('hitPlayerSound');
    const currentHitCount = this.player.hitCount || 0;
    const requiredWalkies = (currentHitCount * 2) + 1;
    const playerWalkies = parseInt(this.walkieUI.text);
    const canRevive = playerWalkies >= requiredWalkies;

    createOverlay(this, 45);
    const popupBg = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'revivePopup').setScale(0).setDepth(50).setAlpha(0);
    
    createScaleInAni(this, popupBg, 1.6, { scaleY: 1.6 });
    
    // 1. 텍스트
    const infoContainer = this.add.container(this.screenWidth / 2 + 20, this.screenHeight / 2 - 260).setDepth(51).setAlpha(0);
    const hitText = this.add.text(0, -30, isIncorrectAnswer ? '오답이에요!' : `${currentHitCount + 1}번째 충돌!`, {
      fontSize: '32px',
      fill: isIncorrectAnswer ? colorConfig.color_lollipop : colorConfig.color_chocolate, 
      fontFamily: FONT_FAMILY,
      align: 'center'
    }).setOrigin(0.5);
    const walkieIcon = this.add.image(-110, -45, 'walkie').setScale(0.3).setOrigin(0.5);
    infoContainer.add([hitText, walkieIcon]);

    const infoText = this.add.text(this.screenWidth / 2, this.screenHeight / 2 + 10, `워키토키 ${requiredWalkies}개를 사용해 \n긴급 수리를\n요청할 수 있어요!`, {
      fontSize: '26px',
      fill: colorConfig.color_deepBlue,
      fontFamily: FONT_FAMILY,
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5).setDepth(51).setAlpha(0);

    createFadeInAni(this, [infoContainer, infoText], { delay: 300 });

    // 수리하기 버튼과 끝내기 버튼
    const reviveButton = this.add.image(this.screenWidth / 2 - 70, this.screenHeight / 2 + 110, 'reviveButton').setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0);
    const endGameButton = this.add.image(this.screenWidth / 2 + 70, this.screenHeight / 2 + 110, 'endGameButton').setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0);

    createScaleInAni(this, [reviveButton, endGameButton], 0.2, { delay: 500 });
    
    if (canRevive) {
      this.soundManager.playSound('incorrectSound');
      this.repairSprite = this.add.sprite(this.screenWidth / 2, this.screenHeight / 2 - 140, 'playerRepair').setDepth(52).setScale(1);
      this.repairSprite.play('playerRepairAni');
      addHoverEffect(reviveButton, this);
      reviveButton.on('pointerdown', () => {
        this.soundManager.playSound('buttonSound');
        this.walkieUI.setText(playerWalkies - requiredWalkies); // 워키토키 차감
        // repair 횟수 증가
        const currentRepairCount = parseInt(this.repairUI.text);
        this.repairUI.setText(currentRepairCount + 1);
        // 팝업 제거
        removeOverlay(this);
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
      reviveButton.setTint(colorConfig.hex_gray);
    }

    addHoverEffect(endGameButton, this);

    endGameButton.on('pointerdown', () => {
      removeOverlay(this);
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
    
    createOverlay(this, 55);
    createScaleInAni(this, quizContainer, 0.8, { scaleY: 0.8 }); // 팝업 등장 애니메이션

    // 퀴즈 질문
    const questionText = this.add.text(width / 2, height / 2 - 70, randomQuiz.question, {
      fontSize: '28px',
      fill: colorConfig.color_lollipop,
      fontFamily: FONT_FAMILY,
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5).setDepth(61).setAlpha(0);
    
    createFadeInAni(this, questionText, { delay: 300 }); // 텍스트들 페이드인 애니메이션
    
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
      
      const buttonText = this.add.text(buttonX, buttonY, displayText, {
        fontSize: '50px',
        fill: colorConfig.color_black,
        fontFamily: FONT_FAMILY,
        align: 'center',
        lineSpacing: 10 
      }).setOrigin(0.5).setDepth(62).setAlpha(0);
      
      quizItemButtons.push({ bg: buttonBg, text: buttonText }); // 버튼 그룹으로 관리

      // 호버 효과
      buttonBg.on('pointerover', () => {
        buttonBg.setTint(colorConfig.hex_gray);
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
      fontFamily: FONT_FAMILY,
      align: 'center'
    }).setOrigin(0.5).setDepth(70);
    
    this.time.delayedCall(2000, () => {
      successText.destroy();
      danceSprite.destroy();
      const currentHitCount = this.player.hitCount || 0;
      this.player.hitCount = currentHitCount + 1;
      this.player.setTexture('player');
      if (this.isBossShown) this.player.y += 400;
      removeOverlay(this);
      this.gameResume();
      
      // 장애물 타이머가 없으면 다시 시작
      if (!this.obstacleTime && !this.isBossShown) {
        this.createObstacleTimer();
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
    
    if (this.level > this.maxLevel) {
      this.showGameComplete();
      return;
    }
    
    this.updateLevelProgressBar();

    // 게임 상태 초기화 (거리, 점수, 워키토키, 수리 횟수는 유지)
    this.isBossShown = false;
    this.obstacleNum = 0;
    this.obstacleType = 0;
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
    if (this.doubleTime) {
      this.doubleTime.destroy();
      this.doubleTime = null;
    }
    if (this.bulletTime) {
      this.bulletTime.destroy();
    }
    if (this.bossBulletTime) {
      this.bossBulletTime.destroy();
      this.bossBulletTime = null;
    }
    
    // UI 정리
    this.removeDoubleTimerUI();
    this.removeBossHealthUI();
    
    // 기본 총알 타이머 재설정
    this.bulletTime = this.time.addEvent({
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
      if (!this.obstacleTime) {
        this.createObstacleTimer();
      }
    });    
  }

  showLevelUpNotification() {
    this.soundManager.playSound('explosionSound');

    const nextContainer = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'nextContainer').setScale(0).setDepth(20).setAlpha(0);
    const levelText = this.add.text(this.screenWidth / 2, this.screenHeight / 2 + 50, `Level ${this.level}`, {
      fontSize: '45px',
      fill: colorConfig.color_lollipop,
      fontFamily: FONT_FAMILY,
      align: 'center'
    }).setOrigin(0.5).setDepth(21).setAlpha(0);

    // 팝업 등장 애니메이션 - utils 함수 사용
    createScaleInAni(this, [nextContainer, levelText], 1, { duration: 500 });

    createOverlay(this, 19);

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
          removeOverlay(this);
        }
      });
    });
  }

  showGameComplete() {
    this.soundManager.setBGM('finalSound');
    const { width, height } = this.scale;

    const finishBg = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'finishBackground').setDepth(80).setAlpha(0);

    const finalScoreText = this.add.text(width / 2, height / 2 + 60, `최종 점수: ${this.score}`, {
      fontSize: '36px',
      fill: colorConfig.color_chocolate,
      fontFamily: FONT_FAMILY,
      align: 'center',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(81).setAlpha(0);

    const menuButton = this.add.image(width / 2, height - 80, 'goHomeButton').setOrigin(0.5).setDepth(81).setInteractive().setAlpha(0).setScale(0.3);
    addHoverEffect(menuButton, this);

    createFadeInAni(this, [finishBg, finalScoreText, menuButton], { duration: 500, delay: 200 });

    menuButton.on('pointerdown', () => this.handleQuit()); // 버튼 클릭 시 메인 메뉴로 이동
  }

  handleQuit() { // 게임 끝내기
    this.soundManager.playSound('buttonSound');

    // 모든 타이머 정리
    // if (this.obstacleTime) {
    //   this.obstacleTime.destroy();
    //   this.obstacleTime = null;
    // }
    this.obstacleTime = destroyElement(this.obstacleTime);
    this.bulletTime = destroyElement(this.bulletTime);


    if (this.doubleTime) {
      this.doubleTime.destroy();
      this.doubleTime = null;
    }
    if (this.bossBulletTime) {
      this.bossBulletTime.destroy();
      this.bossBulletTime = null;
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
    removeOverlay(this);
    this.hidePauseMenu();

    // 레벨 진행 바 정리
    if (this.levelBg) {
      this.levelBg.destroy();
      this.levelBg = null;
    }
    if (this.levelBar) {
      this.levelBar.destroy();
      this.levelBar = null;
    }
    if (this.levelText) {
      this.levelText.destroy();
      this.levelText = null;
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
    this.obstacleNum = 0;
    this.obstacleType = 0;
    this.distance = 0;
    this.score = 0;
    this.level = 1;
    this.playerShake = 0;
    this.dragOffsetX = 0;
    this.backgroundSpeed = 426;
    this.obstacleSpeed = 426;
    this.maxObstacles = 30;
    
    // 텍스트 객체들 초기화
    this.scoreUI = null;
    this.distanceUI = null;
    this.walkieUI = null;
    this.repairUI = null;
    
    // 기타 객체들 초기화
    this.player = null;
    this.background = null;
    this.cursors = null;
    this.overlay = null;
    this.quizData = null;
    this.soundManager = null;
  }
}