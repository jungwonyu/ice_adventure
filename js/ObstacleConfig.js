/**
 * Obstacle Configuration
 * 장애물의 속성, 동작, 보상을 중앙에서 관리
 */

// ------------------------------------------------------------------------------------
// OBSTACLE CONFIGURATIONS
// ------------------------------------------------------------------------------------

/**
 * 장애물별 상세 설정
 * 
 * 속성 설명:
 */
export const OBSTACLE_CONFIGS = {
  /**
   * 뱀 장애물
   * 좌우로 물결치며 움직이고, 파괴 시 더블샷 또는 쉴드 드롭
   */
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
      obstacle.isHit = true; // 타격 상태 표시
    },
    onSecondHit: (obstacle, scene) => {
      // 랜덤으로 더블샷 또는 쉴드 생성
      const rewardType = Phaser.Math.Between(0, 1) === 0 ? 'double' : 'shield';
      const reward = scene[rewardType + 's'].create(obstacle.x, obstacle.y, rewardType);
      reward.setScale(0.3);
      reward.setSize(reward.width * 0.8, reward.height * 0.8);
      reward.play(rewardType + 'Ani');
      reward.body.setVelocityY(scene.obstacleSpeed);
      obstacle.destroy();
    }
  },
  
  /**
   * 선인장 장애물
   * 고정 위치, 첫 타격 시 얼음 텍스처로 변경, 파괴 시 코인 드롭
   */
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
      obstacle.setTexture('obstacle2Ice'); // 얼음에 갇힌 텍스처로 변경
    },
    onSecondHit: (obstacle, scene) => {
      // 코인 1개 생성
      const coin = scene.coins.create(obstacle.x, obstacle.y, 'coin');
      coin.setScale(0.3);
      coin.setSize(coin.width * 0.8, coin.height * 0.8);
      coin.play('coinAni');
      coin.body.setVelocityY(scene.obstacleSpeed);
      obstacle.destroy();
    }
  },
  
  /**
   * 바위 장애물
   * 고정 위치, 첫 타격 시 크기 감소, 파괴 시 코인 2개 드롭
   */
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
      // 크기 20% 감소
      obstacle.setScale(obstacle.scaleX * 0.8);
      obstacle.setSize(obstacle.width * 0.8, obstacle.height * 0.8);
    },
    onSecondHit: (obstacle, scene) => {
      // 좌우로 코인 2개 생성
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

// ------------------------------------------------------------------------------------
// OBSTACLE TYPE MAPPING
// ------------------------------------------------------------------------------------

/**
 * 장애물 타입 인덱스와 이름 매핑
 * GameScene에서 순환 생성 시 사용
 */
export const OBSTACLE_TYPE_MAP = {
  0: 'snake',
  1: 'cactus', 
  2: 'rock'
};

// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------

/**
 * 장애물 스프라이트 키로 설정 가져오기
 * @param {string} obstacleKey - 장애물 스프라이트 키 (예: 'obstacle1')
 * @returns {Object} 장애물 설정 객체
 */
export function getObstacleConfig(obstacleKey) {
  const configKey = Object.keys(OBSTACLE_CONFIGS).find(key => OBSTACLE_CONFIGS[key].key === obstacleKey);
  return OBSTACLE_CONFIGS[configKey];
}

/**
 * 타입 인덱스로 장애물 설정 가져오기
 * @param {number} typeIndex - 장애물 타입 인덱스 (0: 뱀, 1: 선인장, 2: 바위)
 * @returns {Object} 장애물 설정 객체
 */
export function getObstacleConfigByType(typeIndex) {
  const typeName = OBSTACLE_TYPE_MAP[typeIndex];
  return OBSTACLE_CONFIGS[typeName];
}