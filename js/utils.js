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