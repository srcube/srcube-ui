import type * as React from 'react';
import type { NoticeBarClassNames, NoticeBarVariants } from '../style';

type NoticeBarNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof NoticeBarVariants
>;

export type NoticeBarReactProps = NoticeBarVariants &
  NoticeBarNativeProps & {
    text?: React.ReactNode;
    items?: string[];
    icon?: React.ReactNode;
    action?: React.ReactNode;
    isClosable?: boolean;
    isAutoPlay?: boolean;
    isMarquee?: boolean;
    switchInterval?: number;
    switchDuration?: number;
    marqueeDuration?: number;
    isVisible?: boolean;
    defaultVisible?: boolean;
    className?: string;
    classNames?: Partial<NoticeBarClassNames>;
    style?: React.CSSProperties;
    onClose?: () => void;
    onVisibleChange?: (isVisible: boolean) => void;
  };
