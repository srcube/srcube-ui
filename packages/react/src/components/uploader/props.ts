import type * as React from 'react';
import type {
  UploaderClassNames,
  UploaderVariants,
} from '@srcube-ui/styles/components/uploader';
import type {
  UploaderExceedDetail,
  UploaderFile,
} from './types';

type UploaderNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'onChange' | keyof UploaderVariants
>;

export type UploaderReactProps = UploaderVariants &
  UploaderNativeProps & {
    value?: UploaderFile[];
    defaultValue?: UploaderFile[];
    maxCount?: number;
    maxSize?: number;
    accept?: string;
    isMultiple?: boolean;
    isRemovable?: boolean;
    isPreviewable?: boolean;
    addText?: React.ReactNode;
    helperText?: React.ReactNode;
    className?: string;
    classNames?: Partial<UploaderClassNames>;
    style?: React.CSSProperties;
    onValueChange?: (value: UploaderFile[]) => void;
    onAdd?: (added: UploaderFile[], value: UploaderFile[]) => void;
    onRemove?: (
      file: UploaderFile,
      index: number,
      value: UploaderFile[],
    ) => void;
    onPreview?: (file: UploaderFile, index: number) => void;
    onExceed?: (detail: UploaderExceedDetail) => void;
  };
