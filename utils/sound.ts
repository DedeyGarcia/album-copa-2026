import { createAudioPlayer } from 'expo-audio';

// Cria um player global apenas uma vez para economizar memória
const stickerSoundPlayer = createAudioPlayer(require('@/assets/sounds/add_sticker.wav'));

export const playStickerSound = async () => {
  try {
    await stickerSoundPlayer.seekTo(0);
    stickerSoundPlayer.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
