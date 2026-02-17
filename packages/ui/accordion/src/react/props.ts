import type * as React from 'react';
import type { AccordionClassNames, AccordionVariants } from '../style';

export type AccordionValue = string | number;

export type AccordionItem = {
  value: AccordionValue;
  title: React.ReactNode;
  content: React.ReactNode;
  isDisabled?: boolean;
};

export type AccordionSelectionMode = 'single' | 'multiple';

export type AccordionChangeValue = AccordionValue | AccordionValue[] | null;

type AccordionNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof AccordionVariants
>;

export type AccordionReactProps = AccordionVariants &
  AccordionNativeProps & {
    items: AccordionItem[];
    selectionMode?: AccordionSelectionMode;
    value?: AccordionChangeValue;
    defaultValue?: AccordionChangeValue;
    isDisabled?: boolean;
    hasIndicator?: boolean;
    indicator?: React.ReactNode;
    className?: string;
    classNames?: Partial<AccordionClassNames>;
    style?: React.CSSProperties;
    onValueChange?: (value: AccordionChangeValue) => void;
  };
