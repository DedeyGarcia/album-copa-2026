import { createAudioPlayer } from 'expo-audio';
import { useUserSettingsStore } from '@/stores/user-settings-store';

const stickerSoundPlayer = createAudioPlayer(require('@/assets/sounds/add_sticker.mp3'));

export const playStickerSound = async () => {
  const { soundEnabled } = useUserSettingsStore.getState();
  if (!soundEnabled) return;

  try {
    await stickerSoundPlayer.seekTo(0);
    stickerSoundPlayer.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
