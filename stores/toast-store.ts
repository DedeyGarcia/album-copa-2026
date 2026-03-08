import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'undo_add' | 'undo_remove';

export interface ToastAction {
  onTimeout: () => void;
  onUndo: () => void;
  code: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
}

interface ToastState {
  toast: ToastMessage | null;
  pendingUndoTimeout: ReturnType<typeof setTimeout> | null;
}

interface ToastActions {
  showToast: (message: string, variant?: ToastVariant, action?: ToastAction, duration?: number) => void;
  hideToast: (executeTimeoutCallback?: boolean) => void;
  triggerUndo: () => void;
}

let toastId = 0;

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toast: null,
  pendingUndoTimeout: null,

  showToast: (message, variant = 'success', action, duration = 3000) => {
    // Se havia uma ação de desfazer pendente que está sendo sobrescrita, chame o timeout dela
    const currentState = get();
    if (currentState.toast?.action && currentState.pendingUndoTimeout) {
      clearTimeout(currentState.pendingUndoTimeout);
      currentState.toast.action.onTimeout();
    }
    if (!currentState.toast?.action && currentState.pendingUndoTimeout) {
       clearTimeout(currentState.pendingUndoTimeout);
    }
    
    const id = ++toastId;
    
    let timerRef: ReturnType<typeof setTimeout> | null = null;
    
    if (action) {
       timerRef = setTimeout(() => {
          action.onTimeout();
          set((state) => (state.toast?.id === id ? { toast: null, pendingUndoTimeout: null } : state));
       }, duration);
    } else {
       timerRef = setTimeout(() => {
          set((state) => (state.toast?.id === id ? { toast: null, pendingUndoTimeout: null } : state));
       }, duration);
    }

    set({ toast: { id, message, variant, action }, pendingUndoTimeout: timerRef });
  },

  hideToast: (executeTimeoutCallback = true) => {
    const currentState = get();
    if (currentState.pendingUndoTimeout) {
      clearTimeout(currentState.pendingUndoTimeout);
    }
    if (executeTimeoutCallback && currentState.toast?.action) {
      currentState.toast.action.onTimeout();
    }
    set({ toast: null, pendingUndoTimeout: null });
  },

  triggerUndo: () => {
    const currentState = get();
    if (currentState.pendingUndoTimeout) {
      clearTimeout(currentState.pendingUndoTimeout);
    }
    if (currentState.toast?.action) {
      currentState.toast.action.onUndo();
    }
    set({ toast: null, pendingUndoTimeout: null });
  }
}));
