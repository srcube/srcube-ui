import { tv, VariantClasses, VariantProps } from "@srcube-ui/theme/tv";

// Shared Tailwind class tokens only. No platform logic here.
export const component = tv({
  slots: {
    base: '',
    _private: '',
  },
  variants: {
    color: {
      primary: {
        base: '',
      }
    }
  }
})

export type ComponentVariants = VariantProps<typeof component>
export type ComponentClasses = VariantClasses<typeof component>
