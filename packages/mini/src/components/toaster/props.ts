import type {
  ToasterMiniClassNames,
} from '@srcube-ui/styles/components/toaster/style';

export type ToasterMiniProps = {
  className?: string;
  classNames?: Partial<ToasterMiniClassNames>;
  style?: string;
};

export const toasterMiniProps = {
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
