import { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { CheckCircle, Trash2, Undo2 } from 'lucide-react-native';
import { UndoAction } from '@/hooks/use-undo-toast';

interface UndoToastProps {
  action: UndoAction | null;
  onUndo: () => void;
  durationMs?: number;
}

const CONFIG = {
  add: {
    icon: (size: number) => <CheckCircle size={size} color="#22c55e" strokeWidth={2.5} />,
    label: 'adicionada',
    progressColor: '#3b82f6',
  },
  remove: {
    icon: (size: number) => <Trash2 size={size} color="#f87171" strokeWidth={2.5} />,
    label: 'removida',
    progressColor: '#f87171',
  },
};

const UndoToast = ({ action, onUndo, durationMs = 4000 }: UndoToastProps) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;
  const hasBeenVisible = useRef(false);

  const [lastAction, setLastAction] = useState<UndoAction | null>(null);

  const isVisible = action !== null;

  if (isVisible) hasBeenVisible.current = true;

  useEffect(() => {
    if (isVisible) {
      setLastAction(action);
      progressWidth.setValue(100);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      Animated.timing(progressWidth, { toValue: 0, duration: durationMs, useNativeDriver: false }).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [isVisible, action?.key]);

  if (!hasBeenVisible.current) return null;

  const config = (action || lastAction) ? CONFIG[(action || lastAction)!.variant] : CONFIG.add;
  const displayCode = action?.code || lastAction?.code;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 40,
        left: 16,
        right: 16,
        transform: [{ translateY }],
        opacity,
        zIndex: 999,
      }}
    >
      <View
        style={{
          backgroundColor: '#1e293b',
          borderRadius: 14,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 }}>
          {config.icon(20)}
          <Text style={{ flex: 1, color: '#f1f5f9', fontSize: 14, fontWeight: '500' }}>
            Figurinha{' '}
            <Text style={{ color: '#94a3b8', fontWeight: '700' }}>{displayCode}</Text>
            {' '}{config.label}
          </Text>
          <TouchableOpacity
            onPress={onUndo}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#334155',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Undo2 size={14} color="#60a5fa" strokeWidth={2.5} />
            <Text style={{ color: '#60a5fa', fontSize: 13, fontWeight: '700' }}>Desfazer</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={{
            height: 3,
            backgroundColor: config.progressColor,
            width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </Animated.View>
  );
};

export default UndoToast;
