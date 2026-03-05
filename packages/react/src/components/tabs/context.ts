import * as React from 'react';
import type { TabsValue } from './props';

export type TabsContextValue = {
  activeValue: TabsValue | null;
  panelClassName?: string;
};

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  return React.useContext(TabsContext);
}
