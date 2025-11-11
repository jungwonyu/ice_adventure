import { colorConfig, FONT_FAMILY } from './Main.js';

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
export function createFadeInAni(scene, targets, options = {}) {
  const defaultOptions = { alpha: 1, duration: 300, ease: 'Power2.out', delay: 0 };
  const aniOptions = { ...defaultOptions, ...options, targets };
  return scene.tweens.add(aniOptions);
}

export function createScaleInAni(scene, targets, scale = 1, options = {}) {
  const defaultOptions = { alpha: 1, duration: 400, scaleX: scale, scaleY: scale, ease: 'Back.out', delay: 100 };
  const aniOptions = { ...defaultOptions, ...options, targets };
  return scene.tweens.add(aniOptions);
}

export function createTextEffectAni(scene, target, options = {}) {
  const defaultOptions = { y: target.y - 50, alpha: 0, duration: 800, ease: 'Power2.out' };
  const aniOptions = { ...defaultOptions, ...options, targets: target };
  return scene.tweens.add({...aniOptions, onComplete: () => target.destroy()});
}

export function createWarningAni(scene, target, options = {}) {
  const defaultOptions = { alpha: 0.2, duration: 300, yoyo: true, repeat: 7, ease: 'Power2.inOut'};
  const animOption = { ...defaultOptions, ...options, targets: target };
  return scene.tweens.add(animOption);
}

export function createCustomAni(scene, target, options = {}) {
  const defaultOptions = { duration: 300, ease: 'Power2.out' };
  const animOption = { ...defaultOptions, ...options, targets: target };
  return scene.tweens.add(animOption);
}