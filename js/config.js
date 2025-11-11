/**
 * 게임 설정 파일
 */

// ------------------------------------------------------------------------------------
// ASSET PATHS
// ------------------------------------------------------------------------------------

/**
 * 리소스 기본 경로 설정
 */
const ASSET_PATHS = {
  images: 'assets/images/',
  sounds: 'assets/sounds/',
  videos: 'assets/videos/',
  data: 'data/'
};

/**
 * 이미지 파일 경로 생성
 * @param {string} filename - 이미지 파일명
 * @returns {string} 전체 이미지 경로
 */
export const getImagePath = (filename) => `${ASSET_PATHS.images}${filename}`;

/**
 * 사운드 파일 경로 생성
 * @param {string} filename - 사운드 파일명
 * @returns {string} 전체 사운드 경로
 */
export const getSoundPath = (filename) => `${ASSET_PATHS.sounds}${filename}`;

/**
 * 비디오 파일 경로 생성
 * @param {string} filename - 비디오 파일명
 * @returns {string} 전체 비디오 경로
 */
export const getVideoPath = (filename) => `${ASSET_PATHS.videos}${filename}`;

/**
 * 데이터 파일 경로 생성
 * @param {string} filename - 데이터 파일명
 * @returns {string} 전체 데이터 경로
 */
export const getDataPath = (filename) => `${ASSET_PATHS.data}${filename}`;

// ------------------------------------------------------------------------------------
// COLOR CONFIGURATION
// ------------------------------------------------------------------------------------

/**
 * 색상 설정
 * color_ : CSS 스타일용 문자열
 * hex_ : Phaser 객체용 16진수 값
 */
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

// ------------------------------------------------------------------------------------
// LEVEL CONFIGURATION
// ------------------------------------------------------------------------------------

/**
 * 레벨별 게임 설정
 * bossDistance: 보스 출현 거리(미터)
 * bossBullet: 보스 탄막 개수
 * bossHit: 보스 격파에 필요한 타격 횟수
 * obstacleNum: 장애물 동시 출현 개수
 * walkieReward: 보스 격파 시 워키토키 보상 개수
 */
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

// ------------------------------------------------------------------------------------
// FONT CONFIGURATION
// ------------------------------------------------------------------------------------

/**
 * 게임 전체에서 사용되는 기본 폰트
 */
export const FONT_FAMILY = 'Cafe24Surround';
