import MenuScene from './MenuScene.js';
import GameScene from './GameScene.js';
import Boot from './Boot.js';

const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  parent: 'game-container',
  backgroundColor: 0xc9effa,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      timeScale: 1, // 물리 시간 스케일 고정
      fps: 60 // 물리 FPS 고정
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, MenuScene, GameScene],
};

const game = new Phaser.Game(config);