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
    this.isMuted = false;
    this.muteButton = null;
    this.soundButton = null;
    this.bgm = null;
  }

  createSoundButtons() {
    const { width, height } = this.scene.scale;

    // 음소거 버튼
    this.muteButton = this.scene.add.image(width - 70, height - 60, 'muteButton').setVisible(!this.isMuted).setScale(0.2).setDepth(1000).setInteractive();
    addHoverEffect(this.muteButton, this.scene);
    this.muteButton.on('pointerdown', () => this.toggleMute());

    // 사운드 버튼
    this.soundButton = this.scene.add.image(width - 70, height - 60, 'soundButton').setVisible(this.isMuted).setScale(0.2).setDepth(1000).setInteractive();
    addHoverEffect(this.soundButton, this.scene);
    this.soundButton.on('pointerdown', () => this.toggleMute());

    return { muteButton: this.muteButton, soundButton: this.soundButton };
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.muteButton.setVisible(!this.isMuted);
    this.soundButton.setVisible(this.isMuted);

    if (this.isMuted) { // 음소거
      this.scene.sound.setMute(true);
      if (this.bgm && this.bgm.isPlaying) {
        this.bgm.pause();
      }
    } else { // 음소거 해제
      this.scene.sound.setMute(false);
      if (this.bgm && this.bgm.isPaused) {
        this.bgm.resume();
      } else if (this.bgm && !this.bgm.isPlaying) {
        this.bgm.play();
      }
    }

    if (!this.isMuted && this.scene.buttonSound) {
      this.scene.buttonSound.play();
    }
  }

  setBGM(bgmKey) {
    if (this.bgm) {
      if (this.bgm.key === bgmKey) {
        if (!this.bgm.isPlaying && !this.isMuted) {
          this.bgm.play();
        }
        return;
      } else {
        this.bgm.stop();
      }
    }
    this.bgm = this.scene.sound.add(bgmKey, { loop: true, volume: 0.5 });
    if (!this.isMuted) {
      this.bgm.play();
    }
  }

  playBGM() {
    if (this.bgm && !this.isMuted) this.bgm.play();
  }

  stopBGM() {
    if (this.bgm) this.bgm.stop();
  }

  pauseBGM() {
    if (this.bgm && this.bgm.isPlaying) this.bgm.pause();
  }

  playSound(soundKey, options = {}) {
    if (this.isMuted) return null;
    const defaultOptions = { volume:1.0, loop: false, ...options };
    const sound = this.scene.sound.add(soundKey, defaultOptions);

    sound.stop();
    sound.play();
    return sound;
  }
}