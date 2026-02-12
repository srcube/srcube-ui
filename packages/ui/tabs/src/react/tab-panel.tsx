import * as React from 'react';
import { tabPanel } from '../style';
import { useTabsContext } from './context';
import type { TabPanelReactProps } from './props';

export function TabPanel(props: TabPanelReactProps) {
  const {
    value,
    activeValue,
    isActive,
    keepMounted = false,
    className,
    classNames,
    style,
    children,
    ...rest
  } = props;

  const context = useTabsContext();
  const resolvedActiveValue = activeValue ?? context?.activeValue ?? null;
  const resolvedIsActive =
    isActive ?? (resolvedActiveValue !== null && value === resolvedActiveValue);
  const shouldRender = keepMounted ? true : resolvedIsActive;

  if (!shouldRender) {
    return null;
  }

  const slots = tabPanel({
    isActive: resolvedIsActive,
  });

  const styleObj = typeof style === 'string' ? undefined : style;

  return (
    <div
      role="tabpanel"
      data-slot="tab-panel"
      data-value={String(value)}
      hidden={!resolvedIsActive}
      className={slots.base({
        class: [context?.panelClassName, classNames?.base, className],
      })}
      style={styleObj}
      {...rest}
    >
      {children}
    </div>
  );
}

TabPanel.displayName = 'Srcube.TabPanel';
