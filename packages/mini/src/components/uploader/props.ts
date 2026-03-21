import type {
  UploaderMiniClassNames,
  UploaderVariants,
} from '@srcube-ui/styles/components/uploader/style';
import type {
  UploaderExceedDetail,
  UploaderFile,
} from './types';

export type UploaderMiniProps = UploaderVariants & {
  id?: string;
  value?: UploaderFile[] | null;
  defaultValue?: UploaderFile[];
  maxCount?: number;
  maxSize?: number;
  isMultiple?: boolean;
  isRemovable?: boolean;
  isPreviewable?: boolean;
  addText?: string;
  helperText?: string;
  className?: string;
  classNames?: Partial<UploaderMiniClassNames>;
  style?: string;
};

export type UploaderMiniValueChangeDetail = {
  value: UploaderFile[];
};

export type UploaderMiniAddDetail = {
  added: UploaderFile[];
  value: UploaderFile[];
};

export type UploaderMiniRemoveDetail = {
  file: UploaderFile;
  index: number;
  value: UploaderFile[];
};

export type UploaderMiniPreviewDetail = {
  file: UploaderFile;
  index: number;
};

export type UploaderMiniExceedDetail = UploaderExceedDetail;

export const uploaderMiniProps = {
  id: { type: String, value: '' },
  value: { type: null, value: null },
  defaultValue: { type: Array, value: [] },
  maxCount: { type: Number, value: 9 },
  maxSize: { type: Number, value: 0 },
  isMultiple: { type: Boolean, value: true },
  isRemovable: { type: Boolean, value: true },
  isPreviewable: { type: Boolean, value: true },
  addText: { type: String, value: 'Upload' },
  helperText: { type: String, value: '' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  size: { type: null, value: 'md' },
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  radius: { type: null, value: 'md' },
  isDisabled: { type: Boolean, value: false },
} as const;
