import { levelConfig } from './Main.js';

const BOSS_BULLET_PATTERNS = {
  straight: {
    execute: (scene, boss, bossBullets, level) => {
      for (let i = 0; i < levelConfig[level].bossBullet; i++) {
        const bullet = bossBullets.get(boss.x + (i - 1) * 30, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocityY(300);
          bullet.body.setVelocityX((i - 1) * 50);
        }
      }
    }
  },

  fan: {
    execute: (scene, boss, bossBullets, level) => {
      const angleStep = 30;
      const bulletCount = levelConfig[level].bossBullet;
      const startAngle = -angleStep * Math.floor(bulletCount / 2);
      for (let i = 0; i < bulletCount; i++) {
        const angle = Phaser.Math.DegToRad(startAngle + i * angleStep);
        const bullet = bossBullets.get(boss.x, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocity(Math.sin(angle) * 250, Math.cos(angle) * 250);
        }
      }
    }
  },

  tracking: {
    execute: (scene, boss, bossBullets, level) => {
      const playerDirection = Phaser.Math.Angle.Between(boss.x, boss.y, scene.player.x, scene.player.y);
      for (let i = 0; i < levelConfig[level].bossBullet; i++) {
        const spread = (i - 1) * 0.3;
        const angle = playerDirection + spread;
        const bullet = bossBullets.get(boss.x, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
        }
      }
    }
  },

  circle: {
    execute: (scene, boss, bossBullets, level) => {
      const bulletCount = 6;
      for (let i = 0; i < bulletCount; i++) {
        const angle = (i / bulletCount) * Math.PI * 2;
        const bullet = bossBullets.get(boss.x, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
        }
      }
    }
  },

  spiral: {
    execute: (scene, boss, bossBullets, level) => {
      const spiralBullets = 4;
      const spiralOffset = Date.now() * 0.005;
      for (let i = 0; i < spiralBullets; i++) {
        const angle = (i / spiralBullets) * Math.PI * 2 + spiralOffset;
        const bullet = bossBullets.get(boss.x, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
        }
      }
    }
  },

  vShape: {
    execute: (scene, boss, bossBullets, level) => {
      const vBullets = 4;
      for (let i = 0; i < vBullets; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const bulletIndex = Math.floor(i / 2);
        const angle = Phaser.Math.DegToRad(side * (15 + bulletIndex * 10));
        const bullet = bossBullets.get(boss.x, boss.y + 50);
        if (bullet) {
          bullet.setScale(0.1);
          bullet.body.setVelocity(Math.sin(angle) * 300, Math.cos(angle) * 300);
        }
      }
    }
  }
};

// 패턴 실행 헬퍼 함수
export function executeBossPattern(scene, patternName) {
  const pattern = BOSS_BULLET_PATTERNS[patternName];
  pattern.execute(scene, scene.boss, scene.bossBullets, scene.level);
}

export function getRandomPatternForLevel(level) {
  const availablePatterns = ['straight', 'fan', 'tracking', 'circle', 'spiral', 'vShape'];
  return availablePatterns[Phaser.Math.Between(0, availablePatterns.length - 1)];
}