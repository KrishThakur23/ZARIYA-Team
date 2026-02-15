'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

// This context will hold the state for the multi-step product form.
// As we build out the form, we'll add state for images, details, etc.
type ProductFormContextType = {
  // Example state, we can expand this
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const ProductFormContext = createContext<ProductFormContextType | undefined>(
  undefined
);

export function ProductFormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);

  const value = {
    currentStep,
    setCurrentStep,
  };

  return (
    <ProductFormContext.Provider value={value}>
      {children}
    </ProductFormContext.Provider>
  );
}

export function useProductFormContext() {
  const context = useContext(ProductFormContext);
  if (context === undefined) {
    throw new Error(
      'useProductFormContext must be used within a ProductFormProvider'
    );
  }
  return context;
}
