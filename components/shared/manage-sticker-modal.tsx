import { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import { useManageStickerStore } from '@/stores/manage-sticker-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { useToastStore } from '@/stores/toast-store';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react-native';
import StickerCard from './sticker-card';
import { playStickerSound } from '@/utils/sound';

interface ManageStickerModalProps {
  onDeleteSuccess?: (code: string, previousQuantity: number) => void;
}

const ManageStickerModal = ({ onDeleteSuccess }: ManageStickerModalProps) => {
  const { isOpen, selectedSticker, currentQuantity, closeModal } = useManageStickerStore();
  const { upsertSticker, optimisticRemove } = useUserStickersStore();
  const { showToast } = useToastStore();
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanged = localQuantity !== currentQuantity;

  useEffect(() => {
    if (isOpen) {
      setLocalQuantity(currentQuantity);
    }
  }, [isOpen, currentQuantity]);

  if (!selectedSticker) return null;

  const handleSave = async () => {
    if (!hasChanged) {
      closeModal();
      return;
    }

    setIsSaving(true);
    try {
      const isDeleting = localQuantity === 0;
      const previousQuantity = currentQuantity;

      if (isDeleting) {
        optimisticRemove(selectedSticker.code);
        closeModal();
        onDeleteSuccess?.(selectedSticker.code, previousQuantity);
        setIsSaving(false);
        return;
      }

      await upsertSticker(selectedSticker.code, localQuantity);

      playStickerSound();
      showToast(`Figurinha ${selectedSticker.code} atualizada!`);
      closeModal();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Houve um erro ao salvar a figurinha.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={closeModal} 
        className="flex-1 justify-center items-center bg-black/60 px-4"
      >
        <TouchableWithoutFeedback>
          <View className="w-full max-w-sm bg-background rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-border/50">
              <Text className="text-xl font-bold">Figurinha: {selectedSticker.code}</Text>
              <TouchableOpacity onPress={closeModal} className="p-2 -mr-2">
                <X size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View className="p-6 items-center">
              {selectedSticker.name && (
                 <Text className="text-muted-foreground text-center mb-6">{selectedSticker.name}</Text>
              )}

              <StickerCard sticker={selectedSticker} quantity={localQuantity} />

              <Text className="text-lg font-semibold mb-4 mt-6">Quantidade:</Text>
              
              <View className="flex-row items-center gap-6">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-12 h-12 rounded-full"
                  onPress={() => setLocalQuantity(Math.max(0, localQuantity - 1))}
                >
                  <Minus size={24} className={localQuantity > 0 ? "text-foreground" : "text-muted-foreground opacity-50"} />
                </Button>
                
                <Text className="text-4xl font-bold w-12 text-center">{localQuantity}</Text>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-12 h-12 rounded-full"
                  onPress={() => setLocalQuantity(localQuantity + 1)}
                >
                  <Plus size={24} className="text-foreground" />
                </Button>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center border-t border-border/50 p-4 gap-3 bg-muted/20">
              <Button 
                variant="outline" 
                className="flex-1" 
                onPress={closeModal}
                disabled={isSaving}
              >
                <Text>Cancelar</Text>
              </Button>
              <Button 
                className="flex-1" 
                onPress={handleSave}
                disabled={isSaving || !hasChanged}
              >
                {isSaving ? <ActivityIndicator color="#FFF" /> : <Text>Salvar</Text>}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default ManageStickerModal;
