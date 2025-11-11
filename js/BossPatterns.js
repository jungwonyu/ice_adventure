/**
 * Boss Patterns
 */

import { levelConfig } from './config.js';

// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------

/**
 * 보스 총알을 생성하고 기본 설정 적용
 * @param {Phaser.Physics.Arcade.Group} bossBullets - 보스 총알 그룹
 * @param {number} x - X 좌표
 * @param {number} y - Y 좌표
 * @returns {Phaser.GameObjects.Sprite|null} 생성된 총알 또는 null
 */
const createBossBullet = (bossBullets, x, y) => {
  const bullet = bossBullets.get(x, y);
  if (bullet) {
    bullet.setScale(0.1);
  }
  return bullet;
};

/**
 * 각도를 기반으로 총알의 속도 설정
 * @param {Phaser.GameObjects.Sprite} bullet - 총알 객체
 * @param {number} angle - 각도
 * @param {number} speed - 속도
 */
const setBulletVelocityFromAngle = (bullet, angle, speed) => {
  bullet.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
};

// ------------------------------------------------------------------------------------
// BOSS BULLET PATTERNS
// ------------------------------------------------------------------------------------

const BOSS_BULLET_PATTERNS = {
  /**
   * 직선 패턴: 여러 줄로 아래로 발사
   */
  straight: {
    execute: (scene, boss, bossBullets, level) => {
      const bulletCount = levelConfig[level].bossBullet;
      for (let i = 0; i < bulletCount; i++) {
        const bullet = createBossBullet(bossBullets, boss.x + (i - 1) * 30, boss.y + 50);
        if (bullet) {
          bullet.body.setVelocityY(300);
          bullet.body.setVelocityX((i - 1) * 50);
        }
      }
    }
  },

  /**
   * 부채꼴 패턴: 일정 각도로 퍼지며 발사
   */
  fan: {
    execute: (scene, boss, bossBullets, level) => {
      const angleStep = 30;
      const bulletCount = levelConfig[level].bossBullet;
      const startAngle = 90 - (angleStep * Math.floor(bulletCount / 2)); // 90도(아래)를 중심으로
      
      for (let i = 0; i < bulletCount; i++) {
        const angle = Phaser.Math.DegToRad(startAngle + i * angleStep);
        const bullet = createBossBullet(bossBullets, boss.x, boss.y + 50);
        if (bullet) {
          setBulletVelocityFromAngle(bullet, angle, 250);
        }
      }
    }
  },

  /**
   * 추적 패턴: 플레이어 방향으로 발사
   */
  tracking: {
    execute: (scene, boss, bossBullets, level) => {
      const playerDirection = Phaser.Math.Angle.Between(boss.x, boss.y, scene.player.x, scene.player.y);
      const bulletCount = levelConfig[level].bossBullet;
      
      for (let i = 0; i < bulletCount; i++) {
        const spread = (i - 1) * 0.3;
        const angle = playerDirection + spread;
        const bullet = createBossBullet(bossBullets, boss.x, boss.y + 50);
        if (bullet) {
          setBulletVelocityFromAngle(bullet, angle, 250);
        }
      }
    }
  },

  /**
   * 원형 패턴: 360도 전방향으로 발사
   */
  circle: {
    execute: (scene, boss, bossBullets, level) => {
      const bulletCount = 6;
      
      for (let i = 0; i < bulletCount; i++) {
        const angle = (i / bulletCount) * Math.PI * 2;
        const bullet = createBossBullet(bossBullets, boss.x, boss.y + 50);
        if (bullet) {
          setBulletVelocityFromAngle(bullet, angle, 200);
        }
      }
    }
  },

  /**
   * 나선 패턴: 회전하며 발사
   */
  spiral: {
    execute: (scene, boss, bossBullets, level) => {
      const spiralBullets = 4;
      const spiralOffset = 0.005; // 시간에 따라 회전
      
      for (let i = 0; i < spiralBullets; i++) {
        const angle = (i / spiralBullets) * Math.PI * 2 + spiralOffset;
        const bullet = createBossBullet(bossBullets, boss.x, boss.y + 50);
        if (bullet) {
          setBulletVelocityFromAngle(bullet, angle, 250);
        }
      }
    }
  },

  /**
   * V자 패턴: V자 모양으로 발사
   */
  vShape: {
    execute: (scene, boss, bossBullets, level) => {
      const vBullets = 4;
      
      for (let i = 0; i < vBullets; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const bulletIndex = Math.floor(i / 2);
        const angle = Phaser.Math.DegToRad(side * (15 + bulletIndex * 10));
        const bullet = createBossBullet(bossBullets, boss.x, boss.y + 50);
        if (bullet) {
          bullet.body.setVelocity(Math.sin(angle) * 300, Math.cos(angle) * 300);
        }
      }
    }
  }
};

// ------------------------------------------------------------------------------------
// EXPORT FUNCTIONS
// ------------------------------------------------------------------------------------

/**
 * 랜덤 보스 탄막 패턴 실행
 * @param {Phaser.Scene} scene - 게임 씬
 */
export function executeRandomBossPattern(scene) {
  const availablePatterns = ['straight', 'fan', 'tracking', 'circle', 'spiral', 'vShape'];
  const randomPattern = availablePatterns[Phaser.Math.Between(0, availablePatterns.length - 1)];
  const pattern = BOSS_BULLET_PATTERNS[randomPattern];
  
  if (pattern) {
    pattern.execute(scene, scene.boss, scene.bossBullets, scene.level);
  }
}