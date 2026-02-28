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
  groupOrientation: { type: null, value: 'x' },

  buttonId: { type: String, value: '' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  formType: { type: String, value: '' },
  openType: { type: String, value: '' },
  hoverClass: { type: String, value: 'none' },
  hoverStopPropagation: { type: Boolean, value: false },
  hoverStartTime: { type: Number, value: 20 },
  hoverStayTime: { type: Number, value: 70 },
  lang: { type: String, value: '' },
  sessionFrom: { type: String, value: '' },
  sendMessageTitle: { type: String, value: '' },
  sendMessagePath: { type: String, value: '' },
  sendMessageImg: { type: String, value: '' },
  showMessageCard: { type: Boolean, value: false },
  appParameter: { type: String, value: '' },
  phoneNumberNoQuotaToast: { type: Boolean, value: true },
  needShowEntrance: { type: Boolean, value: false },
  entrancePath: { type: String, value: '' },
  ariaLabel: { type: String, value: '' },
} as const;
