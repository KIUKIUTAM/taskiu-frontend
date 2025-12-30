// src/store.ts
import { create } from 'zustand';

// 定義型別 (如果你用 TypeScript)
interface BearState {
  bears: number;
  increase: () => void;
  removeAll: () => void;
}

// 建立 Store
export const useBearStore = create<BearState>((set) => ({
  // 1. 定義初始狀態 (State)
  bears: 0,

  // 2. 定義動作 (Actions) - 直接寫函式就好！
  increase: () => set((state) => ({ bears: state.bears + 1 })),

  removeAll: () => set({ bears: 0 }),
}));
