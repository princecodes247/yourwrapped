import { create } from 'zustand';
import { WrappedData, RelationshipType } from '@/types/wrapped';

interface WrappedStore {
  currentStep: number;
  wrappedData: Partial<WrappedData>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateWrappedData: (data: Partial<WrappedData>) => void;
  resetWrapped: () => void;
}

export const useWrappedStore = create<WrappedStore>((set) => ({
  currentStep: 0,
  wrappedData: {},
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(0, state.currentStep - 1) 
  })),
  
  updateWrappedData: (data) => set((state) => ({
    wrappedData: { ...state.wrappedData, ...data }
  })),
  
  resetWrapped: () => set({ currentStep: 0, wrappedData: {} }),
}));
