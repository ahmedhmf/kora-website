import { computed, Signal, signal, WritableSignal } from '@angular/core';

export type StateSignals<T extends object> = {
  readonly [K in keyof T]: Signal<T[K]>;
};

export interface SignalStoreInstance<T extends object> {
  readonly state: Signal<T>;
  readonly signals: StateSignals<T>;
  patchState(updater: Partial<T> | ((current: T) => Partial<T>)): void;
  resetState(): void;
}

/**
 * Lightweight, zero-dependency Signal Store factory built on Angular Signals.
 * Exposes per-property readonly signals, full state signal, and atomic patchState.
 */
export function createSignalStore<T extends object>(initialState: T): SignalStoreInstance<T> {
  const internalState: WritableSignal<T> = signal<T>(initialState);

  const signals = {} as Record<keyof T, Signal<T[keyof T]>>;
  for (const key of Object.keys(initialState) as Array<keyof T>) {
    signals[key] = computed(() => internalState()[key]);
  }

  const patchState = (updater: Partial<T> | ((current: T) => Partial<T>)): void => {
    internalState.update((current) => {
      const partial = typeof updater === 'function' ? updater(current) : updater;
      return { ...current, ...partial };
    });
  };

  const resetState = (): void => {
    internalState.set(initialState);
  };

  return {
    state: internalState.asReadonly(),
    signals: signals as StateSignals<T>,
    patchState,
    resetState,
  };
}
