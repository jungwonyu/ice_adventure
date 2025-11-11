export const OBSTACLE_CONFIGS = { // 장애물 설정 통합 관리
  snake: {
    key: 'obstacle1',
    scale: 0.3,
    margin: 150,
    hitCount: 2,
    animation: 'obstacle1Ani',
    rewards: ['double', 'shield'],
    behavior: {
      type: 'wave',
      amplitude: 8.0,
      frequency: 2000,
      offset: 100
    },
    onFirstHit: (obstacle) => {
      obstacle.isHit = true;
    },
    onSecondHit: (obstacle, scene) => {
      const rewardType = Phaser.Math.Between(0, 1) === 0 ? 'double' : 'shield';
      const reward = scene[rewardType + 's'].create(obstacle.x, obstacle.y, rewardType);
      reward.setScale(0.3);
      reward.setSize(reward.width * 0.8, reward.height * 0.8);
      reward.play(rewardType + 'Ani');
      reward.body.setVelocityY(scene.obstacleSpeed);
      obstacle.destroy();
    }
  },
  
  cactus: {
    key: 'obstacle2',
    scale: 0.3,
    margin: 150,
    hitCount: 2,
    animation: null,
    rewards: ['coin'],
    behavior: {
      type: 'static'
    },
    onFirstHit: (obstacle) => {
      obstacle.setTexture('obstacle2Ice');
    },
    onSecondHit: (obstacle, scene) => {
      const coin = scene.coins.create(obstacle.x, obstacle.y, 'coin');
      coin.setScale(0.3);
      coin.setSize(coin.width * 0.8, coin.height * 0.8);
      coin.play('coinAni');
      coin.body.setVelocityY(scene.obstacleSpeed);
      obstacle.destroy();
    }
  },
  
  rock: {
    key: 'obstacle3',
    scale: 0.4,
    margin: 200,
    hitCount: 2,
    animation: null,
    rewards: ['coin', 'coin'],
    behavior: {
      type: 'static'
    },
    onFirstHit: (obstacle) => {
      obstacle.setScale(obstacle.scaleX * 0.8);
      obstacle.setSize(obstacle.width * 0.8, obstacle.height * 0.8);
    },
    onSecondHit: (obstacle, scene) => {
      for (let i = -1; i <= 1; i += 2) {
        const coin = scene.coins.create(obstacle.x + i * 20, obstacle.y, 'coin');
        coin.setScale(0.3);
        coin.setSize(coin.width * 0.8, coin.height * 0.8);
        coin.play('coinAni');
        coin.body.setVelocityY(scene.obstacleSpeed);
      }
      obstacle.destroy();
    }
  }
};

export const OBSTACLE_TYPE_MAP = { // 장애물 타입별 매핑
  0: 'snake',
  1: 'cactus', 
  2: 'rock'
};

export function getObstacleConfig(obstacleKey) { // 장애물 키로 설정 가져오기
  const configKey = Object.keys(OBSTACLE_CONFIGS).find(key => OBSTACLE_CONFIGS[key].key === obstacleKey);
  return OBSTACLE_CONFIGS[configKey];
}

export function getObstacleConfigByType(typeIndex) { // 장애물 타입 인덱스로 설정 가져오기
  const typeName = OBSTACLE_TYPE_MAP[typeIndex];
  return OBSTACLE_CONFIGS[typeName];
}