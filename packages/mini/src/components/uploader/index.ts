import { UIComponent } from '../../shared/ui-component';
import { uploaderStyle } from '@srcube-ui/styles/components/uploader/style';
import type { UploaderFile } from './types';
import { uploaderMiniProps, type UploaderMiniProps } from './props';

type UploaderMiniState = {
  _innerValue: UploaderFile[];
};

type UploaderMiniData = UploaderMiniProps & UploaderMiniState;

function normalizeMaxCount(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function normalizeMaxSize(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function isControlledValue(value: unknown) {
  return Array.isArray(value);
}

function normalizeFiles(value: unknown): UploaderFile[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((candidate) => candidate && typeof candidate === 'object')
    .map((candidate, index) => {
      const item = candidate as UploaderFile;
      return {
        id: item.id ?? `uploader-static-${index}-${String(item.url ?? '')}`,
        url: typeof item.url === 'string' ? item.url : '',
        name: typeof item.name === 'string' ? item.name : '',
        size:
          typeof item.size === 'number' && Number.isFinite(item.size)
            ? item.size
            : 0,
        type: typeof item.type === 'string' ? item.type : '',
      };
    })
    .filter((candidate) => candidate.url);
}

function createFileId(seed: string) {
  return `uploader-${seed}-${Math.random().toString(36).slice(2, 9)}`;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    uploaderMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: [] as UploaderFile[],
  } satisfies UploaderMiniState,

  observers: {
    value() {
      this.syncValueFromProps();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }
      this.syncValueFromProps();
    },
  },

  lifetimes: {
    attached() {
      this.syncValueFromProps();
    },
  },

  computed: {
    $resolvedValue(data: UploaderMiniData) {
      return isControlledValue(data.value)
        ? normalizeFiles(data.value)
        : normalizeFiles(data._innerValue);
    },
    $canAdd(data: UploaderMiniData) {
      const maxCount = normalizeMaxCount(data.maxCount);
      const current = isControlledValue(data.value)
        ? normalizeFiles(data.value)
        : normalizeFiles(data._innerValue);
      return !data.isDisabled && current.length < maxCount;
    },
    $classNames(data: UploaderMiniData) {
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;
      const slots = uploaderStyle({
        size: data.size,
        color: data.color,
        radius: data.radius,
        isDisabled: Boolean(data.isDisabled),
      });

      return {
        base: slots.base({ class: [classNames.base, data.className] }),
        list: slots.list({ class: classNames.list }),
        item: slots.item({ class: classNames.item }),
        preview: slots.preview({ class: classNames.preview }),
        removeButton: slots.removeButton({ class: classNames.removeButton }),
        _iRemove: slots._iRemove({ class: classNames._iRemove }),
        addButton: slots.addButton({ class: classNames.addButton }),
        addIcon: slots.addIcon({ class: classNames.addIcon }),
        addText: slots.addText({ class: classNames.addText }),
        helperText: slots.helperText({ class: classNames.helperText }),
      };
    },
  },

  methods: {
    syncValueFromProps() {
      const nextValue = isControlledValue(this.data.value)
        ? normalizeFiles(this.data.value)
        : normalizeFiles(this.data.defaultValue);

      this.setData({
        _innerValue: nextValue,
      } satisfies Partial<UploaderMiniState>);
    },

    handleAddTap() {
      if (this.data.isDisabled) {
        return;
      }

      const current = isControlledValue(this.data.value)
        ? normalizeFiles(this.data.value)
        : normalizeFiles(this.data._innerValue);
      const maxCount = normalizeMaxCount(this.data.maxCount);
      const maxSize = normalizeMaxSize(this.data.maxSize);
      const remaining = Number.isFinite(maxCount)
        ? Math.max(0, maxCount - current.length)
        : 9;

      if (remaining <= 0) {
        this.triggerEvent('exceed', {
          maxCount: Number.isFinite(maxCount) ? maxCount : current.length,
          acceptedCount: 0,
          rejectedCount: 1,
          currentCount: current.length,
        });
        return;
      }

      wx.chooseImage({
        count: this.data.isMultiple ? Math.min(remaining, 9) : 1,
        sourceType: ['album', 'camera'],
        sizeType: ['compressed', 'original'],
        success: (result) => {
          const tempFiles = Array.isArray(result.tempFiles) ? result.tempFiles : [];
          const accepted: UploaderFile[] = [];
          let rejectedCount = 0;

          tempFiles.forEach((tempFile, index) => {
            const size = Number(tempFile.size ?? 0);
            if (size > maxSize) {
              rejectedCount += 1;
              return;
            }

            accepted.push({
              id: createFileId(`${Date.now()}-${index}`),
              url: String(tempFile.path ?? ''),
              name: String(tempFile.path ?? '').split('/').pop() ?? '',
              size,
              type: 'image',
            });
          });

          if (accepted.length === 0) {
            if (rejectedCount > 0) {
              this.triggerEvent('exceed', {
                maxCount: Number.isFinite(maxCount)
                  ? maxCount
                  : current.length + tempFiles.length,
                acceptedCount: 0,
                rejectedCount,
                currentCount: current.length,
              });
            }
            return;
          }

          const nextValue = [...current, ...accepted];

          this.setData(
            {
              ...(isControlledValue(this.data.value)
                ? {}
                : { _innerValue: nextValue }),
            } satisfies Partial<UploaderMiniState>,
            () => {
              this.triggerEvent('valuechange', {
                value: nextValue,
              });
              this.triggerEvent('add', {
                added: accepted,
                value: nextValue,
              });
            },
          );

          if (rejectedCount > 0) {
            this.triggerEvent('exceed', {
              maxCount: Number.isFinite(maxCount) ? maxCount : nextValue.length,
              acceptedCount: accepted.length,
              rejectedCount,
              currentCount: current.length,
            });
          }
        },
      });
    },

    handleRemoveTap(
      event: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            index?: number;
          };
        };
      },
    ) {
      if (!this.data.isRemovable || this.data.isDisabled) {
        return;
      }

      const index = Number(event.currentTarget?.dataset?.index ?? -1);
      const current = isControlledValue(this.data.value)
        ? normalizeFiles(this.data.value)
        : normalizeFiles(this.data._innerValue);
      const target = current[index];
      if (!target) {
        return;
      }

      const nextValue = current.filter((_, currentIndex) => currentIndex !== index);

      this.setData(
        {
          ...(isControlledValue(this.data.value) ? {} : { _innerValue: nextValue }),
        } satisfies Partial<UploaderMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: nextValue,
          });
          this.triggerEvent('remove', {
            file: target,
            index,
            value: nextValue,
          });
        },
      );
    },

    handlePreviewTap(
      event: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            index?: number;
          };
        };
      },
    ) {
      if (!this.data.isPreviewable) {
        return;
      }

      const index = Number(event.currentTarget?.dataset?.index ?? -1);
      const current = isControlledValue(this.data.value)
        ? normalizeFiles(this.data.value)
        : normalizeFiles(this.data._innerValue);
      const target = current[index];
      if (!target) {
        return;
      }

      this.triggerEvent('preview', {
        file: target,
        index,
      });

      wx.previewImage({
        current: target.url,
        urls: current.map((item) => item.url),
      });
    },
  },
});

export { uploaderStyle } from '@srcube-ui/styles/components/uploader/style';
export type { UploaderExceedDetail, UploaderFile } from './types';
export type {
  UploaderMiniAddDetail,
  UploaderMiniExceedDetail,
  UploaderMiniPreviewDetail,
  UploaderMiniProps,
  UploaderMiniRemoveDetail,
  UploaderMiniValueChangeDetail,
} from './props';
export { uploaderMiniProps } from './props';
