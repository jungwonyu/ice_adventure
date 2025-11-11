import SoundManager from './SoundManager.js';
import { colorConfig, IMAGE_ASSETS, SPRITESHEET_ASSETS, SOUND_ASSETS, ANIMATION_CONFIGS, getImagePath, getSoundPath, getDataPath } from './config.js';
import { addHoverEffect, createAnimation } from './utils.js';

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
    this.initScreen();
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
  // INITIALIZATION
  // ------------------------------------------------------------------------------------

  /**
   * 화면 크기 초기화
   */
  initScreen() {
    const { width, height } = this.scale;
    this.screenWidth = width;
    this.screenHeight = height;
  }

  // ------------------------------------------------------------------------------------
  // ASSET LOADING
  // ------------------------------------------------------------------------------------
  
  /**
   * 게임에 필요한 모든 이미지 리소스 로드
   */
  loadImages() {
    // 일반 이미지 로드
    IMAGE_ASSETS.forEach(key => this.load.image(key, getImagePath(`${key}.png`)));

    // 스프라이트시트 로드
    SPRITESHEET_ASSETS.forEach(({ key, frameWidth, frameHeight }) => this.load.spritesheet(key, getImagePath(`${key}.png`), { frameWidth, frameHeight }));
  }

  /**
   * 스프라이트 애니메이션 설정
   */
  loadAnimations() {
    this.load.on('complete', () => {
      ANIMATION_CONFIGS.forEach(anim => {
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
    SOUND_ASSETS.forEach(key => this.load.audio(key, getSoundPath(`${key}.mp3`)));
  }

  // ------------------------------------------------------------------------------------
  // SCENE SETUP
  // ------------------------------------------------------------------------------------
  
  /**
   * 시작 화면 구성
   */
  setStartScene() {
    this.add.video(this.screenWidth / 2, this.screenHeight / 2, 'introVideo').setOrigin(0.5).setLoop(true).setScale(0.7).play();

    const title = this.add.image(this.screenWidth / 2, this.screenHeight / 2 - 400, 'gameTitle').setOrigin(0.5).setScale(0);
    createAnimation(this, title, { scale: 0.7, duration: 1000, ease: 'Back.out' });

    this.createStartButton();
    this.createHowToPlayButton();
  }

  /**
   * 게임 시작 버튼 생성
   */
  createStartButton() {
    const startButton = this.add.image(this.screenWidth / 2 - 150, this.screenHeight / 2 - 100, 'startButton').setOrigin(0.5).setScale(0.3).setInteractive();
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
  createHowToPlayButton() {
    const howToPlayButton = this.add.image(this.screenWidth / 2 + 150, this.screenHeight / 2 - 100, 'howToPlayButton').setOrigin(0.5).setScale(0.3).setInteractive();
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
    this.cameras.main.setBackgroundColor(colorConfig.hex_loadingBg);

    const loadingBarConfig = { x: this.screenWidth / 2 - 250, y: this.screenHeight / 2 - 15, width: 500, height: 30, radius: 15 };

    // 로딩바 외곽선 (파란색)
    const blueOutline = this.add.graphics()
      .lineStyle(3, colorConfig.hex_loadingBar, 1)
      .strokeRoundedRect(loadingBarConfig.x - 3,  loadingBarConfig.y - 3,  loadingBarConfig.width + 6,  loadingBarConfig.height + 6,  loadingBarConfig.radius + 3)
      .setDepth(10);

    // 로딩바 내부 테두리 (흰색)
    const whiteOutline = this.add.graphics()
      .lineStyle(2, colorConfig.hex_snow, 1)
      .strokeRoundedRect(loadingBarConfig.x - 1, loadingBarConfig.y - 1, loadingBarConfig.width + 2, loadingBarConfig.height + 2, loadingBarConfig.radius + 1)
      .setDepth(11);

    // 로딩바 배경
    const loadingBarBg = this.add.graphics()
      .fillStyle(colorConfig.hex_snow, 1)
      .fillRoundedRect(loadingBarConfig.x, loadingBarConfig.y, loadingBarConfig.width, loadingBarConfig.height, loadingBarConfig.radius)
      .setDepth(12);

    // 로딩바 진행 표시
    const loadingBar = this.add.graphics().setDepth(13);

    // 로딩 애니메이션 스프라이트
    if (!this.anims.exists('loadingAni')) this.anims.create({ key: 'loadingAni', frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    const loadingImage = this.add.sprite(loadingBarConfig.x, loadingBarConfig.y - 60, 'loading')
      .setDepth(14)
      .setScale(1.5)
      .play('loadingAni');

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
    let currentGuideIndex = 1;
    const popupElements = this.createPopupElements(currentGuideIndex);
    this.setPopupEvents(popupElements, currentGuideIndex);
    this.animatePopupEntrance(popupElements);
  }

  /**
   * 팝업 UI 요소 생성 (오버레이, 가이드 이미지, 버튼 등)
   */
  createPopupElements(currentGuideIndex) {
    const { screenWidth: width, screenHeight: height } = this;
    
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, colorConfig.hex_black, 0.7).setDepth(100).setInteractive();
    const guideImage = this.add.image(width / 2, height / 2, 'guide1').setOrigin(0.5).setDepth(101).setScale(0.8);
    const leftArrow = this.add.image(width / 2 - 300, height / 2, 'leftArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    const rightArrow = this.add.image(width / 2 + 300, height / 2, 'rightArrow').setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive();
    const pageIndicator = this.add.text(width / 2, height / 2 + 400, `${currentGuideIndex}/5`, {
      fontSize: '28px',
      fill: colorConfig.color_deepBlue,
      fontFamily: 'Cafe24Surround',
      stroke: colorConfig.color_snow,
      strokeThickness: 3,
      backgroundColor: colorConfig.color_snow
    }).setOrigin(0.5).setDepth(102);
    const closeButton = this.add.image(width / 2, height - 150, 'closeButton').setOrigin(0.5).setDepth(102).setScale(0.3).setInteractive();

    addHoverEffect(leftArrow, this);
    addHoverEffect(rightArrow, this);
    addHoverEffect(closeButton, this);

    return { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton };
  }

  /**
   * 팝업 이벤트 핸들러 설정
   */
  setPopupEvents(elements, currentGuideIndex) {
    const { overlay, guideImage, leftArrow, rightArrow, pageIndicator, closeButton } = elements;
    
    const updateGuide = () => {
      guideImage.setTexture(`guide${currentGuideIndex}`);
      pageIndicator.setText(`${currentGuideIndex}/5`);
    };

    const navigateGuide = (direction) => {
      this.soundManager.playSound('buttonSound');
      currentGuideIndex = (currentGuideIndex + direction - 1 + 5) % 5 + 1;
      updateGuide();
    };

    leftArrow.on('pointerdown', () => navigateGuide(-1));
    rightArrow.on('pointerdown', () => navigateGuide(1));

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
    const { guideImage } = elements;
    guideImage.setScale(0);
    createAnimation(this, guideImage, { scale: 0.8, duration: 300, ease: 'Back.out' });
  }
}