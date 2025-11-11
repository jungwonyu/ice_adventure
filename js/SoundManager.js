import { addHoverEffect } from './utils.js';

/**
 * 사운드 관련 상수 정의
 * @constant {Object} SOUND_CONFIG
 */
const SOUND_CONFIG = {
  BUTTON_POSITION: { x: 70, y: 60 },
  BUTTON_SCALE: 0.2,
  BUTTON_DEPTH: 1000,
  DEFAULT_BGM_VOLUME: 0.5,
  DEFAULT_SOUND_VOLUME: 1.0,
  VOLUMES: {
    coinSound: 0.3,
    buttonSound: 0.8,
    explosionSound: 0.6
  }
};

/**
 * SoundManager - 게임 전체의 사운드를 관리하는 싱글톤 클래스
 * BGM 음소거 상태를 관리하고, 효과음을 재생합니다.
 * 
 * @class
 * @example
 * const soundManager = SoundManager.getInstance(this);
 * soundManager.setBGM('bgm');
 * soundManager.playSound('coinSound');
 */
export default class SoundManager {
  static instance = null;
  
  /**
   * SoundManager 싱글톤 인스턴스를 반환
   * @param {Phaser.Scene} scene - 현재 씬
   * @returns {SoundManager|null} SoundManager 인스턴스 또는 null
   */
  static getInstance(scene) {
    if (!scene) {
      console.warn('SoundManager: Scene is required');
      return null;
    }
    
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager(scene);
    } else {
      SoundManager.instance.updateScene(scene);
    }
    return SoundManager.instance;
  }

  /**
   * SoundManager 생성자
   * @param {Phaser.Scene} scene - Phaser 씬 객체
   */
  constructor(scene) {
    this.scene = scene;
    this.isBGMMuted = false;  // BGM 음소거 상태
    this.buttons = {
      bgm: { mute: null, sound: null }  // 사운드 토글 버튼들
    };
    this.currentBGM = null;  // 현재 재생 중인 BGM 객체
    this.soundCategories = this.initializeSoundCategories();
  }

  /**
   * 사운드를 BGM과 SFX로 분류
   * @returns {Object} bgm과 sfx 카테고리별 사운드 키 배열
   */
  initializeSoundCategories() {
    return {
      bgm: ['bgm', 'bossBgm', 'coinBgm', 'nextBgm'],
      sfx: ['buttonSound', 'coinSound', 'helperSound', 'bulletHitSound', 
            'explosionSound', 'bossShootSound', 'correctSound', 'incorrectSound', 
            'countdownSound', 'nextLevelSound', 'finalSound', 'gameOverSound', 'hitPlayerSound']
    };
  }

  /**
   * 씬이 변경될 때 씬 참조를 업데이트
   * @param {Phaser.Scene} scene - 새로운 씬 객체
   */
  updateScene(scene) {
    if (scene !== this.scene) {
      this.scene = scene;
    }
  }

  /**
   * 화면에 사운드 토글 버튼들을 생성 (우측 하단에 배치)
   * @returns {Object} 생성된 버튼 객체들
   */
  createSoundButtons() {
    const { width, height } = this.scene.scale;
    const x = width - SOUND_CONFIG.BUTTON_POSITION.x;
    const y = height - SOUND_CONFIG.BUTTON_POSITION.y;

    this.createButtonPair('bgm', x, y);
    
    return this.buttons;
  }

  /**
   * 음소거 토글용 버튼 쌍 생성 (사운드 ON 버튼 + 뮤트 버튼)
   * @param {string} type - 버튼 타입 ('bgm')
   * @param {number} x - 버튼 X 좌표
   * @param {number} y - 버튼 Y 좌표
   */
  createButtonPair(type, x, y) {
    const isActive = !this.isBGMMuted;
    
    this.buttons[type].sound = this.createButton('soundButton', x, y, isActive, () => this.toggleMute());
    this.buttons[type].mute = this.createButton('muteButton', x, y, !isActive, () => this.toggleMute());
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
  createButton(texture, x, y, visible, callback) {
    const button = this.scene.add.image(x, y, texture)
      .setVisible(visible)
      .setScale(SOUND_CONFIG.BUTTON_SCALE)
      .setDepth(SOUND_CONFIG.BUTTON_DEPTH)
      .setInteractive();
      
    addHoverEffect(button, this.scene);
    button.on('pointerdown', callback);
    
    return button;
  }

  /**
   * BGM 음소거 상태를 토글
   */
  toggleMute() {
    this.isBGMMuted = !this.isBGMMuted;
    this.updateButtonVisibility();
    this.handleBGMToggle();
    this.playSound('buttonSound'); // 버튼 효과음은 항상 재생
  }

  /**
   * 음소거 상태에 따라 버튼 표시/숨김 전환
   */
  updateButtonVisibility() {
    const isActive = !this.isBGMMuted;
    this.buttons.bgm.sound.setVisible(isActive);
    this.buttons.bgm.mute.setVisible(!isActive);
  }

  /**
   * BGM 음소거 토글 시 재생 상태 처리
   */
  handleBGMToggle() {
    if (!this.currentBGM) return;
    
    if (this.isBGMMuted) {
      if (this.currentBGM.isPlaying) {
        this.currentBGM.pause();
      }
    } else {
      if (this.currentBGM.isPaused) {
        this.currentBGM.resume();
      } else if (!this.currentBGM.isPlaying) {
        this.currentBGM.play();
      }
    }
  }

  /**
   * 배경음악(BGM) 설정 및 재생
   * @param {string} bgmKey - 재생할 BGM의 사운드 키
   */
  setBGM(bgmKey) {
    if (this.currentBGM?.key === bgmKey) {
      // 동일한 BGM이 이미 재생 중이면 그대로 유지
      if (!this.currentBGM.isPlaying && !this.isBGMMuted) {
        this.currentBGM.play();
      }
      return;
    }
    
    this.stopCurrentBGM();
    this.createNewBGM(bgmKey);
  }

  /**
   * 현재 재생 중인 BGM 중지 및 제거
   */
  stopCurrentBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM.destroy();
    }
  }

  /**
   * 새로운 BGM 객체 생성 및 재생
   * @param {string} bgmKey - BGM 사운드 키
   */
  createNewBGM(bgmKey) {
    this.currentBGM = this.scene.sound.add(bgmKey, { 
      loop: true, 
      volume: SOUND_CONFIG.DEFAULT_BGM_VOLUME 
    });
    
    if (!this.isBGMMuted) {
      this.currentBGM.play();
    }
  }

  /**
   * BGM 정지
   */
  stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
    }
  }

  /**
   * BGM 일시정지
   */
  pauseBGM() {
    if (this.currentBGM && this.currentBGM.isPlaying) {
      this.currentBGM.pause();
    }
  }

  /**
   * 효과음(SFX) 재생
   * @param {string} soundKey - 재생할 사운드 키
   * @param {Object} options - Phaser 사운드 옵션 (volume, loop 등)
   * @returns {Phaser.Sound.BaseSound|null} 생성된 사운드 객체 또는 null
   */
  playSound(soundKey, options = {}) {
    const volume = SOUND_CONFIG.VOLUMES[soundKey] || SOUND_CONFIG.DEFAULT_SOUND_VOLUME;
    const soundOptions = { volume, loop: false, ...options };
    
    return this.createAndPlaySound(soundKey, soundOptions);
  }

  /**
   * 사운드 객체 생성 및 재생
   * @param {string} soundKey - 사운드 키
   * @param {Object} options - 사운드 재생 옵션
   * @returns {Phaser.Sound.BaseSound} 생성된 사운드 객체
   */
  createAndPlaySound(soundKey, options) {
    const sound = this.scene.sound.add(soundKey, options);
    sound.stop(); // 기존 사운드 정지
    sound.play();
    return sound;
  }

  /**
   * SoundManager 완전 제거 (싱글톤 인스턴스 포함)
   */
  destroy() {
    this.stopCurrentBGM();
    
    // 버튼들 정리
    Object.values(this.buttons).forEach(buttonPair => {
      Object.values(buttonPair).forEach(button => {
        if (button) {
          button.destroy();
        }
      });
    });
    
    // 상태 초기화
    this.buttons = {
      bgm: { mute: null, sound: null }
    };
    
    SoundManager.instance = null;
  }
}