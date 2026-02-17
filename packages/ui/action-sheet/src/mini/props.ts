import type {
  ActionSheetMiniClassNames,
  ActionSheetVariants,
} from '../style';

export type ActionSheetMiniValue = string | number;

export type ActionSheetMiniItem = {
  value: ActionSheetMiniValue;
  label: string;
  description?: string;
  color?: 'default' | 'danger';
  isDisabled?: boolean;
};

export type ActionSheetMiniProps = ActionSheetVariants & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  title?: string;
  description?: string;
  actions?: ActionSheetMiniItem[];
  cancelText?: string;
  isClosable?: boolean;
  shouldCloseOnOverlayPress?: boolean;
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
  cancelText: { type: String, value: '取消' },
  isClosable: { type: Boolean, value: true },
  shouldCloseOnOverlayPress: { type: Boolean, value: true },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'lg' },
  isInset: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
