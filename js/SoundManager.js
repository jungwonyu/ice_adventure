import { addHoverEffect } from './utils.js';

// 사운드 관련 상수 정의
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

export default class SoundManager {
  static instance = null;
  
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

  constructor(scene) {
    this.scene = scene;
    this.muteStates = {
      bgm: false,
      sfx: false
    };
    this.buttons = {
      bgm: { mute: null, sound: null }
    };
    this.currentBGM = null;
    this.soundCategories = this.initializeSoundCategories();
  }

  initializeSoundCategories() {
    return {
      bgm: ['bgm', 'bossBgm', 'coinBgm', 'nextBgm'],
      sfx: ['buttonSound', 'coinSound', 'helperSound', 'bulletHitSound', 
            'explosionSound', 'bossShootSound', 'correctSound', 'incorrectSound', 
            'countdownSound', 'nextLevelSound', 'finalSound', 'gameOverSound', 'hitPlayerSound']
    };
  }

  updateScene(scene) {
    if (scene !== this.scene) {
      this.scene = scene;
    }
  }

  createSoundButtons() {
    const { width, height } = this.scene.scale;
    const x = width - SOUND_CONFIG.BUTTON_POSITION.x;
    const y = height - SOUND_CONFIG.BUTTON_POSITION.y;

    this.createButtonPair('bgm', x, y);
    
    return this.buttons;
  }

  createButtonPair(type, x, y) {
    const isActive = !this.muteStates[type];
    
    this.buttons[type].sound = this.createButton('soundButton', x, y, isActive, () => this.toggleMute(type)); // 활성 상태 버튼 (소리 켜짐)
    this.buttons[type].mute = this.createButton('muteButton', x, y, !isActive, () => this.toggleMute(type)); // 뮤트 상태 버튼 (소리 꺼짐)  
  }

  createButton(texture, x, y, visible, callback) {
    const button = this.scene.add.image(x, y, texture).setVisible(visible).setScale(SOUND_CONFIG.BUTTON_SCALE).setDepth(SOUND_CONFIG.BUTTON_DEPTH).setInteractive();
      
    addHoverEffect(button, this.scene);
    button.on('pointerdown', callback);
    
    return button;
  }

  toggleMute(type) {
    this.muteStates[type] = !this.muteStates[type];
    this.updateButtonVisibility(type);
    
    if (type === 'bgm') {
      this.handleBGMToggle();
    }
    
    this.playSound('buttonSound'); // 버튼 효과음은 항상 재생
  }

  updateButtonVisibility(type) {
    const isActive = !this.muteStates[type];
    this.buttons[type].sound.setVisible(isActive);
    this.buttons[type].mute.setVisible(!isActive);
  }

  handleBGMToggle() {
    if (!this.currentBGM) return;
    
    if (this.muteStates.bgm) {
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

  setBGM(bgmKey) {
    if (this.currentBGM?.key === bgmKey) { // 동일한 BGM이 이미 재생 중이면 그대로 유지
      if (!this.currentBGM.isPlaying && !this.muteStates.bgm) {
        this.currentBGM.play();
      }
      return;
    }
    
    this.stopCurrentBGM();
    this.createNewBGM(bgmKey);
  }

  stopCurrentBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM.destroy();
    }
  }

  createNewBGM(bgmKey) {
    this.currentBGM = this.scene.sound.add(bgmKey, { loop: true, volume: SOUND_CONFIG.DEFAULT_BGM_VOLUME });
    
    if (!this.muteStates.bgm) {
      this.currentBGM.play();
    }
  }

  playBGM() {
    if (this.currentBGM && !this.muteStates.bgm) {
      this.currentBGM.play();
    }
  }

  stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
    }
  }

  pauseBGM() {
    if (this.currentBGM && this.currentBGM.isPlaying) {
      this.currentBGM.pause();
    }
  }

  playSound(soundKey, options = {}) {
    const soundType = this.getSoundType(soundKey);
    
    if (this.muteStates[soundType]) {
      return null;
    }
    
    const volume = SOUND_CONFIG.VOLUMES[soundKey] || SOUND_CONFIG.DEFAULT_SOUND_VOLUME;
    const soundOptions = {  volume,  loop: false,  ...options };
    
    return this.createAndPlaySound(soundKey, soundOptions);
  }

  getSoundType(soundKey) {
    if (this.soundCategories.bgm.includes(soundKey)) {
      return 'bgm';
    }
    return 'sfx';
  }

  createAndPlaySound(soundKey, options) {
    const sound = this.scene.sound.add(soundKey, options);
    sound.stop(); // 기존 사운드 정지
    sound.play();
    return sound;
  }

  cleanup() {
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
  }

  destroy() {
    this.cleanup();
    SoundManager.instance = null;
  }
}