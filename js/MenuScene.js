import SoundManager from './SoundManager.js';
import { colorConfig } from './Main.js';
import { addHoverEffect } from './utils.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.quizData = null;
    this.soundManager = null;
  }

  preload() {
    this.createLoadingBar(); // 로딩 바 생성
    this.loadAnimations(); // 애니메이션 설정
    this.loadImages(); // 이미지 로드
    this.loadSounds(); // 사운드 로드
    this.load.json('quizData', 'data/quizData.json'); // 퀴즈 데이터
  }

  create() {
    this.setStartScene();
    this.setSoundManager();
  }

  // ========================================================================================
  // ASSET LOADING
  // ========================================================================================
  loadImages() {
    this.load.image('startBackground', 'assets/images/startBackground.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('gameTitle', 'assets/images/gameTitle.png');
    this.load.image('finishBackground', 'assets/images/finishBackground.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('playerHit', 'assets/images/playerHit.png');
    this.load.image('playerBullet', 'assets/images/playerBullet.png');
    this.load.spritesheet('playerDance', 'assets/images/playerDance.png', { frameWidth: 160, frameHeight: 260 });
    this.load.spritesheet('playerSad', 'assets/images/playerSad.png', { frameWidth: 160, frameHeight: 260 });
    this.load.spritesheet('playerRepair', 'assets/images/playerRepair.png', { frameWidth: 240, frameHeight: 260 });
    this.load.spritesheet('double', 'assets/images/double.png', { frameWidth: 260, frameHeight: 260 });
    this.load.spritesheet('shield', 'assets/images/shield.png', { frameWidth: 260, frameHeight: 260 });
    this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 260, frameHeight: 260 });
    this.load.image('walkie', 'assets/images/walkie.png');
    this.load.image('repair', 'assets/images/repair.png');
    this.load.spritesheet('distance', 'assets/images/distance.png', { frameWidth: 256, frameHeight: 130 });
    this.load.image('revivePopup', 'assets/images/revivePopup.png');
    this.load.image('reviveButton', 'assets/images/reviveButton.png');
    this.load.image('endGameButton', 'assets/images/endGameButton.png');
    this.load.image('quizContainer', 'assets/images/quizContainer.png');
    this.load.image('quizItemBox', 'assets/images/quizItemBox.png');
    this.load.image('nextContainer', 'assets/images/nextContainer.png');
    this.load.image('obstacle2', 'assets/images/obstacle2.png');
    this.load.image('obstacle2Ice', 'assets/images/obstacle2Ice.png');
    this.load.image('obstacle3', 'assets/images/obstacle3.png');
    this.load.spritesheet('obstacle1', 'assets/images/obstacle1.png', { frameWidth: 400, frameHeight: 400 });
    this.load.image('boss1', 'assets/images/boss1.png');
    this.load.image('boss2', 'assets/images/boss2.png');
    this.load.image('boss3', 'assets/images/boss3.png');
    this.load.image('boss4', 'assets/images/boss4.png');
    this.load.image('boss5', 'assets/images/boss5.png');
    this.load.image('bossBullet', 'assets/images/bossBullet.png');
    this.load.image('playButton', 'assets/images/playButton.png');
    this.load.image('pauseButton', 'assets/images/pauseButton.png');
    this.load.image('soundButton', 'assets/images/soundButton.png');
    this.load.image('muteButton', 'assets/images/muteButton.png');
    this.load.image('startButton', 'assets/images/startButton.png');
    this.load.image('startButtonHover', 'assets/images/startButtonHover.png');
    this.load.image('howToPlayButton', 'assets/images/howToPlayButton.png');
    this.load.image('howToPlayButtonHover', 'assets/images/howToPlayButtonHover.png');
    this.load.image('goHomeButton', 'assets/images/goHomeButton.png');
    this.load.image('guide1', 'assets/images/guide1.png');
    this.load.image('guide2', 'assets/images/guide2.png');
    this.load.image('guide3', 'assets/images/guide3.png');
    this.load.image('guide4', 'assets/images/guide4.png');
    this.load.image('guide5', 'assets/images/guide5.png');
    this.load.image('leftArrow', 'assets/images/leftArrow.png');
    this.load.image('rightArrow', 'assets/images/rightArrow.png');
    this.load.image('closeButton', 'assets/images/closeButton.png');
  }

  loadAnimations() {
    this.load.on('complete', () => {
      const animations = [
        { key: 'obstacle1Ani', spriteKey: 'obstacle1', frames: { start: 0, end: 2 }, frameRate: 3 },
        { key: 'coinAni', spriteKey: 'coin', frames: { start: 0, end: 3 }, frameRate: 10 },
        { key: 'shieldAni', spriteKey: 'shield', frames: { start: 0, end: 3 }, frameRate: 10 },
        { key: 'doubleAni', spriteKey: 'double', frames: { start: 0, end: 3 }, frameRate: 10 },
        { key: 'distanceAni', spriteKey: 'distance', frames: { start: 3, end: 0 }, frameRate: 3 },
        { key: 'playerDanceAni', spriteKey: 'playerDance', frames: { start: 0, end: 4 }, frameRate: 5 },
        { key: 'playerSadAni', spriteKey: 'playerSad', frames: { start: 0, end: 4 }, frameRate: 5 },
        { key: 'playerRepairAni', spriteKey: 'playerRepair', frames: { start: 0, end: 4 }, frameRate: 5 }
      ];

      animations.forEach(anim => {
        if (!this.anims.exists(anim.key)) {
          this.anims.create({ key: anim.key, frames: this.anims.generateFrameNumbers(anim.spriteKey, anim.frames), frameRate: anim.frameRate, repeat: -1 });
        }
      });
    });
  }

  loadSounds() {
    this.load.audio('bgm', 'assets/sounds/bgm.mp3');
    this.load.audio('bossBgm', 'assets/sounds/bossBgm.mp3');
    this.load.audio('coinBgm', 'assets/sounds/coinBgm.mp3');
    this.load.audio('nextBgm', 'assets/sounds/nextBgm.mp3');
    this.load.audio('buttonSound', 'assets/sounds/button.mp3');
    this.load.audio('coinSound', 'assets/sounds/coin.mp3');
    this.load.audio('helperSound', 'assets/sounds/helper.mp3');
    this.load.audio('bulletHitSound', 'assets/sounds/bulletHit.mp3');
    this.load.audio('explosionSound', 'assets/sounds/explosion.mp3');
    this.load.audio('bossShootSound', 'assets/sounds/bossShoot.mp3');
    this.load.audio('correctSound', 'assets/sounds/correct.mp3');
    this.load.audio('incorrectSound', 'assets/sounds/incorrect.mp3');
    this.load.audio('countdownSound', 'assets/sounds/countdown.mp3');
    this.load.audio('nextLevelSound', 'assets/sounds/nextLevel.mp3');
    this.load.audio('finalSound', 'assets/sounds/final.mp3');
    this.load.audio('gameOverSound', 'assets/sounds/gameOver.mp3');
    this.load.audio('hitPlayerSound', 'assets/sounds/hitPlayer.mp3');
  }

  // ========================================================================================
  // SCENE SETUP
  // ========================================================================================
  setStartScene() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'startBackground').setOrigin(0.5).setDisplaySize(width, height);

    const title = this.add.image(width / 2, height / 2 - 400, 'gameTitle').setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: title, scaleX: 0.7, scaleY: 0.7, duration: 1000, ease: 'Back.out' });

    // 시작 버튼
    const startButton = this.add.image(width / 2 - 150, height / 2 - 100, 'startButton').setOrigin(0.5).setScale(0.3).setInteractive();
    addHoverEffect(startButton, this);
    startButton.on('pointerdown', () => {
      const quizData = this.cache.json.get('quizData');
      this.scene.stop('MenuScene');
      this.scene.start('GameScene', { quizData: quizData });
      this.soundManager.playSound('buttonSound');
    });

    // 게임 방법 버튼
    const howToPlayButton = this.add.image(width / 2 + 150, height / 2 - 100, 'howToPlayButton').setOrigin(0.5).setScale(0.3).setInteractive();
    addHoverEffect(howToPlayButton, this);
    howToPlayButton.on('pointerdown', () => this.showHowToPlayPopup());
  }

  setSoundManager() {
    this.soundManager = SoundManager.getInstance(this);
    this.soundManager.createSoundButtons();
    this.soundManager.setBGM('bgm');
  }

  // ========================================================================================
  // UTILITY FUNCTIONS
  // ========================================================================================

  createLoadingBar() {
    const { width, height } = this.scale;
    
    this.cameras.main.setBackgroundColor(0xc9effa);

    // 로딩바 구성 요소들
    const loadingBarConfig = {
      background: { x: width / 2 - 250, y: height / 2 - 40, width: 500, height: 80, radius: 25 },
      progressBg: { x: width / 2 - 240, y: height / 2 - 30, width: 480, height: 60, radius: 20 },
      progress: { x: width / 2 - 240, y: height / 2 - 30, height: 60, radius: 20 }
    };

    // 로딩바 배경
    const loadingBarBg = this.add.graphics();
    loadingBarBg.fillStyle(0x000000, 0.7);
    loadingBarBg.fillRoundedRect(
      loadingBarConfig.background.x, 
      loadingBarConfig.background.y, 
      loadingBarConfig.background.width, 
      loadingBarConfig.background.height, 
      loadingBarConfig.background.radius
    );
    loadingBarBg.setDepth(10);

    // 로딩바 진행 배경
    const loadingBarProgressBg = this.add.graphics();
    loadingBarProgressBg.fillStyle(0x333333, 0.8);
    loadingBarProgressBg.fillRoundedRect(
      loadingBarConfig.progressBg.x, 
      loadingBarConfig.progressBg.y, 
      loadingBarConfig.progressBg.width, 
      loadingBarConfig.progressBg.height, 
      loadingBarConfig.progressBg.radius
    );
    loadingBarProgressBg.setDepth(11);

    // 로딩바 진행바
    const loadingBar = this.add.graphics();
    loadingBar.setDepth(12);

    // 로딩 진행 상황 처리
    this.load.on('progress', (value) => {
      loadingBar.clear();
      loadingBar.fillStyle(colorConfig.hex_lollipop, 1);
      const barWidth = loadingBarConfig.progressBg.width * value;
      loadingBar.fillRoundedRect(
        loadingBarConfig.progress.x, 
        loadingBarConfig.progress.y, 
        barWidth, 
        loadingBarConfig.progress.height, 
        loadingBarConfig.progress.radius
      );
    });

    // 로딩 완료 시 정리
    this.load.on('complete', () => [loadingBarBg, loadingBarProgressBg, loadingBar].forEach(element => element.destroy()));
  }

  // ========================================================================================
  // POPUP SYSTEM
  // ========================================================================================
  showHowToPlayPopup() {
    this.soundManager.playSound('buttonSound');
    const { width, height } = this.scale;
    let currentGuideIndex = 1;
    const popupElements = this.createPopupElements(width, height, currentGuideIndex);
    this.setupPopupEvents(popupElements, currentGuideIndex); // 이벤트 핸들러 설정
    this.animatePopupEntrance(popupElements); // 애니메이션 적용
  }

  createPopupElements(width, height, currentGuideIndex) {
    // 반투명 배경
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100).setInteractive();

    // 가이드 이미지
    const guideImage = this.add.image(width / 2, height / 2, 'guide1').setOrigin(0.5).setDepth(101).setScale(0.8);

    // 내비게이션 화살표
    const leftArrow = this.add.image(width / 2 - 300, height / 2, 'leftArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    addHoverEffect(leftArrow, this);
    const rightArrow = this.add.image(width / 2 + 300, height / 2, 'rightArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    addHoverEffect(rightArrow, this);

    // 페이지 인디케이터
    const pageIndicator = this.add.text(width / 2, height / 2 + 400, `${currentGuideIndex}/5`, {
      fontSize: '28px',
      fill: colorConfig.color_deepBlue,
      fontFamily: 'Cafe24Surround',
      stroke: colorConfig.color_snow,
      strokeThickness: 3,
      backgroundColor: '#ffffff'
    }).setOrigin(0.5).setDepth(102);

    // 닫기 버튼
    const closeButton = this.add.image(width / 2, height - 150, 'closeButton').setOrigin(0.5).setDepth(102).setScale(0.3).setInteractive();
    addHoverEffect(closeButton, this);

    return { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton };
  }

  setupPopupEvents(elements, currentGuideIndex) {
    const { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton } = elements;

    // 가이드 업데이트 함수
    const updateGuide = () => {
      guideImage.setTexture(`guide${currentGuideIndex}`);
      pageIndicator.setText(`${currentGuideIndex}/5`);
    };

    // 왼쪽 화살표 클릭
    leftArrow.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      currentGuideIndex--;
      if (currentGuideIndex < 1) currentGuideIndex = 5;
      updateGuide();
    });

    // 오른쪽 화살표 클릭
    rightArrow.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      currentGuideIndex++;
      if (currentGuideIndex > 5) currentGuideIndex = 1;
      updateGuide();
    });

    // 팝업 닫기 함수
    const closePopup = () => {
      this.soundManager.playSound('buttonSound');
      Object.values(elements).forEach(element => element.destroy());
      this.game.canvas.style.cursor = 'default';
    };

    // 닫기 버튼 및 배경 클릭 이벤트
    closeButton.on('pointerdown', closePopup);
    overlay.on('pointerdown', closePopup);
  }

  animatePopupEntrance(elements) {
    const { guideImage, leftArrow, rightArrow, pageIndicator, closeButton } = elements;
    guideImage.setScale(0);
    [leftArrow, rightArrow, pageIndicator, closeButton].forEach(element => element.setAlpha(0));

    // 가이드 이미지 애니메이션
    this.tweens.add({ targets: guideImage, scaleX: 0.8, scaleY: 0.8, duration: 300, ease: 'Back.out' });
    // 기타 요소들 페이드인
    this.tweens.add({ targets: [leftArrow, rightArrow, pageIndicator, closeButton], alpha: 1, duration: 300, ease: 'Power2.out', delay: 150 });
  }
}