import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'undo_add' | 'undo_remove';

export interface ToastAction {
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
  hideToast: () => void;
  triggerUndo: () => void;
}

let toastId = 0;

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toast: null,
  pendingUndoTimeout: null,

  showToast: (message, variant = 'success', action, duration = 3000) => {
    const currentState = get();
    if (currentState.pendingUndoTimeout) {
      clearTimeout(currentState.pendingUndoTimeout);
    }

    const id = ++toastId;

    const timerRef = setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null, pendingUndoTimeout: null } : state));
    }, duration);

    set({ toast: { id, message, variant, action }, pendingUndoTimeout: timerRef });
  },

  hideToast: () => {
    const currentState = get();
    if (currentState.pendingUndoTimeout) {
      clearTimeout(currentState.pendingUndoTimeout);
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
  },
}));
