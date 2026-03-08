import { useState, useRef, useCallback, useEffect } from 'react';

export interface UndoAction {
  key: number;
  code: string;
  variant: 'add' | 'remove';
  onTimeout: () => void;
  onUndo: () => void;
}

export type UndoActionInput = Omit<UndoAction, 'key'>;

export function useUndoToast(durationMs = 4000) {
  const [pendingAction, setPendingAction] = useState<UndoAction | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<UndoAction | null>(null);
  const keyRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback((input: UndoActionInput) => {
    const newAction: UndoAction = { ...input, key: ++keyRef.current };

    if (pendingRef.current) {
      pendingRef.current.onTimeout();
    }
    clearTimer();

    pendingRef.current = newAction;
    setPendingAction(newAction);

    timerRef.current = setTimeout(() => {
      newAction.onTimeout();
      pendingRef.current = null;
      setPendingAction(null);
      timerRef.current = null;
    }, durationMs);
  }, [durationMs, clearTimer]);

  const undo = useCallback(() => {
    clearTimer();
    if (pendingRef.current) {
      pendingRef.current.onUndo();
      pendingRef.current = null;
      setPendingAction(null);
    }
  }, [clearTimer]);

  const flush = useCallback(() => {
    clearTimer();
    if (pendingRef.current) {
      pendingRef.current.onTimeout();
      pendingRef.current = null;
      setPendingAction(null);
    }
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (pendingRef.current) {
        pendingRef.current.onTimeout();
        pendingRef.current = null;
      }
    };
  }, []);

  return { pendingAction, show, undo, flush };
}
