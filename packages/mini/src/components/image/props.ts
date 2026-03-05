import type { ImageMiniClassNames, ImageVariants } from '@srcube-ui/styles/components/image/style';

export type ImageMiniProps = ImageVariants & {
  id?: string;
  src?: string;
  alt?: string;
  fallback?: string;
  loadingText?: string;
  previewSrc?: string;
  previewUrls?: string[];
  className?: string;
  classNames?: Partial<ImageMiniClassNames>;
  style?: string;
};

export const imageMiniProps = {
  id: {
    type: String,
    value: '',
  },
  src: {
    type: String,
    value: '',
  },
  alt: {
    type: String,
    value: '',
  },
  fallback: {
    type: String,
    value: '',
  },
  loadingText: {
    type: String,
    value: 'Loading...',
  },
  previewSrc: {
    type: String,
    value: '',
  },
  previewUrls: {
    type: Array,
    value: [],
  },
  size: {
    type: null,
    value: 'md',
  },
  radius: {
    type: null,
    value: 'md',
  },
  fit: {
    type: null,
    value: 'cover',
  },
  ratio: {
    type: null,
    value: 'auto',
  },
  isBlock: {
    type: Boolean,
    value: false,
  },
  isPreviewable: {
    type: Boolean,
    value: false,
  },
  className: {
    type: String,
    value: '',
  },
  classNames: {
    type: Object,
    value: {},
  },
  style: {
    type: String,
    value: '',
  },
} as const;
