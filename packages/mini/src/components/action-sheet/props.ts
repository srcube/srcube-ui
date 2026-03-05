import type { ButtonMiniProps } from '../button';
import type {
  ActionSheetActionColor,
  ActionSheetMiniClassNames,
  ActionSheetVariants,
} from '@srcube-ui/styles/components/action-sheet/style';
import type { ActionSheetLocale } from './locale';

type ActionSheetMiniVariants = Omit<ActionSheetVariants, 'isOpen'>;

export type ActionSheetMiniValue = string | number;

export type ActionSheetMiniItem = {
  value: ActionSheetMiniValue;
  label: string;
  description?: string;
  color?: ActionSheetActionColor;
  isDisabled?: boolean;
};

type ActionSheetCancelButtonMiniKeys =
  | 'buttonId'
  | 'color'
  | 'variant'
  | 'size'
  | 'radius'
  | 'isBlock'
  | 'isDisabled'
  | 'isLoading'
  | 'className'
  | 'style'
  | 'hoverClass'
  | 'hoverStopPropagation'
  | 'hoverStartTime'
  | 'hoverStayTime'
  | 'ariaLabel';

export type ActionSheetCancelButtonMiniProps = Partial<
  Pick<ButtonMiniProps, ActionSheetCancelButtonMiniKeys>
>;

export type ActionSheetMiniProps = ActionSheetMiniVariants & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  title?: string;
  description?: string;
  actions?: ActionSheetMiniItem[];
  hasFooter?: boolean;
  cancelText?: string;
  cancelButtonProps?: ActionSheetCancelButtonMiniProps;
  locale?: ActionSheetLocale;
  isClosable?: boolean;
  className?: string;
  classNames?: Partial<ActionSheetMiniClassNames>;
  style?: string;
};

export const actionSheetMiniProps = {
  isOpen: { type: Boolean, value: false },
  defaultOpen: { type: Boolean, value: false },
  title: { type: String, value: '' },
  description: { type: String, value: '' },
  actions: { type: Array, value: [] },
  hasFooter: { type: Boolean, value: false },
  cancelText: { type: String, value: '' },
  cancelButtonProps: { type: Object, value: {} },
  locale: { type: String, value: 'en' },
  isClosable: { type: Boolean, value: true },
  size: { type: null, value: 'md' },
  radius: { type: null, value: null },
  isInset: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
