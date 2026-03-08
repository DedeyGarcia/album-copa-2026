import { View, TouchableOpacity, Image } from 'react-native';
import { Sticker } from '@/types';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useManageStickerStore } from '@/stores/manage-sticker-store';
import { Check, X } from 'lucide-react-native';
import { SECTION_MAP } from '@/components/shared/section-filter-modal';

const FLAG_ISO_MAP: Record<string, string> = {
  'Argentina': 'ar', 'Brasil': 'br', 'Uruguai': 'uy', 'Colômbia': 'co', 'Equador': 'ec', 'Paraguai': 'py',
  'Alemanha': 'de', 'Áustria': 'at', 'Bélgica': 'be', 'Croácia': 'hr', 'Dinamarca': 'dk', 'Escócia': 'gb-sct', 'Espanha': 'es', 'França': 'fr', 'Holanda': 'nl', 'Hungria': 'hu', 'Inglaterra': 'gb-eng', 'Itália': 'it', 'Polônia': 'pl', 'Portugal': 'pt', 'Sérvia': 'rs', 'Suíça': 'ch',
  'Canadá': 'ca', 'Estados Unidos': 'us', 'México': 'mx', 'Costa Rica': 'cr', 'Panamá': 'pa', 'Jamaica': 'jm',
  'Argélia': 'dz', 'Camarões': 'cm', 'Costa do Marfim': 'ci', 'Egito': 'eg', 'Gana': 'gh', 'Marrocos': 'ma', 'Nigéria': 'ng', 'Senegal': 'sn', 'Tunísia': 'tn',
  'Arábia Saudita': 'sa', 'Austrália': 'au', 'Catar': 'qa', 'Coreia do Sul': 'kr', 'Emirados Árabes': 'ae', 'Irã': 'ir', 'Iraque': 'iq', 'Japão': 'jp', 'Jordânia': 'jo',
  'Nova Zelândia': 'nz',
};

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  showDuplicatesQuantity?: boolean;
}

const StickerCard = ({ sticker, quantity, showDuplicatesQuantity = true }: StickerCardProps) => {
  const { openModal } = useManageStickerStore();
  
  const isOwned = quantity > 0;
  const isoCode = FLAG_ISO_MAP[sticker.section];
  const fallbackIcon = SECTION_MAP[sticker.section]?.icon || '🏆';

  return (
    <View className="w-1/5 p-0.5">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openModal(sticker, quantity)}
      >
        <Card 
          className={cn(
            'aspect-[5/6] flex-col p-0 gap-0 overflow-hidden relative rounded-md border-2',
            isOwned 
              ? 'bg-primary border-primary shadow-sm' 
              : 'border-transparent'
          )}
          style={!isOwned ? { backgroundColor: 'rgba(0,0,0,0.8)' } : undefined}
        >
          {isOwned ? (
            <>
              {/* Parte Superior com Bandeira */}
              <View className="w-full flex-1 relative items-center justify-center bg-muted overflow-hidden">
                 {isoCode ? (
                   <Image 
                     source={{ uri: `https://flagcdn.com/w160/${isoCode}.png` }} 
                     className="absolute top-0 w-full h-[108%] opacity-80"
                     resizeMode="cover"
                   />
                 ) : (
                   <View className="absolute inset-0 items-center justify-center">
                     <Text className="text-3xl">{fallbackIcon}</Text>
                   </View>
                 )}

                 {/* Código Superior Esquerdo com text shadow rústico */}
                 <View className="absolute top-0.5 left-1 z-10 rounded px-0.5 bg-black/30">
                   <Text className="text-[10px] sm:text-[11px] font-bold text-white tracking-tighter">
                     {sticker.code}
                   </Text>
                 </View>


                 {/* Check Central azul posicionado no centro VISÍVEL da bandeira */}
                 <View className="z-10 items-center justify-center">
                   <Check color="#3b82f6" size={28} strokeWidth={4} />
                 </View>
              </View>

              {/* Badge de Repetidas — canto inferior direito, acima da barra Obtida */}
              {quantity > 1 && showDuplicatesQuantity && (
                <View className="absolute bottom-[20px] right-0.5 bg-primary rounded-full w-[16px] h-[16px] items-center justify-center z-20 shadow-sm border border-background">
                  <Text style={{ color: 'white' }} className="text-[8px] font-bold">
                    {quantity - 1}
                  </Text>
                </View>
              )}

              {/* Barra Inferior */}
              <View className="w-full bg-primary items-center justify-center py-[4px] border-t border-primary">
                 <Text className="text-primary-foreground text-[8px] font-bold uppercase tracking-wider">
                   Obtida
                 </Text>
              </View>
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <View className="absolute top-0.5 left-1 z-10">
                <Text style={{ color: 'white' }} className="text-[10px] sm:text-[11px] font-bold tracking-tighter">
                  {sticker.code}
                </Text>
              </View>
              <X color="white" size={24} strokeWidth={3} />
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </View>
  );
};

export default StickerCard;
