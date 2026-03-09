import { useEffect, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, Trash2, Undo2 } from 'lucide-react-native';
import { useToastStore, ToastMessage } from '@/stores/toast-store';

const CONFIG: Record<string, any> = {
  success: {
    icon: (size: number) => <CheckCircle size={size} color="#22c55e" strokeWidth={2.5} />,
    bg: '#1e293b',
    border: '#334155',
  },
  error: {
    icon: (size: number) => <AlertCircle size={size} color="#f87171" strokeWidth={2.5} />,
    bg: '#450a0a',
    border: '#7f1d1d',
  },
  info: {
    icon: (size: number) => <Info size={size} color="#3b82f6" strokeWidth={2.5} />,
    bg: '#0f172a',
    border: '#1e3a8a',
  },
  undo_add: {
    icon: (size: number) => <CheckCircle size={size} color="#22c55e" strokeWidth={2.5} />,
    bg: '#1e293b',
    border: '#1e293b',
    progressColor: '#3b82f6',
  },
  undo_remove: {
    icon: (size: number) => <Trash2 size={size} color="#f87171" strokeWidth={2.5} />,
    bg: '#1e293b',
    border: '#1e293b',
    progressColor: '#f87171',
  },
};

const GlobalToast = () => {
  const { toast, triggerUndo } = useToastStore();
  const insets = useSafeAreaInsets();
  
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;
  
  const [lastToast, setLastToast] = useState<ToastMessage | null>(null);

  const isVisible = toast !== null;

  useEffect(() => {
    if (isVisible) {
      setLastToast(toast);
      if (toast.action) {
         progressWidth.setValue(100);
      }
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      
      if (toast.action) {
         Animated.timing(progressWidth, { toValue: 0, duration: 4000, useNativeDriver: false }).start();
      }
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [isVisible, toast?.id]);

  const activeToast = toast || lastToast;
  if (!activeToast) return null;

  const isUndoToast = !!activeToast.action;
  const config = CONFIG[activeToast.variant] || CONFIG.info;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: Math.max(insets.bottom + 20, 20),
        left: 16,
        right: 16,
        transform: [{ translateY }],
        opacity,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: config.bg,
          borderColor: config.border,
          borderWidth: 1,
          borderRadius: 14,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
           {config.icon(20)}
           
           {!isUndoToast ? (
              <Text style={{ flex: 1, color: '#f1f5f9', fontSize: 14, fontWeight: '500' }}>
                 {activeToast.message}
              </Text>
           ) : (
              <>
                 <Text style={{ flex: 1, color: '#f1f5f9', fontSize: 14, fontWeight: '500' }}>
                    Figurinha{' '}
                    <Text style={{ color: '#94a3b8', fontWeight: '700' }}>{activeToast.action!.code}</Text>
                    {' '}{activeToast.variant === 'undo_add' ? 'adicionada' : 'removida'}
                 </Text>
                 <TouchableOpacity
                    onPress={triggerUndo}
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
              </>
           )}
        </View>

        {isUndoToast && (
          <Animated.View
            style={{
              height: 3,
              backgroundColor: config.progressColor,
              width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            }}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default GlobalToast;
