/**
 * Boot Scene
 * 게임 최초 로딩 시 실행되는 부트 씬
 * 로고 애니메이션을 보여주고 메인 메뉴로 전환
 */

import { getImagePath, getVideoPath } from './config.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  /**
   * 부트 씬에 필요한 최소한의 리소스 로드
   */
  preload() {
    this.load.image('logo', getImagePath('icecandy_logo.png'));
    this.load.spritesheet('loading', getImagePath('loading_adventure.png'), { frameWidth: 97, frameHeight: 50 });
    this.load.video('introVideo', getVideoPath('intro.mp4'), 'loadeddata', false, true);
  }
  
  /**
   * 부트 씬 생성
   */
  create() {
    const { width, height } = this.scale;
    
    // 하늘색 배경 생성
    const bg = this.add.rectangle(0, 0, width, height, 0xc9effa).setOrigin(0, 0);
    
    // 아이스캔디 로고 생성 (초기 투명 상태)
    const logo = this.add.image(width / 2, height / 2, 'logo').setAlpha(0);
    
    // 로고 시작 위치를 아래로 이동
    logo.setY(logo.y + 100);

    // 로고 등장 애니메이션: 위로 튀어오르기 
    this.tweens.add({ targets: logo, alpha: 1, y: '-=120', duration: 150, ease: 'ease-in-out', repeat: 0,
      onComplete: () => {
        this.tweens.add({ targets: logo, alpha: 1, y: '+=20', duration: 100, ease: 'ease-in-out', repeat: 0 });
      }
    });

    // 1.2초 후 페이드아웃 시작
    this.time.delayedCall(1200, () => {
      this.tweens.add({ targets: [logo, bg], alpha: 0, duration: 200, ease: 'ease-in-out', repeat: 0 });
    });
    
    // 1.5초 후 메뉴 씬으로 전환
    this.time.delayedCall(1500, () => this.scene.start('MenuScene'));
  }
}