import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Modal, View, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

export const SECTION_MAP: Record<string, { icon: string }> = {
  // Especiais
  Especiais: { icon: '🏆' },
  Estádios: { icon: '🏟️' },

  // CONMEBOL (América do Sul)
  Argentina: { icon: '🇦🇷' },
  Brasil: { icon: '🇧🇷' },
  Uruguai: { icon: '🇺🇾' },
  Colômbia: { icon: '🇨🇴' },
  Equador: { icon: '🇪🇨' },
  Paraguai: { icon: '🇵🇾' },

  // UEFA (Europa)
  Alemanha: { icon: '🇩🇪' },
  Áustria: { icon: '🇦🇹' },
  Bélgica: { icon: '🇧🇪' },
  Croácia: { icon: '🇭🇷' },
  Dinamarca: { icon: '🇩🇰' },
  Escócia: { icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  Espanha: { icon: '🇪🇸' },
  França: { icon: '🇫🇷' },
  Holanda: { icon: '🇳🇱' },
  Hungria: { icon: '🇭🇺' },
  Inglaterra: { icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  Itália: { icon: '🇮🇹' },
  Polônia: { icon: '🇵🇱' },
  Portugal: { icon: '🇵🇹' },
  Sérvia: { icon: '🇷🇸' },
  Suíça: { icon: '🇨🇭' },

  // CONCACAF (América do Norte, Central e Caribe)
  Canadá: { icon: '🇨🇦' },
  'Estados Unidos': { icon: '🇺🇸' },
  México: { icon: '🇲🇽' },
  'Costa Rica': { icon: '🇨🇷' },
  Panamá: { icon: '🇵🇦' },
  Jamaica: { icon: '🇯🇲' },

  // CAF (África)
  Argélia: { icon: '🇩🇿' },
  Camarões: { icon: '🇨🇲' },
  'Costa do Marfim': { icon: '🇨🇮' },
  Egito: { icon: '🇪🇬' },
  Gana: { icon: '🇬🇭' },
  Marrocos: { icon: '🇲🇦' },
  Nigéria: { icon: '🇳🇬' },
  Senegal: { icon: '🇸🇳' },
  Tunísia: { icon: '🇹🇳' },

  // AFC (Ásia)
  'Arábia Saudita': { icon: '🇸🇦' },
  Austrália: { icon: '🇦🇺' },
  Catar: { icon: '🇶🇦' },
  'Coreia do Sul': { icon: '🇰🇷' },
  'Emirados Árabes': { icon: '🇦🇪' },
  Irã: { icon: '🇮🇷' },
  Iraque: { icon: '🇮🇶' },
  Japão: { icon: '🇯🇵' },
  Jordânia: { icon: '🇯🇴' },

  // OFC (Oceania)
  'Nova Zelândia': { icon: '🇳🇿' },
};

interface SectionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSections: string[];
  selectedSection: string | null;
  onSelect: (section: string | null) => void;
}

const SectionFilterModal = ({
  isOpen,
  onClose,
  availableSections,
  selectedSection,
  onSelect,
}: SectionFilterModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const panY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (isOpen) {
      panY.setValue(1000);
      Animated.spring(panY, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleClose = () => {
    Animated.timing(panY, {
      toValue: 1000,
      duration: 75,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const listData = useMemo(() => {
    const allData = availableSections.map((section) => ({
      id: section,
      name: section,
      flag: SECTION_MAP[section]?.icon || '🏳️',
    }));

    if (!searchQuery.trim()) return allData;

    return allData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [availableSections, searchQuery]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
           panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 1.5) {
          Animated.timing(panY, {
            toValue: 1000,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(panY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity 
          className="absolute inset-0"
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View 
          style={{ transform: [{ translateY: panY }] }}
          className="bg-background h-[85%] rounded-t-3xl pb-8 shadow-xl overflow-hidden"
        >
          {/* Header Draggable Area */}
          <View {...panResponder.panHandlers} className="p-4 pb-0 bg-transparent relative z-10 w-full">
             <View className="w-12 h-1.5 rounded-full bg-border self-center mb-4" />

             <View className="mb-4 flex-row items-center justify-between">
               <Text className="text-foreground text-xl font-bold">Filtrar por País / Seção</Text>
               <TouchableOpacity
                 onPress={handleClose}
              className="bg-muted rounded-full p-2">
              <X className="text-foreground" size={20} />
            </TouchableOpacity>
          </View>
          
          <View className="relative mb-4 flex-row items-center">
            <View className="absolute left-3 z-10">
              <Search className="text-muted-foreground" size={20} />
            </View>
            <Input
              placeholder="Buscar país ou sigla..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 pl-10 h-12 rounded-xl"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Content Area */}
        <View className="px-4 flex-1">
          <TouchableOpacity
            className="border-border/50 flex-row items-center border-b py-4 px-2"
            onPress={() => {
              onSelect(null);
              handleClose();
              setSearchQuery('');
            }}>
            <Text className="mr-3 text-2xl">🌎</Text>
            <Text className="text-foreground text-lg font-medium">Mostrar Todas as Seções</Text>
          </TouchableOpacity>

          <View className="mt-2 flex-1">
            <FlashList
              data={listData}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-border/50 flex-row items-center border-b py-4 px-2"
                  onPress={() => {
                    onSelect(item.id);
                    handleClose();
                    setSearchQuery('');
                  }}>
                  <Text className="mr-3 text-2xl">{item.flag}</Text>
                  <Text
                    className={`text-lg ${selectedSection === item.id ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SectionFilterModal;
