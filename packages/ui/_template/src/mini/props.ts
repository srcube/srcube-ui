import type { ComponentClasses, ComponentVariants } from "../style";

// TODO: rename Component* to the real component name.
export type ComponentMiniProps = ComponentVariants &
  {
    id?: string;
    className?: string;
    classNames?: ComponentClasses;
    style?: string;
    isDisabled?: boolean;
  };

export const componentMiniProps = {
  id: {
    type: String,
    value: "",
  },
  className: {
    type: String,
    value: "",
  },
  classNames: {
    type: Object,
    value: null,
  },
  style: {
    type: String,
    value: "",
  },
  isDisabled: {
    type: Boolean,
    value: false,
  },
  color: {
    type: String,
    value: "primary",
  },
} as const;
