import React, { useState, useMemo } from 'react';
import { Modal, View, TouchableOpacity, Pressable, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list/dist/FlashList';

const SECTION_MAP: Record<string, { icon: string }> = {
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

interface CountryFilterProps {
  availableSections: string[];
  selectedSection: string | null;
  onSelect: (section: string | null) => void;
}

export function CountryFilter({
  availableSections,
  selectedSection,
  onSelect,
}: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const listData = useMemo(() => {
    const allData = availableSections.map((section) => ({
      id: section,
      name: section,
      flag: SECTION_MAP[section]?.icon || '🏳️',
    }));

    if (!searchQuery.trim()) return allData;

    return allData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [availableSections, searchQuery]);

  const selectedItem = useMemo(() => {
    if (!selectedSection) return null;
    return {
      name: selectedSection,
      flag: SECTION_MAP[selectedSection]?.icon || '🏳️',
    };
  }, [selectedSection]);

  return (
    <View>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="bg-card border-border flex-row items-center justify-between rounded-md border px-4 py-3">
        <Text className="text-foreground text-base font-medium">
          {selectedItem ? `${selectedItem.flag} ${selectedItem.name}` : '🌎 Todas as Seções'}
        </Text>
        <ChevronDown className="text-muted-foreground" size={20} />
      </Pressable>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background h-[85%] rounded-t-3xl p-4 pb-8">
            <View className="mt-2 mb-4 flex-row items-center justify-between">
              <Text className="text-foreground text-xl font-bold">Filtrar por País</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
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
                className="flex-1 pl-10"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className="border-border/50 flex-row items-center border-b p-4"
              onPress={() => {
                onSelect(null);
                setIsOpen(false);
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
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="border-border/50 flex-row items-center border-b p-4"
                    onPress={() => {
                      onSelect(item.id);
                      setIsOpen(false);
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
        </View>
      </Modal>
    </View>
  );
}
