import { addHoverEffect } from './utils.js';

export default class SoundManager {
  static instance = null;
  static getInstance(scene) {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager(scene);
    } else {
      SoundManager.instance.scene = scene;
    }
    return SoundManager.instance;
  }
  constructor(scene) {
    this.scene = scene;
    this.isBGMMuted = false; // BGM 뮤트 상태만 관리
    this.muteButton = null;
    this.soundButton = null;
    this.bgm = null;
  }

  createSoundButtons() {
    const { width, height } = this.scene.scale;

    // 음소거 버튼 (BGM 활성화 상태)
    this.muteButton = this.scene.add.image(width - 70, height - 60, 'soundButton').setVisible(!this.isBGMMuted).setScale(0.2).setDepth(1000).setInteractive();
    addHoverEffect(this.muteButton, this.scene);
    this.muteButton.on('pointerdown', () => this.toggleBGMMute());

    // 사운드 버튼 (BGM 뮤트 상태)
    this.soundButton = this.scene.add.image(width - 70, height - 60, 'muteButton').setVisible(this.isBGMMuted).setScale(0.2).setDepth(1000).setInteractive();
    addHoverEffect(this.soundButton, this.scene);
    this.soundButton.on('pointerdown', () => this.toggleBGMMute());

    return { muteButton: this.muteButton, soundButton: this.soundButton };
  }

  toggleBGMMute() {
    this.isBGMMuted = !this.isBGMMuted;
    this.muteButton.setVisible(!this.isBGMMuted);
    this.soundButton.setVisible(this.isBGMMuted);

    if (this.isBGMMuted) { // BGM 뮤트
      if (this.bgm && this.bgm.isPlaying) {
        this.bgm.pause();
      }
    } else { // BGM 뮤트 해제
      if (this.bgm && this.bgm.isPaused) {
        this.bgm.resume();
      } else if (this.bgm && !this.bgm.isPlaying) {
        this.bgm.play();
      }
    }

    // 버튼 클릭 효과음은 항상 재생 (BGM 뮤트와 무관)
    this.playSound('buttonSound');
  }

  setBGM(bgmKey) {
    if (this.bgm) {
      if (this.bgm.key === bgmKey) {
        if (!this.bgm.isPlaying && !this.isBGMMuted) {
          this.bgm.play();
        }
        return;
      } else {
        this.bgm.stop();
      }
    }
    this.bgm = this.scene.sound.add(bgmKey, { loop: true, volume: 0.5 });
    if (!this.isBGMMuted) {
      this.bgm.play();
    }
  }

  playBGM() {
    if (this.bgm && !this.isBGMMuted) this.bgm.play();
  }

  stopBGM() {
    if (this.bgm) this.bgm.stop();
  }

  pauseBGM() {
    if (this.bgm && this.bgm.isPlaying) this.bgm.pause();
  }

  playSound(soundKey, options = {}) {
    // BGM 파일인지 확인 (파일명에 'bgm'이 포함되어 있는지 체크)
    const isBGMSound = soundKey.toLowerCase().includes('bgm');
    
    // BGM 소리인 경우 BGM 뮤트 상태 확인, 일반 효과음은 항상 재생
    if (isBGMSound && this.isBGMMuted) {
      return null;
    }
    
    // 사운드별 볼륨 설정
    let volume = 1.0;
    if (soundKey === 'coinSound') {
      volume = 0.2; // 코인 사운드 볼륨 낮추기
    }
    
    const defaultOptions = { volume: volume, loop: false, ...options };
    const sound = this.scene.sound.add(soundKey, defaultOptions);

    sound.stop();
    sound.play();
    return sound;
  }
}