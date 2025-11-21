const P = {
  images: "assets/images/",
  sounds: "assets/sounds/",
  videos: "assets/videos/",
  data: "data/"
}, D = (i) => `${P.images}${i}`, _ = (i) => `${P.sounds}${i}`, G = (i) => `${P.videos}${i}`, E = (i) => `${P.data}${i}`, h = {
  color_chocolate: "#6F412B",
  color_lollipop: "#FF6F91",
  color_deepBlue: "#1A374D",
  color_candy: "#F9DD52",
  color_snow: "#FFFFFF",
  color_black: "#000000",
  hex_lollipop: 16740241,
  hex_ice: 7722216,
  hex_candy: 16375122,
  hex_mint: 11069135,
  hex_greenTea: 7638811,
  hex_snow: 16777215,
  hex_black: 0,
  hex_loadingBg: 13234170,
  hex_loadingBar: 9751772,
  hex_gray: 8947848
}, b = {
  1: { bossDistance: 3e3, bossBullet: 3, bossHit: 30, obstacleNum: 1, walkieReward: 1 },
  2: { bossDistance: 6e3, bossBullet: 3, bossHit: 35, obstacleNum: 1, walkieReward: 3 },
  3: { bossDistance: 9e3, bossBullet: 3, bossHit: 40, obstacleNum: 1, walkieReward: 5 },
  4: { bossDistance: 12e3, bossBullet: 5, bossHit: 45, obstacleNum: 2, walkieReward: 7 },
  5: { bossDistance: 15e3, bossBullet: 5, bossHit: 50, obstacleNum: 2, walkieReward: 9 },
  6: { bossDistance: 18e3, bossBullet: 5, bossHit: 55, obstacleNum: 2, walkieReward: 11 },
  7: { bossDistance: 21e3, bossBullet: 7, bossHit: 60, obstacleNum: 3, walkieReward: 13 },
  8: { bossDistance: 24e3, bossBullet: 7, bossHit: 65, obstacleNum: 3, walkieReward: 15 },
  9: { bossDistance: 27e3, bossBullet: 7, bossHit: 70, obstacleNum: 3, walkieReward: 17 },
  10: { bossDistance: 3e4, bossBullet: 7, bossHit: 75, obstacleNum: 3, walkieReward: 19 }
}, I = "Cafe24Surround", U = [
  // 배경 및 UI
  "startBackground",
  "background",
  "gameTitle",
  "finishBackground",
  "revivePopup",
  "reviveButton",
  "endGameButton",
  "replayButton",
  "quizContainer",
  "quizItemBox",
  "nextContainer",
  // 버튼
  "playButton",
  "pauseButton",
  "soundButton",
  "muteButton",
  "startButton",
  "startButtonHover",
  "howToPlayButton",
  "howToPlayButtonHover",
  "goHomeButton",
  "leftArrow",
  "rightArrow",
  "closeButton",
  // 가이드
  "guide1",
  "guide2",
  "guide3",
  "guide4",
  "guide5",
  // 플레이어
  "player",
  "playerHit",
  "playerBullet",
  // 아이템
  "walkie",
  "repair",
  // 장애물
  "obstacle2",
  "obstacle2Ice",
  "obstacle3",
  // 보스
  "boss1",
  "boss2",
  "boss3",
  "boss4",
  "boss5",
  "bossBullet"
], R = [
  { key: "playerDance", frameWidth: 160, frameHeight: 260 },
  { key: "playerSad", frameWidth: 160, frameHeight: 260 },
  { key: "playerRepair", frameWidth: 240, frameHeight: 260 },
  { key: "double", frameWidth: 260, frameHeight: 260 },
  { key: "shield", frameWidth: 260, frameHeight: 260 },
  { key: "coin", frameWidth: 260, frameHeight: 260 },
  { key: "distance", frameWidth: 256, frameHeight: 130 },
  { key: "obstacle1", frameWidth: 400, frameHeight: 400 }
], W = [
  "bgm",
  "bossBgm",
  "coinBgm",
  "nextBgm",
  "buttonSound",
  "coinSound",
  "helperSound",
  "bulletHitSound",
  "explosionSound",
  "bossShootSound",
  "correctSound",
  "incorrectSound",
  "countdownSound",
  "nextLevelSound",
  "finalSound",
  "gameOverSound",
  "hitPlayerSound"
], V = [
  { key: "obstacle1Ani", spriteKey: "obstacle1", frames: { start: 0, end: 2 }, frameRate: 3 },
  { key: "coinAni", spriteKey: "coin", frames: { start: 0, end: 3 }, frameRate: 10 },
  { key: "shieldAni", spriteKey: "shield", frames: { start: 0, end: 3 }, frameRate: 10 },
  { key: "doubleAni", spriteKey: "double", frames: { start: 0, end: 3 }, frameRate: 10 },
  { key: "distanceAni", spriteKey: "distance", frames: { start: 3, end: 0 }, frameRate: 3 },
  { key: "playerDanceAni", spriteKey: "playerDance", frames: { start: 0, end: 4 }, frameRate: 5 },
  { key: "playerSadAni", spriteKey: "playerSad", frames: { start: 0, end: 4 }, frameRate: 5 },
  { key: "playerRepairAni", spriteKey: "playerRepair", frames: { start: 0, end: 4 }, frameRate: 5 }
];
function y(i, e) {
  i.on("pointerover", () => {
    (i.texture.key === "startButton" || i.texture.key === "howToPlayButton") && i.setTexture(i.texture.key + "Hover"), i.setScale(i.scaleX * 1.1), e.game.canvas.style.cursor = "pointer";
  }), i.on("pointerout", () => {
    (i.texture.key === "startButtonHover" || i.texture.key === "howToPlayButtonHover") && i.setTexture(i.texture.key.replace("Hover", "")), i.setScale(i.scaleX / 1.1), e.game.canvas.style.cursor = "default";
  });
}
function M(i, e = 45, t = 0.7) {
  return i.overlay && i.overlay.destroy(), i.overlay = i.add.rectangle(i.screenWidth / 2, i.screenHeight / 2, i.screenWidth, i.screenHeight, h.hex_black, t).setDepth(e).setInteractive(), i.overlay;
}
function T(i) {
  i.overlay && (i.overlay.destroy(), i.overlay = null);
}
function u(i) {
  return i && i.destroy(), null;
}
function S(i) {
  return i && i.clear(!0, !0), null;
}
function B(i = {}) {
  return {
    fontFamily: i.fontFamily || I,
    fontSize: i.fontSize || "20px",
    fontStyle: i.fontStyle || "bold",
    fill: i.fill || h.color_lollipop,
    stroke: i.stroke || h.color_snow,
    strokeThickness: i.strokeThickness || 4,
    align: i.align || "center",
    ...i
  };
}
function p(i, e, t = {}) {
  const s = { targets: e, duration: 300, ease: "Power2.out", ...t };
  return t.scale !== void 0 && (s.scaleX = t.scale, s.scaleY = t.scale, delete s.scale), i.tweens.add(s);
}
const v = {
  BUTTON_POSITION: { x: 70, y: 60 },
  BUTTON_SCALE: 0.2,
  BUTTON_DEPTH: 1e3,
  DEFAULT_BGM_VOLUME: 0.5,
  DEFAULT_SOUND_VOLUME: 1,
  VOLUMES: {
    coinSound: 0.3,
    buttonSound: 0.8,
    explosionSound: 0.6
  }
};
class f {
  static instance = null;
  /**
   * SoundManager 싱글톤 인스턴스를 반환
   * @param {Phaser.Scene} scene - 현재 씬
   * @returns {SoundManager|null} SoundManager 인스턴스 또는 null
   */
  static getInstance(e) {
    return e ? (f.instance ? f.instance.updateScene(e) : f.instance = new f(e), f.instance) : (console.warn("SoundManager: Scene is required"), null);
  }
  /**
   * SoundManager 생성자
   * @param {Phaser.Scene} scene - Phaser 씬 객체
   */
  constructor(e) {
    this.scene = e, this.isBGMMuted = !1, this.buttons = {
      bgm: { mute: null, sound: null }
      // 사운드 토글 버튼들
    }, this.currentBGM = null, this.soundCategories = this.initializeSoundCategories();
  }
  /**
   * 사운드를 BGM과 SFX로 분류
   * @returns {Object} bgm과 sfx 카테고리별 사운드 키 배열
   */
  initializeSoundCategories() {
    return {
      bgm: ["bgm", "bossBgm", "coinBgm", "nextBgm"],
      sfx: [
        "buttonSound",
        "coinSound",
        "helperSound",
        "bulletHitSound",
        "explosionSound",
        "bossShootSound",
        "correctSound",
        "incorrectSound",
        "countdownSound",
        "nextLevelSound",
        "finalSound",
        "gameOverSound",
        "hitPlayerSound"
      ]
    };
  }
  /**
   * 씬이 변경될 때 씬 참조를 업데이트
   * @param {Phaser.Scene} scene - 새로운 씬 객체
   */
  updateScene(e) {
    e !== this.scene && (this.scene = e);
  }
  /**
   * 화면에 사운드 토글 버튼들을 생성 (우측 하단에 배치)
   * @returns {Object} 생성된 버튼 객체들
   */
  createSoundButtons() {
    const { width: e, height: t } = this.scene.scale, s = e - v.BUTTON_POSITION.x, o = t - v.BUTTON_POSITION.y;
    return this.createButtonPair("bgm", s, o), this.buttons;
  }
  /**
   * 음소거 토글용 버튼 쌍 생성 (사운드 ON 버튼 + 뮤트 버튼)
   * @param {string} type - 버튼 타입 ('bgm')
   * @param {number} x - 버튼 X 좌표
   * @param {number} y - 버튼 Y 좌표
   */
  createButtonPair(e, t, s) {
    const o = !this.isBGMMuted;
    this.buttons[e].sound = this.createButton("soundButton", t, s, o, () => this.toggleMute()), this.buttons[e].mute = this.createButton("muteButton", t, s, !o, () => this.toggleMute());
  }
  /**
   * 개별 버튼 생성
   * @param {string} texture - 버튼 텍스처 키
   * @param {number} x - X 좌표
   * @param {number} y - Y 좌표
   * @param {boolean} visible - 초기 표시 여부
   * @param {Function} callback - 클릭 시 실행할 콜백 함수
   * @returns {Phaser.GameObjects.Image} 생성된 버튼 이미지
   */
  createButton(e, t, s, o, a) {
    const l = this.scene.add.image(t, s, e).setVisible(o).setScale(v.BUTTON_SCALE).setDepth(v.BUTTON_DEPTH).setInteractive();
    return y(l, this.scene), l.on("pointerdown", a), l;
  }
  /**
   * BGM 음소거 상태를 토글
   */
  toggleMute() {
    this.isBGMMuted = !this.isBGMMuted, this.updateButtonVisibility(), this.handleBGMToggle(), this.playSound("buttonSound");
  }
  /**
   * 음소거 상태에 따라 버튼 표시/숨김 전환
   */
  updateButtonVisibility() {
    const e = !this.isBGMMuted;
    this.buttons.bgm.sound.setVisible(e), this.buttons.bgm.mute.setVisible(!e);
  }
  /**
   * BGM 음소거 토글 시 재생 상태 처리
   */
  handleBGMToggle() {
    this.currentBGM && (this.isBGMMuted ? this.currentBGM.isPlaying && this.currentBGM.pause() : this.currentBGM.isPaused ? this.currentBGM.resume() : this.currentBGM.isPlaying || this.currentBGM.play());
  }
  /**
   * 배경음악(BGM) 설정 및 재생
   * @param {string} bgmKey - 재생할 BGM의 사운드 키
   */
  setBGM(e) {
    if (this.currentBGM?.key === e) {
      !this.currentBGM.isPlaying && !this.isBGMMuted && this.currentBGM.play();
      return;
    }
    this.stopCurrentBGM(), this.createNewBGM(e);
  }
  /**
   * 현재 재생 중인 BGM 중지 및 제거
   */
  stopCurrentBGM() {
    this.currentBGM && (this.currentBGM.stop(), this.currentBGM.destroy());
  }
  /**
   * 새로운 BGM 객체 생성 및 재생
   * @param {string} bgmKey - BGM 사운드 키
   */
  createNewBGM(e) {
    this.currentBGM = this.scene.sound.add(e, {
      loop: !0,
      volume: v.DEFAULT_BGM_VOLUME
    }), this.isBGMMuted || this.currentBGM.play();
  }
  /**
   * BGM 정지
   */
  stopBGM() {
    this.currentBGM && this.currentBGM.stop();
  }
  /**
   * BGM 일시정지
   */
  pauseBGM() {
    this.currentBGM && this.currentBGM.isPlaying && this.currentBGM.pause();
  }
  /**
   * 효과음(SFX) 재생
   * @param {string} soundKey - 재생할 사운드 키
   * @param {Object} options - Phaser 사운드 옵션 (volume, loop 등)
   * @returns {Phaser.Sound.BaseSound|null} 생성된 사운드 객체 또는 null
   */
  playSound(e, t = {}) {
    const o = { volume: v.VOLUMES[e] || v.DEFAULT_SOUND_VOLUME, loop: !1, ...t };
    return this.createAndPlaySound(e, o);
  }
  /**
   * 사운드 객체 생성 및 재생
   * @param {string} soundKey - 사운드 키
   * @param {Object} options - 사운드 재생 옵션
   * @returns {Phaser.Sound.BaseSound} 생성된 사운드 객체
   */
  createAndPlaySound(e, t) {
    const s = this.scene.sound.add(e, t);
    return s.stop(), s.play(), s;
  }
  /**
   * SoundManager 완전 제거 (싱글톤 인스턴스 포함)
   */
  destroy() {
    this.stopCurrentBGM(), Object.values(this.buttons).forEach((e) => {
      Object.values(e).forEach((t) => {
        t && t.destroy();
      });
    }), this.buttons = {
      bgm: { mute: null, sound: null }
    }, f.instance = null;
  }
}
class F extends Phaser.Scene {
  constructor() {
    super("MenuScene"), this.quizData = null, this.soundManager = null;
  }
  preload() {
    this.initScreen(), this.createLoadingBar(), this.loadImages(), this.loadAnimations(), this.loadSounds(), this.load.json("quizData", E("quizData.json"));
  }
  create() {
    this.setStartScene(), this.setSoundManager();
  }
  // ------------------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------------------
  /**
   * 화면 크기 초기화
   */
  initScreen() {
    const { width: e, height: t } = this.scale;
    this.screenWidth = e, this.screenHeight = t;
  }
  // ------------------------------------------------------------------------------------
  // ASSET LOADING
  // ------------------------------------------------------------------------------------
  /**
   * 게임에 필요한 모든 이미지 리소스 로드
   */
  loadImages() {
    U.forEach((e) => this.load.image(e, D(`${e}.png`))), R.forEach(({ key: e, frameWidth: t, frameHeight: s }) => this.load.spritesheet(e, D(`${e}.png`), { frameWidth: t, frameHeight: s }));
  }
  /**
   * 스프라이트 애니메이션 설정
   */
  loadAnimations() {
    this.load.on("complete", () => {
      V.forEach((e) => {
        this.anims.exists(e.key) || this.anims.create({ key: e.key, frames: this.anims.generateFrameNumbers(e.spriteKey, e.frames), frameRate: e.frameRate, repeat: -1 });
      });
    });
  }
  /**
   * 게임에 사용되는 모든 사운드 파일 로드
   */
  loadSounds() {
    W.forEach((e) => this.load.audio(e, _(`${e}.mp3`)));
  }
  // ------------------------------------------------------------------------------------
  // SCENE SETUP
  // ------------------------------------------------------------------------------------
  /**
   * 시작 화면 구성
   */
  setStartScene() {
    this.add.video(this.screenWidth / 2, this.screenHeight / 2, "introVideo").setOrigin(0.5).setLoop(!0).setScale(0.7).play();
    const e = this.add.image(this.screenWidth / 2, this.screenHeight / 2 - 400, "gameTitle").setOrigin(0.5).setScale(0);
    p(this, e, { scale: 0.7, duration: 1e3, ease: "Back.out" }), this.createStartButton(), this.createHowToPlayButton();
  }
  /**
   * 게임 시작 버튼 생성
   */
  createStartButton() {
    const e = this.add.image(this.screenWidth / 2 - 150, this.screenHeight / 2 - 100, "startButton").setOrigin(0.5).setScale(0.3).setInteractive();
    y(e, this), e.on("pointerdown", () => {
      const t = this.cache.json.get("quizData");
      this.scene.stop("MenuScene"), this.scene.start("GameScene", { quizData: t }), this.soundManager.playSound("buttonSound");
    });
  }
  /**
   * 게임 방법 버튼 생성
   */
  createHowToPlayButton() {
    const e = this.add.image(this.screenWidth / 2 + 150, this.screenHeight / 2 - 100, "howToPlayButton").setOrigin(0.5).setScale(0.3).setInteractive();
    y(e, this), e.on("pointerdown", () => this.showHowToPlayPopup());
  }
  /**
   * SoundManager 인스턴스 초기화
   */
  setSoundManager() {
    this.soundManager = f.getInstance(this);
  }
  // ------------------------------------------------------------------------------------
  // LOADING BAR
  // ------------------------------------------------------------------------------------
  /**
   * 리소스 로딩 진행 상황을 표시하는 로딩바 생성
   */
  createLoadingBar() {
    this.cameras.main.setBackgroundColor(h.hex_loadingBg);
    const e = { x: this.screenWidth / 2 - 250, y: this.screenHeight / 2 - 15, width: 500, height: 30, radius: 15 }, t = this.add.graphics().lineStyle(3, h.hex_loadingBar, 1).strokeRoundedRect(e.x - 3, e.y - 3, e.width + 6, e.height + 6, e.radius + 3).setDepth(10), s = this.add.graphics().lineStyle(2, h.hex_snow, 1).strokeRoundedRect(e.x - 1, e.y - 1, e.width + 2, e.height + 2, e.radius + 1).setDepth(11), o = this.add.graphics().fillStyle(h.hex_snow, 1).fillRoundedRect(e.x, e.y, e.width, e.height, e.radius).setDepth(12), a = this.add.graphics().setDepth(13);
    this.anims.exists("loadingAni") || this.anims.create({ key: "loadingAni", frames: this.anims.generateFrameNumbers("loading", { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    const l = this.add.sprite(e.x, e.y - 60, "loading").setDepth(14).setScale(1.5).play("loadingAni");
    this.load.on("progress", (n) => {
      a.clear(), a.fillStyle(h.hex_loadingBar, 1);
      const r = e.width * n, c = 50, g = e.width - c * 2, d = e.x + c + g * n;
      a.fillRoundedRect(e.x, e.y, r, e.height, e.radius), l.setX(d);
    }), this.load.on("complete", () => [t, s, o, a, l].forEach((n) => n.destroy()));
  }
  // ------------------------------------------------------------------------------------
  // POPUP SYSTEM
  // ------------------------------------------------------------------------------------
  /**
   * 게임 방법 팝업 표시
   */
  showHowToPlayPopup() {
    this.soundManager.playSound("buttonSound");
    let e = 1;
    const t = this.createPopupElements(e);
    this.setPopupEvents(t, e), this.animatePopupEntrance(t);
  }
  /**
   * 팝업 UI 요소 생성 (오버레이, 가이드 이미지, 버튼 등)
   */
  createPopupElements(e) {
    const { screenWidth: t, screenHeight: s } = this, o = this.add.rectangle(t / 2, s / 2, t, s, h.hex_black, 0.7).setDepth(100).setInteractive(), a = this.add.image(t / 2, s / 2, "guide1").setOrigin(0.5).setDepth(101).setScale(0.8), l = this.add.image(t / 2 - 300, s / 2, "leftArrow").setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive(), n = this.add.image(t / 2 + 300, s / 2, "rightArrow").setOrigin(0.5).setDepth(102).setScale(0.2).setInteractive(), r = this.add.text(t / 2, s / 2 + 400, `${e}/5`, {
      fontSize: "28px",
      fill: h.color_deepBlue,
      fontFamily: "Cafe24Surround",
      stroke: h.color_snow,
      strokeThickness: 3,
      backgroundColor: h.color_snow
    }).setOrigin(0.5).setDepth(102), c = this.add.image(t / 2, s - 150, "closeButton").setOrigin(0.5).setDepth(102).setScale(0.3).setInteractive();
    return y(l, this), y(n, this), y(c, this), { overlay: o, guideImage: a, leftArrow: l, rightArrow: n, pageIndicator: r, closeButton: c };
  }
  /**
   * 팝업 이벤트 핸들러 설정
   */
  setPopupEvents(e, t) {
    const { overlay: s, guideImage: o, leftArrow: a, rightArrow: l, pageIndicator: n, closeButton: r } = e, c = () => {
      o.setTexture(`guide${t}`), n.setText(`${t}/5`);
    }, g = (m) => {
      this.soundManager.playSound("buttonSound"), t = (t + m - 1 + 5) % 5 + 1, c();
    };
    a.on("pointerdown", () => g(-1)), l.on("pointerdown", () => g(1));
    const d = () => {
      this.soundManager.playSound("buttonSound"), Object.values(e).forEach((m) => m.destroy()), this.game.canvas.style.cursor = "default";
    };
    r.on("pointerdown", d), s.on("pointerdown", d);
  }
  /**
   * 팝업 등장 애니메이션
   */
  animatePopupEntrance(e) {
    const { guideImage: t } = e;
    t.setScale(0), p(this, t, { scale: 0.8, duration: 300, ease: "Back.out" });
  }
}
const H = {
  /**
   * 뱀 장애물
   * 좌우로 물결치며 움직이고, 파괴 시 더블샷 또는 쉴드 드롭
   */
  snake: {
    key: "obstacle1",
    scale: 0.3,
    margin: 150,
    hitCount: 2,
    animation: "obstacle1Ani",
    rewards: ["double", "shield"],
    behavior: {
      type: "wave",
      amplitude: 8,
      frequency: 2e3,
      offset: 100
    },
    onFirstHit: (i) => {
      i.isHit = !0;
    },
    onSecondHit: (i, e) => {
      const t = Phaser.Math.Between(0, 1) === 0 ? "double" : "shield", s = e[t + "s"].create(i.x, i.y, t);
      s.setScale(0.3), s.setSize(s.width * 0.8, s.height * 0.8), s.play(t + "Ani"), s.body.setVelocityY(e.obstacleSpeed), i.destroy();
    }
  },
  /**
   * 선인장 장애물
   * 고정 위치, 첫 타격 시 얼음 텍스처로 변경, 파괴 시 코인 드롭
   */
  cactus: {
    key: "obstacle2",
    scale: 0.3,
    margin: 150,
    hitCount: 2,
    animation: null,
    rewards: ["coin"],
    behavior: {
      type: "static"
    },
    onFirstHit: (i) => {
      i.setTexture("obstacle2Ice");
    },
    onSecondHit: (i, e) => {
      const t = e.coins.create(i.x, i.y, "coin");
      t.setScale(0.3), t.setSize(t.width * 0.8, t.height * 0.8), t.play("coinAni"), t.body.setVelocityY(e.obstacleSpeed), i.destroy();
    }
  },
  /**
   * 바위 장애물
   * 고정 위치, 첫 타격 시 크기 감소, 파괴 시 코인 2개 드롭
   */
  rock: {
    key: "obstacle3",
    scale: 0.4,
    margin: 200,
    hitCount: 2,
    animation: null,
    rewards: ["coin", "coin"],
    behavior: {
      type: "static"
    },
    onFirstHit: (i) => {
      i.setScale(i.scaleX * 0.8), i.setSize(i.width * 0.8, i.height * 0.8);
    },
    onSecondHit: (i, e) => {
      for (let t = -1; t <= 1; t += 2) {
        const s = e.coins.create(i.x + t * 20, i.y, "coin");
        s.setScale(0.3), s.setSize(s.width * 0.8, s.height * 0.8), s.play("coinAni"), s.body.setVelocityY(e.obstacleSpeed);
      }
      i.destroy();
    }
  }
}, z = {
  0: "snake",
  1: "cactus",
  2: "rock"
};
function A(i) {
  const e = Object.keys(H).find((t) => H[t].key === i);
  return H[e];
}
function N(i) {
  const e = z[i];
  return H[e];
}
const x = (i, e, t) => {
  const s = i.get(e, t);
  return s && s.setScale(0.1), s;
}, O = (i, e, t) => {
  i.body.setVelocity(Math.cos(e) * t, Math.sin(e) * t);
}, X = {
  /**
   * 직선 패턴: 여러 줄로 아래로 발사
   */
  straight: {
    execute: (i, e, t, s) => {
      const o = b[s].bossBullet;
      for (let a = 0; a < o; a++) {
        const l = x(t, e.x + (a - 1) * 30, e.y + 50);
        l && (l.body.setVelocityY(300), l.body.setVelocityX((a - 1) * 50));
      }
    }
  },
  /**
   * 부채꼴 패턴: 일정 각도로 퍼지며 발사
   */
  fan: {
    execute: (i, e, t, s) => {
      const a = b[s].bossBullet, l = 90 - 30 * Math.floor(a / 2);
      for (let n = 0; n < a; n++) {
        const r = Phaser.Math.DegToRad(l + n * 30), c = x(t, e.x, e.y + 50);
        c && O(c, r, 250);
      }
    }
  },
  /**
   * 추적 패턴: 플레이어 방향으로 발사
   */
  tracking: {
    execute: (i, e, t, s) => {
      const o = Phaser.Math.Angle.Between(e.x, e.y, i.player.x, i.player.y), a = b[s].bossBullet;
      for (let l = 0; l < a; l++) {
        const n = (l - 1) * 0.3, r = o + n, c = x(t, e.x, e.y + 50);
        c && O(c, r, 250);
      }
    }
  },
  /**
   * 원형 패턴: 360도 전방향으로 발사
   */
  circle: {
    execute: (i, e, t, s) => {
      for (let a = 0; a < 6; a++) {
        const l = a / 6 * Math.PI * 2, n = x(t, e.x, e.y + 50);
        n && O(n, l, 200);
      }
    }
  },
  /**
   * 나선 패턴: 회전하며 발사
   */
  spiral: {
    execute: (i, e, t, s) => {
      for (let l = 0; l < 4; l++) {
        const n = l / 4 * Math.PI * 2 + 5e-3, r = x(t, e.x, e.y + 50);
        r && O(r, n, 250);
      }
    }
  },
  /**
   * V자 패턴: V자 모양으로 발사
   */
  vShape: {
    execute: (i, e, t, s) => {
      for (let a = 0; a < 4; a++) {
        const l = a % 2 === 0 ? -1 : 1, n = Math.floor(a / 2), r = Phaser.Math.DegToRad(l * (15 + n * 10)), c = x(t, e.x, e.y + 50);
        c && c.body.setVelocity(Math.sin(r) * 300, Math.cos(r) * 300);
      }
    }
  }
};
function L(i) {
  const e = ["straight", "fan", "tracking", "circle", "spiral", "vShape"], t = e[Phaser.Math.Between(0, e.length - 1)], s = X[t];
  s && s.execute(i, i.boss, i.bossBullets, i.level);
}
class Y extends Phaser.Scene {
  constructor() {
    super("GameScene"), this.initVariables();
  }
  initVariables() {
    this.screenWidth = 0, this.screenHeight = 0, this.background = null, this.backgroundSpeed = 426, this.cursors = null, this.quizData = null, this.overlay = null, this.soundManager = null, this.player = null, this.playerBullets = null, this.playerShake = 0, this.bulletTime = null, this.doubleTime = null, this.boss = null, this.bossBullets = null, this.bossBulletTime = null, this.bossHealthBg = null, this.bossBarBg = null, this.bossBar = null, this.obstacles = null, this.obstacleSpeed = 426, this.obstacleTime = null, this.obstacleType = 0, this.obstacleNum = 0, this.maxObstacles = 30, this.dragOffsetX = 0, this.score = 0, this.distance = 0, this.level = 1, this.maxLevel = 10, this.walkies = null, this.repairSprite = null, this.isGameOver = !1, this.isPaused = !1, this.isBossShown = !1, this.isInvincible = !1, this.isRevivePopupShown = !1, this.isDragging = !1, this.scoreUI = null, this.distanceUI = null, this.walkieUI = null, this.repairUI = null, this.levelBg = null, this.levelBar = null, this.levelText = null;
  }
  // ------------------------------------------------------------------------------------
  // CREATE
  // ------------------------------------------------------------------------------------
  create(e) {
    this.initScreen(), this.initSound(), this.initQuiz(e), this.createGameObjects(), this.setCollisions(), this.setInput(), this.setTimers(), this.setUI();
  }
  initScreen() {
    const { width: e, height: t } = this.scale;
    this.screenWidth = e, this.screenHeight = t;
  }
  initSound() {
    this.soundManager = f.getInstance(this), this.soundManager.createSoundButtons(), this.soundManager.setBGM("bgm");
  }
  initQuiz(e) {
    this.quizData = e?.quizData || [], this.isGameOver = !1;
  }
  createGameObjects() {
    this.background = this.add.tileSprite(360, 640, 720, 1280, "background"), this.player = this.physics.add.sprite(360, 1120, "player").setScale(0.3), this.player.body.setSize(this.player.width * 0.9, this.player.height * 0.9), this.player.setCollideWorldBounds(!0), this.playerBullets = this.physics.add.group({ defaultKey: "playerBullet" }), this.bossBullets = this.physics.add.group({ defaultKey: "bossBullet" }), this.obstacles = this.physics.add.group(), this.coins = this.physics.add.group(), this.shields = this.physics.add.group(), this.doubles = this.physics.add.group(), this.walkies = this.physics.add.group();
  }
  setCollisions() {
    this.physics.add.overlap(this.player, this.obstacles, this.playerHitObstacle, null, this), this.physics.add.overlap(this.player, this.bossBullets, this.bossBulletHitPlayer, null, this), this.physics.add.overlap(this.playerBullets, this.obstacles, this.playerBulletHitObstacle, null, this), this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this), this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this), this.physics.add.overlap(this.player, this.doubles, this.collectDouble, null, this), this.physics.add.overlap(this.player, this.walkies, this.collectWalkie, null, this);
  }
  setInput() {
    this.cursors = this.input.keyboard.createCursorKeys(), this.input.on("pointerdown", (e) => {
      this.player && Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 150 && (this.isDragging = !0, this.dragOffsetX = this.player.x - e.x);
    }), this.input.on("pointerup", () => this.isDragging = !1), this.input.on("pointermove", (e) => {
      if (this.isDragging)
        if (this.isBossShown) {
          let t = e.x + this.dragOffsetX, s = e.y;
          t = Math.max(150, Math.min(t, this.screenWidth - 150)), s = Math.max(150, Math.min(s, this.screenHeight - 150)), this.player.x = t, this.player.y = s;
        } else {
          let t = e.x + this.dragOffsetX;
          t = Math.max(150, Math.min(t, this.screenWidth - 150)), this.player.x = t;
        }
    });
  }
  setTimers() {
    this.createObstacleTimer(), this.createBulletTimer();
  }
  setUI() {
    this.createButtons(), this.createGameUI();
  }
  createGameUI() {
    [
      { name: "score", x: 100, y: 50, iconKey: "coin", iconScale: 0.2, initialValue: "0", textColor: h.color_black, animation: "coinAni", textProperty: "scoreUI" },
      { name: "distance", x: 100, y: 120, iconKey: "distance", iconScale: 0.2, initialValue: "0m", textColor: h.color_black, animation: "distanceAni", textProperty: "distanceUI", textOffsetX: 10 },
      { name: "walkie", x: 100, y: this.screenHeight - 40, iconKey: "walkie", iconScale: 0.2, initialValue: "3", textColor: h.color_black, textProperty: "walkieUI" },
      { name: "repair", x: 260, y: this.screenHeight - 40, iconKey: "repair", iconScale: 0.15, initialValue: "0", textColor: h.color_black, textProperty: "repairUI" }
    ].forEach((t) => {
      const s = this.createUIElement(t);
      this[t.textProperty] = s.text;
    }), this.createLevelProgressBar();
  }
  createUIElement(e) {
    const t = this.add.container(e.x, e.y).setDepth(20), s = this.add.graphics().fillStyle(h.hex_snow, 0.6).fillRoundedRect(-70, -28, 140, 56, 20), o = e.animation !== void 0, a = o ? this.add.sprite(-35, 0, e.iconKey) : this.add.image(-35, 0, e.iconKey);
    a.setScale(e.iconScale), o && a.play(e.animation);
    const l = e.textOffsetX ? 20 + e.textOffsetX : 20, n = this.add.text(l, 0, e.initialValue, { fontSize: "24px", fill: e.textColor, fontFamily: I }).setOrigin(0.5);
    return t.add([s, a, n]), { container: t, icon: a, text: n };
  }
  createLevelProgressBar() {
    const s = (this.screenWidth - 350) / 2, o = 24;
    this.levelBg = this.add.graphics(), this.levelBg.fillStyle(h.hex_snow, 0.6).fillRoundedRect(s, o, 350, 30, 12).setDepth(30), this.levelBar = this.add.graphics(), this.levelBar.setDepth(31), this.updateLevelProgressBar(), this.levelText = this.add.text(
      this.screenWidth / 2,
      o + 30 / 2,
      `Level ${this.level}`,
      B({ fill: h.color_black, stroke: "transparent", strokeThickness: 0 })
    ).setOrigin(0.5).setDepth(32);
  }
  updateLevelProgressBar() {
    if (!this.levelBar) return;
    const e = 350, t = 30, s = (this.screenWidth - e) / 2, o = 24, a = Math.min(this.level, 10) / 10;
    this.levelBar.clear(), this.levelBar.fillStyle(h.hex_mint, 1), this.levelBar.fillRoundedRect(s, o, e * a, t, 12), this.levelText && this.levelText.setText(`Level ${this.level}`);
  }
  createButtons() {
    this.playButton = this.add.image(this.screenWidth - 50, 50, "playButton").setScale(0.2).setDepth(40).setVisible(!1).setInteractive(), this.playButton.on("pointerdown", () => {
      this.playButton.setVisible(!1), this.pauseButton.setVisible(!0), this.gameResume();
    }), this.pauseButton = this.add.image(this.screenWidth - 50, 50, "pauseButton").setScale(0.2).setDepth(40).setVisible(!0).setInteractive(), y(this.pauseButton, this), this.pauseButton.on("pointerdown", () => {
      this.soundManager.playSound("buttonSound"), this.pauseButton.setVisible(!1), this.playButton.setVisible(!0), this.gamePause(), this.showPauseMenu();
    });
  }
  gamePause() {
    this.isPaused = !0, this.physics.pause(), this.sound.pauseAll(), this.toggleAnimations(!0), this.toggleTimers(!0);
  }
  gameResume() {
    this.isPaused = !1, this.physics.resume(), this.sound.resumeAll(), this.toggleAnimations(!1), this.toggleTimers(!1), this.hidePauseMenu();
  }
  showPauseMenu() {
    this.pauseOverlay = M(this, 100, 0), p(this, this.pauseOverlay, { fillAlpha: 0.7, duration: 300 }), this.resumeButton = this.add.image(this.screenWidth / 2 - 140, this.screenHeight / 2 + 20, "replayButton").setScale(0).setAlpha(0).setDepth(101).setInteractive(), y(this.resumeButton, this), this.resumeButton.on("pointerdown", () => {
      this.soundManager.playSound("buttonSound"), this.playButton.setVisible(!1), this.pauseButton.setVisible(!0), this.gameResume();
    }), this.quitButton = this.add.image(this.screenWidth / 2 + 140, this.screenHeight / 2 + 20, "goHomeButton").setScale(0).setAlpha(0).setDepth(101).setInteractive(), y(this.quitButton, this), this.quitButton.on("pointerdown", () => {
      this.soundManager.playSound("buttonSound"), this.hidePauseMenu(), this.handleQuit();
    }), p(this, [this.resumeButton, this.quitButton], { scale: 0.3, alpha: 1, duration: 400, ease: "Back.out", delay: 200 });
  }
  hidePauseMenu() {
    this.pauseOverlay = u(this.pauseOverlay), this.resumeButton = u(this.resumeButton), this.quitButton = u(this.quitButton), this.game.canvas.style.cursor = "default";
  }
  createObstacle() {
    if (this.isGameOver || this.isPaused || this.obstacleNum >= this.maxObstacles && this.obstacleTime) {
      this.obstacleTime.destroy(), this.obstacleTime = null;
      return;
    }
    this.obstacleType = (this.obstacleType + 1) % 3;
    const e = N(this.obstacleType);
    if (e.key === "obstacle1") {
      const t = b[this.level].obstacleNum, s = 220, a = (720 - (t - 1) * s) / 2;
      for (let l = 0; l < t; l++) {
        let n = a + l * s;
        n = Math.max(e.margin, Math.min(n, 720 - e.margin));
        const r = this.obstacles.create(n, -100, e.key);
        this.setObstacle(r, e);
      }
      this.obstacleNum++;
    } else {
      const t = Phaser.Math.Between(e.margin, 720 - e.margin), s = this.obstacles.create(t, -100, e.key);
      this.setObstacle(s, e), this.obstacleNum++;
    }
  }
  setObstacle(e, t) {
    e.originalType = t.key, e.setScale(t.scale), e.setSize(e.width * 0.9, e.height * 0.9), e.setVelocityY(this.obstacleSpeed), t.animation && e.play(t.animation);
  }
  // ------------------------------------------------------------------------------------ 충돌 처리 메서드들
  handlePlayerHit(e, t) {
    if (!(this.isGameOver || this.isInvincible)) {
      if (e.shieldOverlay) {
        e.shieldOverlay.destroy(), e.shieldOverlay = null, t && t.destroy ? t.destroy() : e.y += 400;
        return;
      }
      t && t.destroy(), e.setTexture("playerHit"), this.obstacleTime && (this.obstacleTime.remove(), this.obstacleTime = null), this.doubleTime && this.doubleStartTime && (this.doubleTime.paused = !0, this.doublePausedTime = this.time.now), this.bulletTime && (this.bulletTime.paused = !0), this.gamePause(), this.showRevivePopup();
    }
  }
  // 플레이어 vs 장애물(player 처리)
  playerHitObstacle(e, t) {
    this.handlePlayerHit(e, t);
  }
  // 보스 총알 vs 플레이어(player 처리)
  bossBulletHitPlayer(e, t) {
    this.handlePlayerHit(e, t);
  }
  // 보스 vs 플레이어(player 처리)
  bossHitPlayer(e, t) {
    this.handlePlayerHit(e, null);
  }
  // 플레이어 총알 vs 장애물(obstacle 처리)
  playerBulletHitObstacle(e, t) {
    this.soundManager.playSound("bulletHitSound"), e.destroy(), t.hitCount = t.hitCount || 0, t.hitCount += 1;
    const s = this.add.text(t.x, t.y - 30, `Hit ${t.hitCount}`, B());
    this.time.delayedCall(500, () => s.destroy());
    const o = A(t.originalType);
    o && (t.hitCount === 1 ? o.onFirstHit(t) : t.hitCount >= o.hitCount && o.onSecondHit(t, this));
  }
  // 플레이어 총알 vs 보스(boss 처리)
  playerBulletHitBoss(e, t) {
    switch (this.soundManager.playSound("bulletHitSound"), t.destroy(), e.hitCount += 1, this.updateBossHealthUI(), e.hitCount) {
      case 1:
        e.setTexture("boss2");
        break;
      case b[this.level].bossHit / 4:
        e.setTexture("boss3");
        break;
      case b[this.level].bossHit / 2:
        e.setTexture("boss4");
        break;
      case b[this.level].bossHit:
        e.setTexture("boss5"), this.defeatBoss(e);
        break;
    }
  }
  // ------------------------------------------------------------------------------------ 아이템 수집 메서드들
  collectCoin(e, t) {
    this.soundManager.playSound("coinSound"), t.destroy(), this.score += 10, this.scoreUI.setText(this.score);
    const s = this.add.text(t.x, t.y - 30, "+10", B());
    p(this, s, { y: s.y - 50, alpha: 0, duration: 800, onComplete: () => s.destroy() });
  }
  collectShield(e, t) {
    this.soundManager.playSound("helperSound"), t.destroy(), e.shieldOverlay && (e.shieldOverlay.destroy(), e.shieldOverlay = null, this.isInvincible = !0, this.time.delayedCall(1e3, () => this.isInvincible = !1));
    const s = this.add.graphics();
    s.fillStyle(h.hex_ice, 0.3), s.fillCircle(0, 0, e.width * 0.2), s.setDepth(1), s.x = e.x, s.y = e.y, e.shieldOverlay = s;
  }
  collectDouble(e, t) {
    this.soundManager.playSound("helperSound"), t.destroy(), this.doubleTime && this.doubleTime.destroy(), this.bulletTime && this.bulletTime.destroy(), this.createDoubleTimerUI(), this.bulletTime = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.isGameOver || this.isInvincible || (this.createPlayerBullet(this.player.x - 25, this.player.y - 50), this.createPlayerBullet(this.player.x + 25, this.player.y - 50));
      },
      loop: !0
    }), this.doubleTime = this.time.delayedCall(2e4, () => {
      this.bulletTime && this.bulletTime.destroy(), this.removeDoubleTimerUI(), this.bulletTime = this.time.addEvent({
        // 원래 단일 총알 타이머 복구
        delay: 500,
        callback: () => {
          this.isGameOver || this.isInvincible || this.createPlayerBullet();
        },
        loop: !0
      }), this.doubleTime = null;
    });
  }
  collectWalkie(e, t) {
    t.destroy();
    const s = parseInt(this.walkieUI.text);
    this.walkieUI.setText(s + 1);
  }
  // ------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------
  async update(e, t) {
    if (!(this.isGameOver || this.isPaused || this.level > this.maxLevel)) {
      if (this.updateBackground(t), this.isDragging) {
        this.handleDragMode(t);
        return;
      }
      this.handleBossSpawn(), this.handlePlayerMovement(), this.updateGameElements(t), this.cleanupObjects(), this.updateUI();
    }
  }
  updateBackground(e) {
    !this.isPaused && !this.isGameOver && !this.isBossShown && (this.background.tilePositionY -= this.backgroundSpeed * (e / 1e3));
  }
  handleDragMode(e) {
    this.player.setVelocityX(0), this.updateAttachedElements(), this.updateDistance(e), this.updateSnakeMovement(), this.boss && this.boss.active && this.updateBossHealthUI();
  }
  updateAttachedElements() {
    if (this.player && this.player.shieldOverlay && (this.player.shieldOverlay.x = this.player.x, this.player.shieldOverlay.y = this.player.y), this.player && this.doubleTimerBar) {
      const e = this.player.x, t = this.player.y - 80;
      this.doubleTimerBg && (this.doubleTimerBg.x = e, this.doubleTimerBg.y = t), this.doubleTimerBarBg && (this.doubleTimerBarBg.x = e, this.doubleTimerBarBg.y = t), this.doubleTimerBar.x = e, this.doubleTimerBar.y = t, this.updateDoubleTimerUI();
    }
  }
  updateDistance(e) {
    const t = b[this.level].bossDistance / 100, s = this.distance >= t;
    !this.isBossShown && !s && (this.distance += e / 1e3, this.distanceUI.setText(`${Math.floor(this.distance)}m`));
  }
  updateSnakeMovement() {
    this.obstacles.children.entries.forEach((e) => {
      const t = A(e.originalType);
      if (t && t.behavior.type === "wave" && !e.isHit) {
        const { amplitude: s, frequency: o, offset: a } = t.behavior, l = e.x + Math.sin(Date.now() / o + e.y / a) * s, n = e.width * e.scaleX * 0.5, r = 150 + n, c = this.screenWidth - 150 - n;
        l >= r && l <= c && e.setX(l);
      }
    });
  }
  handleBossSpawn() {
    const e = b[this.level].bossDistance / 100, t = this.distance >= e, s = this.obstacles.children.entries.length === 0;
    if (this.obstacleNum >= this.maxObstacles && s && t && !this.isGameOver && !this.isBossShown) {
      this.triggerBossAppearance();
      return;
    }
    this.boss && this.boss.active && this.boss.y >= 245 && (this.boss.y = 250, this.boss.setVelocityY(0));
  }
  triggerBossAppearance() {
    this.isBossShown = !0, this.sound.stopAll(), this.soundManager.setBGM("bossBgm");
    const e = this.screenHeight * 0.3, t = this.add.graphics({ x: 0, y: 0 }).setDepth(100);
    for (let s = 0; s < e; s += 4) {
      const o = 0.7 * (1 - s / e);
      t.fillStyle(h.hex_lollipop, o), t.fillRect(0, s, this.screenWidth, 4);
    }
    p(this, t, { alpha: 0.2, duration: 300, yoyo: !0, repeat: 7, ease: "Power2.inOut" }), this.time.delayedCall(1e3, () => {
      t.destroy(), this.showBoss();
    });
  }
  handlePlayerMovement() {
    this.isBossShown ? (this.cursors.left.isDown && this.player.x > 150 ? this.player.setVelocityX(-540) : this.cursors.right.isDown && this.player.x < this.screenWidth - 150 ? this.player.setVelocityX(540) : this.player.setVelocityX(0), this.cursors.up.isDown && this.player.y > 150 ? this.player.setVelocityY(-540) : this.cursors.down.isDown && this.player.y < this.screenHeight - 150 ? this.player.setVelocityY(540) : this.player.setVelocityY(0)) : this.cursors.left.isDown && this.player.x > 150 ? this.player.setVelocityX(-540) : this.cursors.right.isDown && this.player.x < this.screenWidth - 150 ? this.player.setVelocityX(540) : (this.player.setVelocityX(0), this.playerShake = 3), this.updateAttachedElements(), this.playerShake > 0 && (this.player.y += Math.sin(Date.now() / 40) * 2);
  }
  updateGameElements(e) {
    this.updateDistance(e), this.updateSnakeMovement();
  }
  cleanupObjects() {
    const e = { top: -50, bottom: 1330 };
    this.playerBullets.children.entries.forEach((t) => t.y < e.top && t.destroy()), this.bossBullets.children.entries.forEach((t) => t.y > e.bottom && t.destroy()), this.obstacles.children.entries.forEach((t) => t.y > e.bottom && t.destroy()), [this.coins, this.shields].forEach((t) => t.children.entries.forEach((s) => s.y > e.bottom && s.destroy()));
  }
  updateUI() {
    this.updateDoubleTimerUI(), this.boss && this.boss.active && this.updateBossHealthUI();
  }
  updateDoubleTimerUI() {
    if (!this.doubleTimerBg || !this.player || !this.doubleCountdownText) return;
    const e = this.time.now - this.doubleStartTime, t = Math.max(0, this.doubleDuration - e), s = Math.ceil(t / 1e3), o = this.player.x, a = this.player.y - 80;
    this.doubleTimerBg.x = o, this.doubleTimerBg.y = a, this.doubleCountdownText.x = o, this.doubleCountdownText.y = a, this.doubleCountdownText.setText(s.toString()), s <= 5 ? this.doubleCountdownText.setFill(h.color_lollipop) : s <= 10 ? this.doubleCountdownText.setFill(h.color_candy) : this.doubleCountdownText.setFill(h.color_snow), s <= 0 && this.removeDoubleTimerUI();
  }
  createDoubleTimerUI() {
    this.removeDoubleTimerUI(), this.doubleTimerBg = this.add.graphics(), this.doubleTimerBg.fillStyle(h.hex_black, 0.7), this.doubleTimerBg.fillCircle(0, 0, 35), this.doubleTimerBg.setDepth(10), this.doubleCountdownText = this.add.text(
      0,
      0,
      "20",
      B({ fontSize: "28px", fill: h.color_snow, stroke: h.color_deepBlue, strokeThickness: 3 })
    ).setOrigin(0.5).setDepth(12), this.doubleStartTime = this.time.now, this.doubleDuration = 2e4;
  }
  removeDoubleTimerUI() {
    this.doubleTimerBg = u(this.doubleTimerBg), this.doubleCountdownText = u(this.doubleCountdownText);
  }
  updateBossHealthUI() {
    if (!this.bossBar || !this.boss) return;
    const e = b[this.level].bossHit, s = Math.max(0, e - this.boss.hitCount) / e, o = this.boss.x, a = this.boss.y - 160;
    this.bossHealthBg.x = o, this.bossHealthBg.y = a, this.bossBarBg.x = o, this.bossBarBg.y = a, this.bossBar.x = o, this.bossBar.y = a, this.bossBar.clear();
    let l = h.hex_greenTea;
    s < 0.3 ? l = h.hex_lollipop : s < 0.6 && (l = h.hex_candy), this.bossBar.fillStyle(l, 1);
    const n = 200 * s;
    this.bossBar.fillRoundedRect(-100, -10, n, 20, 10);
  }
  createBossHealthUI() {
    this.removeBossHealthUI(), this.bossHealthBg = this.add.graphics(), this.bossHealthBg.fillStyle(h.hex_black, 0.7), this.bossHealthBg.fillRoundedRect(-110, -20, 220, 40, 15), this.bossHealthBg.setDepth(15), this.bossBarBg = this.add.graphics(), this.bossBarBg.fillStyle(h.hex_black, 0.7), this.bossBarBg.fillRoundedRect(-100, -10, 200, 20, 10), this.bossBarBg.setDepth(16), this.bossBar = this.add.graphics(), this.bossBar.setDepth(17);
  }
  removeBossHealthUI() {
    this.bossHealthBg = u(this.bossHealthBg), this.bossBarBg = u(this.bossBarBg), this.bossBar = u(this.bossBar);
  }
  createBossBullet() {
    !this.boss || !this.boss.active || this.isGameOver || this.isPaused || (L(this), this.soundManager.playSound("bossShootSound"));
  }
  defeatBoss(e) {
    this.bossBulletTime = u(this.bossBulletTime), this.removeBossHealthUI(), this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: e,
        alpha: 0,
        duration: 1e3,
        onComplete: () => {
          e.destroy(), this.bossBullets.clear(!0, !0), this.sound.stopAll(), this.soundManager.setBGM("coinBgm");
          for (let t = 0; t < 20; t++) {
            const s = Phaser.Math.Between(100, 620), o = Phaser.Math.Between(200, 800), a = this.coins.create(s, o, "coin");
            a.setScale(0.3), a.setSize(a.width * 0.8, a.height * 0.8), a.play("coinAni");
          }
          for (let t = 0; t < b[this.level].walkieReward; t++) {
            const s = Phaser.Math.Between(100, 620), o = Phaser.Math.Between(200, 800), a = this.walkies.create(s, o, "walkie");
            a.setScale(0.3), a.body.setSize(a.width * 0.8, a.height * 0.8);
          }
          this.time.delayedCall(6e3, () => this.nextLevel());
        }
      });
    });
  }
  createObstacleTimer() {
    this.obstacleTime = this.time.addEvent({ delay: 1e3, callback: this.createObstacle, callbackScope: this, loop: !0 });
  }
  createBulletTimer() {
    this.bulletTime = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.isGameOver || this.createPlayerBullet();
      },
      loop: !0
    });
  }
  showBoss() {
    this.boss = this.physics.add.sprite(this.screenWidth / 2, -100, "boss1"), this.boss.type = "boss1", this.boss.body.setSize(this.boss.width * 0.8, this.boss.height * 0.8), this.boss.setScale(0.4), this.boss.hitCount = 0, this.createBossHealthUI();
    const e = 250, t = 3500, s = 120, o = 900;
    this.tweens.add({ targets: this.boss, y: e, duration: t, ease: "Sine.easeInOut" }), this.tweens.add({
      targets: this.boss,
      x: {
        getStart: () => this.screenWidth / 2 - s,
        getEnd: () => this.screenWidth / 2 + s
      },
      duration: o,
      yoyo: !0,
      repeat: -1,
      ease: "Sine.easeInOut"
    }), this.bossBulletTime = this.time.addEvent({ delay: 3e3, callback: this.createBossBullet, callbackScope: this, loop: !0 }), this.physics.add.overlap(this.playerBullets, this.boss, this.playerBulletHitBoss, null, this), this.physics.add.overlap(this.player, this.boss, this.bossHitPlayer, null, this);
  }
  showRevivePopup(e = !1) {
    if (this.isRevivePopupShown) return;
    this.isRevivePopupShown = !0, this.isGameOver && this.soundManager.stopAll(), this.soundManager.playSound("hitPlayerSound");
    const t = this.player.hitCount || 0, s = t * 2 + 1, o = parseInt(this.walkieUI.text), a = o >= s;
    M(this, 45);
    const l = this.add.image(this.screenWidth / 2, this.screenHeight / 2, "revivePopup").setScale(0).setDepth(50).setAlpha(0);
    p(this, l, { scale: 1.6, alpha: 1, duration: 400, ease: "Back.out", delay: 100 });
    const n = this.add.container(this.screenWidth / 2 + 20, this.screenHeight / 2 - 260).setDepth(51).setAlpha(0), r = this.add.text(
      0,
      -30,
      e ? "오답이에요!" : `${t + 1}번째 충돌!`,
      B({ fontSize: "32px", fill: e ? h.color_lollipop : h.color_chocolate, stroke: "transparent", strokeThickness: 0, align: "center" })
    ).setOrigin(0.5), c = this.add.image(-110, -45, "walkie").setScale(0.3).setOrigin(0.5);
    n.add([r, c]);
    const g = this.add.text(
      this.screenWidth / 2,
      this.screenHeight / 2 + 10,
      `워키토키 ${s}개를 사용해 
긴급 수리를
요청할 수 있어요!`,
      B({ fontSize: "26px", fill: h.color_deepBlue, stroke: "transparent", strokeThickness: 0, align: "center", wordWrap: { width: 500 } })
    ).setOrigin(0.5).setDepth(51).setAlpha(0);
    p(this, [n, g], { alpha: 1, duration: 300, delay: 300 });
    const d = this.add.image(this.screenWidth / 2 - 70, this.screenHeight / 2 + 110, "reviveButton").setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0), m = this.add.image(this.screenWidth / 2 + 70, this.screenHeight / 2 + 110, "endGameButton").setOrigin(0.5).setDepth(51).setInteractive().setAlpha(0).setScale(0);
    p(this, [d, m], { scale: 0.2, alpha: 1, duration: 400, ease: "Back.out", delay: 500 }), a ? (this.soundManager.playSound("incorrectSound"), this.repairSprite = this.add.sprite(this.screenWidth / 2, this.screenHeight / 2 - 140, "playerRepair").setDepth(52).setScale(1), this.repairSprite.play("playerRepairAni"), y(d, this), d.on("pointerdown", () => {
      this.soundManager.playSound("buttonSound"), this.walkieUI.setText(o - s);
      const w = parseInt(this.repairUI.text);
      this.repairUI.setText(w + 1), T(this), l.destroy(), n.destroy(), g.destroy(), d.destroy(), m.destroy(), this.game.canvas.style.cursor = "default", this.showQuizPopup(), this.isRevivePopupShown = !1;
    })) : (this.soundManager.playSound("gameOverSound"), this.repairSprite = u(this.repairSprite), g.setText(`워키토키가 부족해
수리가 불가능해요!`), this.add.sprite(this.screenWidth / 2, this.screenHeight / 2 - 140, "playerSad").setDepth(52).setScale(1).play("playerSadAni"), d.setTint(h.hex_gray)), y(m, this), m.on("pointerdown", () => {
      T(this), this.handleQuit(), this.isRevivePopupShown = !1;
    }), this.game.canvas.style.cursor = "default";
  }
  showQuizPopup() {
    this.repairSprite = u(this.repairSprite);
    const e = this.quizData[Phaser.Math.Between(0, this.quizData.length - 1)], t = this.add.image(this.screenWidth / 2, this.screenHeight / 2, "quizContainer").setScale(0.7).setDepth(60).setAlpha(0);
    M(this, 55), p(this, t, { scale: 0.8, alpha: 1, duration: 400, ease: "Back.out", delay: 100 });
    const s = this.add.text(
      this.screenWidth / 2,
      this.screenHeight / 2 - 70,
      e.question,
      B({ fontSize: "28px", fill: h.color_lollipop, align: "center", wordWrap: { width: 500 } })
    ).setOrigin(0.5).setDepth(61).setAlpha(0);
    p(this, s, { alpha: 1, duration: 300, delay: 300 });
    const o = [], a = 160, l = this.screenWidth / 2 - (e.examples.length - 1) * a / 2;
    e.examples.forEach((n, r) => {
      const c = l + r * a, g = this.screenHeight / 2 + 60, d = this.add.image(c, g, "quizItemBox").setOrigin(0.5).setDepth(61).setInteractive().setAlpha(0).setScale(0.5);
      let m = n;
      if (n.length > 4) {
        const C = [];
        for (let k = 0; k < n.length; k += 4) C.push(n.substring(k, k + 4));
        m = C.join(`
`);
      }
      const w = this.add.text(c, g, m, {
        fontSize: "50px",
        fill: h.color_black,
        fontFamily: I,
        align: "center",
        lineSpacing: 10
      }).setOrigin(0.5).setDepth(62).setAlpha(0);
      o.push({ bg: d, text: w }), d.on("pointerover", () => {
        d.setTint(h.hex_gray), this.game.canvas.style.cursor = "pointer";
      }), d.on("pointerout", () => {
        d.clearTint(), this.game.canvas.style.cursor = "default";
      }), d.on("pointerdown", () => {
        this.soundManager.playSound("buttonSound"), this.handleQuizAnswer(n, e.answer, { quizContainer: t, questionText: s, quizItemButtons: o });
      });
    }), o.forEach((n, r) => {
      this.tweens.add({
        targets: [n.bg, n.text],
        alpha: 1,
        scaleX: n.bg ? 0.5 : 1.5,
        scaleY: n.bg ? 0.5 : 1.5,
        duration: 300,
        ease: "Back.out",
        delay: 500 + r * 100
      });
    });
  }
  handleQuizAnswer(e, t, s) {
    e === t ? this.correctAnswer() : this.incorrectAnswer(), Object.values(s).forEach((a) => {
      Array.isArray(a) ? a.forEach((l) => {
        l.bg && l.text ? (l.bg.destroy(), l.text.destroy()) : l.destroy && l.destroy();
      }) : a.destroy();
    }), this.game.canvas.style.cursor = "default";
  }
  correctAnswer() {
    this.soundManager.playSound("correctSound");
    const e = this.add.sprite(this.screenWidth / 2, this.screenHeight / 2, "playerDance").setDepth(70).setScale(1.2);
    e.play("playerDanceAni");
    const t = this.add.text(
      this.screenWidth / 2,
      this.screenHeight / 2 - 200,
      "정답입니다!",
      B({ fontSize: "40px", fill: h.color_lollipop, align: "center" })
    ).setOrigin(0.5).setDepth(70);
    this.time.delayedCall(2e3, () => {
      t.destroy(), e.destroy();
      const s = this.player.hitCount || 0;
      if (this.player.hitCount = s + 1, this.player.setTexture("player"), this.isBossShown && (this.player.y += 400), T(this), this.doubleTime && this.doubleTime.paused && this.doublePausedTime) {
        const o = this.time.now - this.doublePausedTime;
        this.doubleStartTime += o, this.doubleTime.paused = !1, this.doublePausedTime = null;
      }
      this.bulletTime && this.bulletTime.paused && (this.bulletTime.paused = !1), this.gameResume(), !this.obstacleTime && !this.isBossShown && this.createObstacleTimer();
    });
  }
  incorrectAnswer() {
    this.player.hitCount = (this.player.hitCount || 0) + 1, this.showRevivePopup(!0);
  }
  nextLevel() {
    if (!(this.isGameOver || this.isPaused)) {
      if (this.sound.stopAll(), this.level++, this.backgroundSpeed = 426 * (1 + (this.level - 1) * 0.12), this.obstacleSpeed = 426 * (1 + (this.level - 1) * 0.12), this.level > this.maxLevel) {
        this.showGameComplete();
        return;
      }
      this.updateLevelProgressBar(), this.isBossShown = !1, this.obstacleNum = 0, this.obstacleType = 0, this.isPaused = !1, this.isGameOver = !1, this.playerShake = 0, this.obstacles.clear(!0, !0), this.coins.clear(!0, !0), this.shields.clear(!0, !0), this.doubles.clear(!0, !0), this.walkies.clear(!0, !0), this.bossBullets.clear(!0, !0), this.playerBullets.clear(!0, !0), this.player.setTexture("player"), this.tweens.add({ targets: this.player, x: 360, y: 1120, duration: 1e3, ease: "Power2" }), this.player.setVelocity(0, 0), this.bulletTime && this.bulletTime.destroy(), this.player.shieldOverlay && (this.player.shieldOverlay.destroy(), this.player.shieldOverlay = null), this.doubleTime && (this.doubleTime.destroy(), this.doubleTime = null), this.bossBulletTime && (this.bossBulletTime.destroy(), this.bossBulletTime = null), this.removeDoubleTimerUI(), this.removeBossHealthUI(), this.bulletTime = this.time.addEvent({
        delay: 500,
        callback: () => {
          this.isGameOver || this.isInvincible || this.createPlayerBullet();
        },
        loop: !0
      }), this.showLevelUpPopup(), this.gamePause(), this.time.delayedCall(2e3, () => {
        this.gameResume(), this.soundManager.setBGM("bgm"), this.obstacleTime || this.createObstacleTimer();
      });
    }
  }
  showLevelUpPopup() {
    this.soundManager.playSound("explosionSound");
    const e = this.add.image(this.screenWidth / 2, this.screenHeight / 2, "nextContainer").setScale(0).setDepth(20).setAlpha(0), t = this.add.text(
      this.screenWidth / 2,
      this.screenHeight / 2 + 50,
      `Level ${this.level}`,
      B({ fontSize: "45px", fill: h.color_lollipop, align: "center" })
    ).setOrigin(0.5).setDepth(21).setAlpha(0);
    p(this, [e, t], { scale: 1, alpha: 1, duration: 500, ease: "Back.out", delay: 100 }), M(this, 19), this.time.delayedCall(2e3, () => {
      this.tweens.add({
        targets: [e, t],
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 300,
        ease: "Back.in",
        onComplete: () => {
          e.destroy(), t.destroy(), T(this);
        }
      });
    });
  }
  showGameComplete() {
    this.soundManager.setBGM("finalSound");
    const e = this.add.image(this.screenWidth / 2, this.screenHeight / 2, "finishBackground").setDepth(80).setAlpha(0), t = this.add.text(
      this.screenWidth / 2,
      this.screenHeight / 2 + 60,
      `최종 점수: ${this.score}`,
      B({ fontSize: "36px", fill: h.color_chocolate, stroke: "transparent", strokeThickness: 0, align: "center", padding: { x: 20, y: 10 } })
    ).setOrigin(0.5).setDepth(81).setAlpha(0), s = this.add.image(this.screenWidth / 2, this.screenHeight - 80, "goHomeButton").setOrigin(0.5).setDepth(81).setInteractive().setAlpha(0).setScale(0.3);
    y(s, this), p(this, [e, t, s], { alpha: 1, duration: 500, delay: 200 }), s.on("pointerdown", () => this.handleQuit());
  }
  toggleAnimations(e) {
    const t = [this.children.list, this.coins.children.entries, this.shields.children.entries, this.doubles.children.entries, this.obstacles.children.entries], s = e ? "pause" : "resume";
    t.forEach((o) => {
      o.forEach((a) => {
        a.anims && a.anims.currentAnim && a.anims.currentAnim.key !== "playerDanceAni" && a.anims[s]();
      });
    });
  }
  toggleTimers(e) {
    [this.bulletTime, this.obstacleTime, this.doubleTime, this.bossBulletTime].forEach((s) => s && (s.paused = e));
  }
  createPlayerBullet(e = this.player.x, t = this.player.y - 50) {
    const s = this.playerBullets.get(e, t);
    return s && (s.setScale(0.1), s.body.setVelocityY(-600)), s;
  }
  handleQuit() {
    this.soundManager.playSound("buttonSound"), this.obstacleTime = u(this.obstacleTime), this.bulletTime = u(this.bulletTime), this.doubleTime = u(this.doubleTime), this.bossBulletTime = u(this.bossBulletTime), this.boss = u(this.boss), this.levelBg = u(this.levelBg), this.levelBar = u(this.levelBar), this.levelText = u(this.levelText), this.playButton = u(this.playButton), this.pauseButton = u(this.pauseButton), this.repairSprite = u(this.repairSprite), this.player.shieldOverlay = u(this.player.shieldOverlay), this.obstacles = S(this.obstacles), this.coins = S(this.coins), this.shields = S(this.shields), this.doubles = S(this.doubles), this.walkies = S(this.walkies), this.playerBullets = S(this.playerBullets), this.bossBullets = S(this.bossBullets), this.removeDoubleTimerUI(), this.removeBossHealthUI(), this.hidePauseMenu(), T(this), this.tweens.killAll(), this.sound.stopAll(), this.physics.pause(), this.scene.stop("GameScene"), this.scene.start("MenuScene"), this.game.canvas.style.cursor = "default", this.initVariables();
  }
}
class q extends Phaser.Scene {
  constructor() {
    super("Boot");
  }
  /**
   * 부트 씬에 필요한 최소한의 리소스 로드
   */
  preload() {
    this.load.image("logo", D("icecandy_logo.png")), this.load.spritesheet("loading", D("loading_adventure.png"), { frameWidth: 97, frameHeight: 50 }), this.load.video("introVideo", G("intro.mp4"), "loadeddata", !1, !0);
  }
  /**
   * 부트 씬 생성
   */
  create() {
    const { width: e, height: t } = this.scale, s = this.add.rectangle(0, 0, e, t, 13234170).setOrigin(0, 0), o = this.add.image(e / 2, t / 2, "logo").setAlpha(0);
    o.setY(o.y + 100), this.tweens.add({
      targets: o,
      alpha: 1,
      y: "-=120",
      duration: 150,
      ease: "ease-in-out",
      repeat: 0,
      onComplete: () => {
        this.tweens.add({ targets: o, alpha: 1, y: "+=20", duration: 100, ease: "ease-in-out", repeat: 0 });
      }
    }), this.time.delayedCall(1200, () => {
      this.tweens.add({ targets: [o, s], alpha: 0, duration: 200, ease: "ease-in-out", repeat: 0 });
    }), this.time.delayedCall(1500, () => this.scene.start("MenuScene"));
  }
}
const $ = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  parent: "game-container",
  backgroundColor: 13234170,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: !1,
      timeScale: 1,
      // 물리 시간 스케일 고정
      fps: 60
      // 물리 FPS 고정
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [q, F, Y]
};
new Phaser.Game($);
