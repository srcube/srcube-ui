import type { PickerItemId, PickerReactProps } from '@srcube-ui/picker/react';
import type * as React from 'react';
import type { CascaderReactClassNames } from '../style';

export type CascaderOptionId = PickerItemId;

export type CascaderOption = {
  id: CascaderOptionId;
  label: string;
  isDisabled?: boolean;
  children?: CascaderOption[];
};

export type CascaderValue = Array<CascaderOptionId | null>;

export type CascaderValueDetail = {
  value: CascaderValue;
  labels: string[];
  options: CascaderOption[];
};

export type CascaderDraftDetail = CascaderValueDetail & {
  columnIndex?: number;
  optionId?: CascaderOptionId;
};

type CascaderBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
  | 'className'
  | 'classNames'
  | 'style'
>;

export type CascaderReactProps = CascaderBaseProps & {
  options?: CascaderOption[];
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  className?: string;
  classNames?: Partial<CascaderReactClassNames>;
  pickerClassNames?: PickerReactProps['classNames'];
  style?: React.CSSProperties;
  onValueChange?: (value: CascaderValue, detail: CascaderValueDetail) => void;
  onDraftValueChange?: (
    value: CascaderValue,
    detail: CascaderDraftDetail,
  ) => void;
};
