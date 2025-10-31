export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
  
  preload() {
    this.load.image('logo', 'assets/images/icecandy_logo.png');
  }
  
  create() {
    const { width, height } = this.scale;
    const bg = this.add.rectangle(0, 0, width, height, 0xc9effa).setOrigin(0, 0); // 화면 전체를 덮는 배경
    const logo = this.add.image(width / 2, height / 2, 'logo').setAlpha(0); // 아이스캔디 로고 생성

    logo.setY(logo.y + 100);

    this.tweens.add({ targets: logo, alpha: 1, y: '-=120', duration: 150, ease: 'ease-in-out', repeat: 0,
      onComplete: () => this.tweens.add({ targets: logo, alpha: 1, y: '+=20', duration: 100, ease: 'ease-in-out', repeat: 0 })
    });

    this.time.delayedCall(1200, () => this.tweens.add({ targets: [logo, bg], alpha: 0, duration: 200, ease: 'ease-in-out', repeat: 0 }));
    this.time.delayedCall(1500, () => this.scene.start('MenuScene'));
  }
}