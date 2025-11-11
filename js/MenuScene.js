import SoundManager from './SoundManager.js';
import { colorConfig } from './config.js';
import { addHoverEffect } from './utils.js';
import { getImagePath, getSoundPath, getDataPath } from './config.js';

/**
 * MenuScene - 게임 시작 화면 및 리소스 로딩을 담당하는 Scene
 */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.quizData = null;
    this.soundManager = null;
  }

  preload() {
    this.createLoadingBar();
    this.loadImages();
    this.loadAnimations();
    this.loadSounds();
    this.load.json('quizData', getDataPath('quizData.json'));
  }

  create() {
    this.setStartScene();
    this.setSoundManager();
  }

  // ------------------------------------------------------------------------------------
  // ASSET LOADING
  // ------------------------------------------------------------------------------------
  
  /**
   * 게임에 필요한 모든 이미지 리소스 로드
   */
  loadImages() {
    this.load.image('startBackground', getImagePath('startBackground.png'));
    this.load.image('background', getImagePath('background.png'));
    this.load.image('gameTitle', getImagePath('gameTitle.png'));
    this.load.image('finishBackground', getImagePath('finishBackground.png'));
    this.load.image('player', getImagePath('player.png'));
    this.load.image('playerHit', getImagePath('playerHit.png'));
    this.load.image('playerBullet', getImagePath('playerBullet.png'));
    this.load.spritesheet('playerDance', getImagePath('playerDance.png'), { frameWidth: 160, frameHeight: 260 });
    this.load.spritesheet('playerSad', getImagePath('playerSad.png'), { frameWidth: 160, frameHeight: 260 });
    this.load.spritesheet('playerRepair', getImagePath('playerRepair.png'), { frameWidth: 240, frameHeight: 260 });
    this.load.spritesheet('double', getImagePath('double.png'), { frameWidth: 260, frameHeight: 260 });
    this.load.spritesheet('shield', getImagePath('shield.png'), { frameWidth: 260, frameHeight: 260 });
    this.load.spritesheet('coin', getImagePath('coin.png'), { frameWidth: 260, frameHeight: 260 });
    this.load.image('walkie', getImagePath('walkie.png'));
    this.load.image('repair', getImagePath('repair.png'));
    this.load.spritesheet('distance', getImagePath('distance.png'), { frameWidth: 256, frameHeight: 130 });
    this.load.image('revivePopup', getImagePath('revivePopup.png'));
    this.load.image('reviveButton', getImagePath('reviveButton.png'));
    this.load.image('endGameButton', getImagePath('endGameButton.png'));
    this.load.image('replayButton', getImagePath('replayButton.png'));
    this.load.image('quizContainer', getImagePath('quizContainer.png'));
    this.load.image('quizItemBox', getImagePath('quizItemBox.png'));
    this.load.image('nextContainer', getImagePath('nextContainer.png'));
    this.load.image('obstacle2', getImagePath('obstacle2.png'));
    this.load.image('obstacle2Ice', getImagePath('obstacle2Ice.png'));
    this.load.image('obstacle3', getImagePath('obstacle3.png'));
    this.load.spritesheet('obstacle1', getImagePath('obstacle1.png'), { frameWidth: 400, frameHeight: 400 });
    this.load.image('boss1', getImagePath('boss1.png'));
    this.load.image('boss2', getImagePath('boss2.png'));
    this.load.image('boss3', getImagePath('boss3.png'));
    this.load.image('boss4', getImagePath('boss4.png'));
    this.load.image('boss5', getImagePath('boss5.png'));
    this.load.image('bossBullet', getImagePath('bossBullet.png'));
    this.load.image('playButton', getImagePath('playButton.png'));
    this.load.image('pauseButton', getImagePath('pauseButton.png'));
    this.load.image('soundButton', getImagePath('soundButton.png'));
    this.load.image('muteButton', getImagePath('muteButton.png'));
    this.load.image('startButton', getImagePath('startButton.png'));
    this.load.image('startButtonHover', getImagePath('startButtonHover.png'));
    this.load.image('howToPlayButton', getImagePath('howToPlayButton.png'));
    this.load.image('howToPlayButtonHover', getImagePath('howToPlayButtonHover.png'));
    this.load.image('goHomeButton', getImagePath('goHomeButton.png'));
    this.load.image('guide1', getImagePath('guide1.png'));
    this.load.image('guide2', getImagePath('guide2.png'));
    this.load.image('guide3', getImagePath('guide3.png'));
    this.load.image('guide4', getImagePath('guide4.png'));
    this.load.image('guide5', getImagePath('guide5.png'));
    this.load.image('leftArrow', getImagePath('leftArrow.png'));
    this.load.image('rightArrow', getImagePath('rightArrow.png'));
    this.load.image('closeButton', getImagePath('closeButton.png'));
  }

  /**
   * 스프라이트 애니메이션 설정
   */
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
        { key: 'playerRepairAni', spriteKey: 'playerRepair', frames: { start: 0, end: 4 }, frameRate: 5 },
      ];

      animations.forEach(anim => {
        if (!this.anims.exists(anim.key)) {
          this.anims.create({ key: anim.key, frames: this.anims.generateFrameNumbers(anim.spriteKey, anim.frames), frameRate: anim.frameRate, repeat: -1 });
        }
      });
    });
  }

  /**
   * 게임에 사용되는 모든 사운드 파일 로드
   */
  loadSounds() {
    this.load.audio('bgm', getSoundPath('bgm.mp3'));
    this.load.audio('bossBgm', getSoundPath('bossBgm.mp3'));
    this.load.audio('coinBgm', getSoundPath('coinBgm.mp3'));
    this.load.audio('nextBgm', getSoundPath('nextBgm.mp3'));
    this.load.audio('buttonSound', getSoundPath('buttonSound.mp3'));
    this.load.audio('coinSound', getSoundPath('coinSound.mp3'));
    this.load.audio('helperSound', getSoundPath('helperSound.mp3'));
    this.load.audio('bulletHitSound', getSoundPath('bulletHitSound.mp3'));
    this.load.audio('explosionSound', getSoundPath('explosionSound.mp3'));
    this.load.audio('bossShootSound', getSoundPath('bossShootSound.mp3'));
    this.load.audio('correctSound', getSoundPath('correctSound.mp3'));
    this.load.audio('incorrectSound', getSoundPath('incorrectSound.mp3'));
    this.load.audio('countdownSound', getSoundPath('countdownSound.mp3'));
    this.load.audio('nextLevelSound', getSoundPath('nextLevelSound.mp3'));
    this.load.audio('finalSound', getSoundPath('finalSound.mp3'));
    this.load.audio('gameOverSound', getSoundPath('gameOverSound.mp3'));
    this.load.audio('hitPlayerSound', getSoundPath('hitPlayerSound.mp3'));
  }

  // ------------------------------------------------------------------------------------
  // SCENE SETUP
  // ------------------------------------------------------------------------------------
  
  /**
   * 시작 화면 구성 (인트로 비디오, 타이틀, 버튼 등)
   */
  setStartScene() {
    const { width, height } = this.scale;

    const introVideo = this.add.video(width / 2, height / 2, 'introVideo');
    introVideo.setOrigin(0.5);
    introVideo.setLoop(true);
    introVideo.setScale(0.7);
    introVideo.play();

    const title = this.add.image(width / 2, height / 2 - 400, 'gameTitle').setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: title, scaleX: 0.7, scaleY: 0.7, duration: 1000, ease: 'Back.out' });

    this.createStartButton(width, height);
    this.createHowToPlayButton(width, height);
  }

  /**
   * 게임 시작 버튼 생성
   */
  createStartButton(width, height) {
    const startButton = this.add.image(width / 2 - 150, height / 2 - 100, 'startButton').setOrigin(0.5).setScale(0.3).setInteractive();
    addHoverEffect(startButton, this);
    startButton.on('pointerdown', () => {
      const quizData = this.cache.json.get('quizData');
      this.scene.stop('MenuScene');
      this.scene.start('GameScene', { quizData: quizData });
      this.soundManager.playSound('buttonSound');
    });
  }

  /**
   * 게임 방법 버튼 생성
   */
  createHowToPlayButton(width, height) {
    const howToPlayButton = this.add.image(width / 2 + 150, height / 2 - 100, 'howToPlayButton').setOrigin(0.5).setScale(0.3).setInteractive();
    addHoverEffect(howToPlayButton, this);
    howToPlayButton.on('pointerdown', () => this.showHowToPlayPopup());
  }

  /**
   * SoundManager 인스턴스 초기화
   */
  setSoundManager() {
    this.soundManager = SoundManager.getInstance(this);
  }

  // ------------------------------------------------------------------------------------
  // LOADING BAR
  // ------------------------------------------------------------------------------------
  
  /**
   * 리소스 로딩 진행 상황을 표시하는 로딩바 생성
   */
  createLoadingBar() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(colorConfig.hex_loadingBg);

    const loadingBarConfig = { x: width / 2 - 250, y: height / 2 - 15, width: 500, height: 30, radius: 15 };

    // 로딩바 외곽선 (파란색)
    const blueOutline = this.add.graphics();
    blueOutline.lineStyle(3, colorConfig.hex_loadingBar, 1);
    blueOutline.strokeRoundedRect(loadingBarConfig.x - 3,  loadingBarConfig.y - 3,  loadingBarConfig.width + 6,  loadingBarConfig.height + 6,  loadingBarConfig.radius + 3);
    blueOutline.setDepth(10);

    // 로딩바 내부 테두리 (흰색)
    const whiteOutline = this.add.graphics();
    whiteOutline.lineStyle(2, colorConfig.hex_snow, 1);
    whiteOutline.strokeRoundedRect(loadingBarConfig.x - 1, loadingBarConfig.y - 1, loadingBarConfig.width + 2, loadingBarConfig.height + 2, loadingBarConfig.radius + 1);
    whiteOutline.setDepth(11);

    // 로딩바 배경
    const loadingBarBg = this.add.graphics();
    loadingBarBg.fillStyle(colorConfig.hex_snow, 1);
    loadingBarBg.fillRoundedRect(loadingBarConfig.x, loadingBarConfig.y, loadingBarConfig.width, loadingBarConfig.height, loadingBarConfig.radius);
    loadingBarBg.setDepth(12);

    // 로딩바 진행 표시
    const loadingBar = this.add.graphics();
    loadingBar.setDepth(13);

    // 로딩 애니메이션 스프라이트
    if (!this.anims.exists('loadingAni')) this.anims.create({ key: 'loadingAni', frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    const loadingImage = this.add.sprite(loadingBarConfig.x, loadingBarConfig.y - 60, 'loading');
    loadingImage.setDepth(14);
    loadingImage.setScale(1.5);
    loadingImage.play('loadingAni');

    // 로딩 진행률에 따라 바 업데이트
    this.load.on('progress', (value) => {
      loadingBar.clear();
      loadingBar.fillStyle(colorConfig.hex_loadingBar, 1);
      const barWidth = loadingBarConfig.width * value;
      const imageMargin = 50;
      const moveRange = loadingBarConfig.width - (imageMargin * 2);
      const imageX = loadingBarConfig.x + imageMargin + (moveRange * value);

      loadingBar.fillRoundedRect(loadingBarConfig.x, loadingBarConfig.y, barWidth, loadingBarConfig.height, loadingBarConfig.radius);
      loadingImage.setX(imageX);
    });

    // 로딩 완료 시 UI 요소 제거
    this.load.on('complete', () => [blueOutline, whiteOutline, loadingBarBg, loadingBar, loadingImage].forEach(element => element.destroy()));
  }

  // ------------------------------------------------------------------------------------
  // POPUP SYSTEM
  // ------------------------------------------------------------------------------------
  
  /**
   * 게임 방법 팝업 표시
   */
  showHowToPlayPopup() {
    this.soundManager.playSound('buttonSound');
    const { width, height } = this.scale;
    let currentGuideIndex = 1;
    const popupElements = this.createPopupElements(width, height, currentGuideIndex);
    this.setupPopupEvents(popupElements, currentGuideIndex);
    this.animatePopupEntrance(popupElements);
  }

  /**
   * 팝업 UI 요소 생성 (오버레이, 가이드 이미지, 버튼 등)
   */
  createPopupElements(width, height, currentGuideIndex) {
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100).setInteractive();
    const guideImage = this.add.image(width / 2, height / 2, 'guide1').setOrigin(0.5).setDepth(101).setScale(0.8);
    const leftArrow = this.add.image(width / 2 - 300, height / 2, 'leftArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    const rightArrow = this.add.image(width / 2 + 300, height / 2, 'rightArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    const pageIndicator = this.add.text(width / 2, height / 2 + 400, `${currentGuideIndex}/5`, {
      fontSize: '28px',
      fill: colorConfig.color_deepBlue,
      fontFamily: 'Cafe24Surround',
      stroke: colorConfig.color_snow,
      strokeThickness: 3,
      backgroundColor: '#ffffff'
    }).setOrigin(0.5).setDepth(102);
    const closeButton = this.add.image(width / 2, height - 150, 'closeButton').setOrigin(0.5).setDepth(102).setScale(0.3).setInteractive();

    addHoverEffect(leftArrow, this);
    addHoverEffect(rightArrow, this);
    addHoverEffect(closeButton, this);

    return { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton };
  }

  /**
   * 팝업 이벤트 핸들러 설정 (화살표 클릭, 닫기 등)
   */
  setupPopupEvents(elements, currentGuideIndex) {
    const { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton } = elements;
    
    const updateGuide = () => {
      guideImage.setTexture(`guide${currentGuideIndex}`);
      pageIndicator.setText(`${currentGuideIndex}/5`);
    };

    // 이전 가이드로 이동
    leftArrow.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      currentGuideIndex--;
      if (currentGuideIndex < 1) currentGuideIndex = 5;
      updateGuide();
    });

    // 다음 가이드로 이동
    rightArrow.on('pointerdown', () => {
      this.soundManager.playSound('buttonSound');
      currentGuideIndex++;
      if (currentGuideIndex > 5) currentGuideIndex = 1;
      updateGuide();
    });

    const closePopup = () => {
      this.soundManager.playSound('buttonSound');
      Object.values(elements).forEach(element => element.destroy());
      this.game.canvas.style.cursor = 'default';
    };

    closeButton.on('pointerdown', closePopup);
    overlay.on('pointerdown', closePopup);
  }

  /**
   * 팝업 등장 애니메이션
   */
  animatePopupEntrance(elements) {
    const { guideImage, leftArrow, rightArrow, pageIndicator, closeButton } = elements;
    guideImage.setScale(0);
    [leftArrow, rightArrow, pageIndicator, closeButton].forEach(element => element.setAlpha(0));

    this.tweens.add({ targets: guideImage, scaleX: 0.8, scaleY: 0.8, duration: 300, ease: 'Back.out' });
    this.tweens.add({ targets: [leftArrow, rightArrow, pageIndicator, closeButton], alpha: 1, duration: 300, ease: 'Power2.out', delay: 150 });
  }
}