import { colorConfig, FONT_FAMILY } from './config.js';

export function addHoverEffect(button, scene) {
  button.on('pointerover', () => {
    if (button.texture.key === 'startButton' || button.texture.key === 'howToPlayButton') {
      button.setTexture(button.texture.key + 'Hover');
    }
    button.setScale(button.scaleX * 1.1);
    scene.game.canvas.style.cursor = 'pointer';
  });

  button.on('pointerout', () => {
    if (button.texture.key === 'startButtonHover' || button.texture.key === 'howToPlayButtonHover') {
      button.setTexture(button.texture.key.replace('Hover', ''));
    }
    button.setScale(button.scaleX / 1.1);
    scene.game.canvas.style.cursor = 'default';
  });
}

export function createOverlay(scene, depth = 45, alpha = 0.7) {
  if (scene.overlay) scene.overlay.destroy();
  scene.overlay = scene.add.rectangle(scene.screenWidth / 2, scene.screenHeight / 2, scene.screenWidth, scene.screenHeight, colorConfig.hex_black, alpha).setDepth(depth).setInteractive();
  return scene.overlay;
}

export function removeOverlay(scene) {
  if (scene.overlay) {
    scene.overlay.destroy();
    scene.overlay = null;
  }
}

export function destroyElement(element) {
  if (element) {
    element.destroy();
    return null;
  }
  return null;
}

export function clearGroup(group) {
  if (group) {
    group.clear(true, true);
    return null;
  }
  return null;
}

export function createTextStyle(options = {}) {
  return {
    fontFamily: options.fontFamily || FONT_FAMILY,
    fontSize: options.fontSize || '20px',
    fontStyle: options.fontStyle || 'bold',
    fill: options.fill || colorConfig.color_lollipop,
    stroke: options.stroke || colorConfig.color_snow,
    strokeThickness: options.strokeThickness || 4,
    align: options.align || 'center',
    ...options
  };
}

// ------------------------------------------------------------------------------------
// ANIMATION UTILITIES
// ------------------------------------------------------------------------------------

/**
 * 범용 트윈 애니메이션 생성
 * @param {Phaser.Scene} scene - 씬 객체
 * @param {Object|Array} targets - 애니메이션 대상
 * @param {Object} options - 트윈 옵션 (duration, ease, alpha, scale, y, yoyo, repeat, delay, onComplete 등)
 * @returns {Phaser.Tweens.Tween} 생성된 트윈 객체
 * 
 * @example
 * // 페이드인
 * createAnimation(this, target, { alpha: 1, duration: 300 });
 * 
 * // 스케일 확대
 * createAnimation(this, target, { scale: 1, duration: 400, ease: 'Back.out' });
 * 
 * // 텍스트 효과 (위로 이동하며 사라짐)
 * createAnimation(this, target, { y: target.y - 50, alpha: 0, duration: 800, onComplete: () => target.destroy() });
 */
export function createAnimation(scene, targets, options = {}) {
  const config = { targets, duration: 300, ease: 'Power2.out', ...options };
  
  // scale 단축 옵션 처리
  if (options.scale !== undefined) {
    config.scaleX = options.scale;
    config.scaleY = options.scale;
    delete config.scale;
  }
  
  return scene.tweens.add(config);
}