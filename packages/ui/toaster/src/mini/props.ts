import type {
  ToasterMiniClassNames,
} from '../style';

export type ToasterMiniProps = {
  max?: number;
  className?: string;
  classNames?: Partial<ToasterMiniClassNames>;
  style?: string;
};

export const toasterMiniProps = {
  max: { type: Number, value: 1 },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
