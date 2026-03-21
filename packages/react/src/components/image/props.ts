import type * as React from 'react';
import type { ImageClassNames, ImageVariants } from '@srcube-ui/styles/components/image';

type ImageNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof ImageVariants
>;

export type ImageReactProps = ImageVariants &
  ImageNativeProps & {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
    loadingText?: React.ReactNode;
    previewSrc?: string;
    previewUrls?: string[];
    onImageLoad?: () => void;
    onImageError?: () => void;
    className?: string;
    classNames?: Partial<ImageClassNames>;
    style?: React.CSSProperties;
  };

export type ImagePreviewReactProps = {
  src: string;
  tone?: ImageVariants['tone'];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  classNames?: Partial<ImageClassNames>;
};
