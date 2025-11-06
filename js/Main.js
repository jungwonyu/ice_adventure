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

export const colorConfig = {
  color_chocolate: '#6F412B',
  color_lollipop: '#FF6F91',
  color_ice: '#75D4E8',
  color_deepBlue: '#1A374D',
  color_candy: '#F9DD52',
  color_mint: '#A8E6CF',
  color_greenTea: '#748F1B',
  color_snow: '#FFFFFF',
  color_black: '#000000',
  color_loadingBg: '#c9effa',
  color_loadingBar: '#94ccdc',

  hex_chocolate: 0x6F412B,
  hex_lollipop: 0xFF6F91,
  hex_ice: 0x75D4E8,
  hex_deepBlue: 0x1A374D,
  hex_candy: 0xF9DD52,
  hex_mint: 0xA8E6CF,
  hex_greenTea: 0x748F1B,
  hex_snow: 0xFFFFFF,
  hex_black: 0x000000,
  hex_loadingBg: 0xc9effa,
  hex_loadingBar: 0x94ccdc,
  hex_gray: 0x888888,
};

export const levelConfig = {
  1: { bossDistance: 3000, bossBullet: 3, bossHit: 30, obstacleNum: 1, walkieReward: 1 },
  2: { bossDistance: 6000, bossBullet: 3, bossHit: 35, obstacleNum: 1, walkieReward: 3 },
  3: { bossDistance: 9000, bossBullet: 3, bossHit: 40, obstacleNum: 1, walkieReward: 5 },
  4: { bossDistance: 12000, bossBullet: 5, bossHit: 45, obstacleNum: 2, walkieReward: 7 },
  5: { bossDistance: 15000, bossBullet: 5, bossHit: 50, obstacleNum: 2, walkieReward: 9 },
  6: { bossDistance: 18000, bossBullet: 5, bossHit: 55, obstacleNum: 2, walkieReward: 11 },
  7: { bossDistance: 21000, bossBullet: 7, bossHit: 60, obstacleNum: 3, walkieReward: 13 },
  8: { bossDistance: 24000, bossBullet: 7, bossHit: 65, obstacleNum: 3, walkieReward: 15 },
  9: { bossDistance: 27000, bossBullet: 7, bossHit: 70, obstacleNum: 3, walkieReward: 17 },
  10: { bossDistance: 30000, bossBullet: 7, bossHit: 75, obstacleNum: 3, walkieReward: 19 }
};

export const FONT_FAMILY = 'Cafe24Surround';

const game = new Phaser.Game(Object.assign(config, colorConfig, levelConfig));
game.scene.start('Boot');