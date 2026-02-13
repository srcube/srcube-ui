import * as React from 'react';

type DrawerContextValue = {
  title?: React.ReactNode;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export const DrawerProvider = DrawerContext.Provider;

export function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be wrapped in <Drawer>.');
  }
  return context;
}
