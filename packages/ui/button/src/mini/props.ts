import type { ButtonClasses, ButtonVariants } from '../style';

export type ButtonMiniProps = ButtonVariants & {
  buttonId?: string;
  className?: string;
  classNames?: ButtonClasses;
  style?: string;
  isDisabled?: boolean;
  isLoading?: boolean | 'auto';
  isIcon?: boolean;

  formType?: string;
  openType?: string;
  hoverClass?: string;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  lang?: string;
  sessionFrom?: string;
  sendMessageTitle?: string;
  sendMessagePath?: string;
  sendMessageImg?: string;
  showMessageCard?: boolean;
  appParameter?: string;
  phoneNumberNoQuotaToast?: boolean;
  needShowEntrance?: boolean;
  entrancePath?: string;
  ariaLabel?: string;
};

export const buttonMiniProps = {
  color: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  isBlock: { type: null, value: null },
  isIcon: { type: Boolean, value: false },
  isLoading: { type: null, value: false },
  isDisabled: { type: null, value: null },
  isInGroup: { type: Boolean, value: false },
  groupPosition: { type: null, value: 'none' },

  buttonId: String,
  className: String,
  classNames: { type: Object, value: {} },
  style: String,
  formType: String,
  openType: String,
  hoverClass: { type: String, value: 'none' },
  hoverStopPropagation: Boolean,
  hoverStartTime: Number,
  hoverStayTime: Number,
  lang: String,
  sessionFrom: String,
  sendMessageTitle: String,
  sendMessagePath: String,
  sendMessageImg: String,
  showMessageCard: Boolean,
  appParameter: String,
  phoneNumberNoQuotaToast: Boolean,
  needShowEntrance: Boolean,
  entrancePath: String,
  ariaLabel: String,
} as const;
