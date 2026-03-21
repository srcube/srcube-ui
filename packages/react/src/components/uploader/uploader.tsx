import * as React from 'react';
import { uploaderStyle } from '@srcube-ui/styles/components/uploader';
import type {
  UploaderExceedDetail,
  UploaderFile,
} from './types';
import type { UploaderReactProps } from './props';

function normalizeMaxCount(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function normalizeMaxSize(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function toFileId(seed: string) {
  return `uploader-${seed}-${Math.random().toString(36).slice(2, 9)}`;
}

function toNormalizedFiles(value: UploaderFile[] | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((candidate) => candidate && typeof candidate.url === 'string')
    .map((candidate, index) => ({
      ...candidate,
      id: candidate.id ?? `uploader-static-${index}-${candidate.url}`,
    }));
}

function canCreateObjectURL() {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
}

function safeCreateObjectURL(file: File) {
  if (!canCreateObjectURL()) {
    return '';
  }

  return URL.createObjectURL(file);
}

function safeRevokeObjectURL(url: string) {
  if (!url || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }

  URL.revokeObjectURL(url);
}

export const Uploader = React.forwardRef<HTMLDivElement, UploaderReactProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      maxCount = 9,
      maxSize,
      accept = 'image/*',
      isMultiple = true,
      isRemovable = true,
      isPreviewable = true,
      addText = 'Upload',
      helperText,
      size,
      color,
      tone,
      radius,
      isDisabled = false,
      className,
      classNames,
      style,
      onValueChange,
      onAdd,
      onRemove,
      onPreview,
      onExceed,
      ...rest
    } = props;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const generatedUrlsRef = React.useRef(new Set<string>());
    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = React.useState<UploaderFile[]>(
      () => toNormalizedFiles(defaultValue),
    );

    const files = React.useMemo(
      () =>
        toNormalizedFiles(
          isControlled
            ? value
            : innerValue,
        ),
      [innerValue, isControlled, value],
    );

    const maxCountValue = React.useMemo(
      () => normalizeMaxCount(maxCount),
      [maxCount],
    );
    const maxSizeValue = React.useMemo(
      () => normalizeMaxSize(maxSize),
      [maxSize],
    );

    const slots = React.useMemo(
      () =>
        uploaderStyle({
          size,
          color,
          tone,
          radius,
          isDisabled,
        }),
      [color, isDisabled, radius, size, tone],
    );

    React.useEffect(() => {
      return () => {
        generatedUrlsRef.current.forEach((url) => {
          safeRevokeObjectURL(url);
        });
        generatedUrlsRef.current.clear();
      };
    }, []);

    const emitExceed = React.useCallback(
      (detail: UploaderExceedDetail) => {
        onExceed?.(detail);
      },
      [onExceed],
    );

    const updateValue = React.useCallback(
      (nextValue: UploaderFile[]) => {
        if (!isControlled) {
          setInnerValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    const handleAddTap = React.useCallback(() => {
      if (isDisabled) {
        return;
      }

      inputRef.current?.click();
    }, [isDisabled]);

    const handleInputChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        if (selectedFiles.length === 0) {
          return;
        }

        const currentCount = files.length;
        const remainingCount = Number.isFinite(maxCountValue)
          ? Math.max(0, maxCountValue - currentCount)
          : selectedFiles.length;

        if (remainingCount <= 0) {
          emitExceed({
            maxCount: Number.isFinite(maxCountValue) ? maxCountValue : currentCount,
            acceptedCount: 0,
            rejectedCount: selectedFiles.length,
            currentCount,
          });
          event.target.value = '';
          return;
        }

        const slicedByCount = selectedFiles.slice(0, remainingCount);
        const accepted: UploaderFile[] = [];
        let rejectedCount = selectedFiles.length - slicedByCount.length;

        slicedByCount.forEach((file, index) => {
          if (file.size > maxSizeValue) {
            rejectedCount += 1;
            return;
          }

          const fileUrl = safeCreateObjectURL(file);
          if (fileUrl) {
            generatedUrlsRef.current.add(fileUrl);
          }

          accepted.push({
            id: toFileId(`${Date.now()}-${index}`),
            url: fileUrl,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        });

        if (accepted.length === 0) {
          if (rejectedCount > 0) {
            emitExceed({
              maxCount: Number.isFinite(maxCountValue)
                ? maxCountValue
                : currentCount + selectedFiles.length,
              acceptedCount: 0,
              rejectedCount,
              currentCount,
            });
          }
          event.target.value = '';
          return;
        }

        const nextValue = [...files, ...accepted];
        updateValue(nextValue);
        onAdd?.(accepted, nextValue);

        if (rejectedCount > 0) {
          emitExceed({
            maxCount: Number.isFinite(maxCountValue)
              ? maxCountValue
              : nextValue.length,
            acceptedCount: accepted.length,
            rejectedCount,
            currentCount,
          });
        }

        event.target.value = '';
      },
      [
        emitExceed,
        files,
        maxCountValue,
        maxSizeValue,
        onAdd,
        updateValue,
      ],
    );

    const handleRemove = React.useCallback(
      (index: number) => {
        if (!isRemovable || isDisabled) {
          return;
        }

        const target = files[index];
        if (!target) {
          return;
        }

        const nextValue = files.filter((_, fileIndex) => fileIndex !== index);

        if (target.url && generatedUrlsRef.current.has(target.url)) {
          safeRevokeObjectURL(target.url);
          generatedUrlsRef.current.delete(target.url);
        }

        updateValue(nextValue);
        onRemove?.(target, index, nextValue);
      },
      [files, isDisabled, isRemovable, onRemove, updateValue],
    );

    const handlePreview = React.useCallback(
      (file: UploaderFile, index: number) => {
        if (!isPreviewable) {
          return;
        }

        onPreview?.(file, index);

        if (onPreview || !file.url || typeof window === 'undefined') {
          return;
        }

        window.open(file.url, '_blank', 'noopener,noreferrer');
      },
      [isPreviewable, onPreview],
    );

    const canAdd = !isDisabled && files.length < maxCountValue;

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={slots.list({ class: classNames?.list })}>
          {files.map((file, index) => (
            <div
              key={String(file.id ?? `${file.url}-${index}`)}
              className={slots.item({ class: classNames?.item })}
            >
              <img
                src={file.url}
                alt={file.name ?? `file-${index + 1}`}
                className={slots.preview({ class: classNames?.preview })}
                onClick={() => {
                  handlePreview(file, index);
                }}
              />
              {isRemovable ? (
                <button
                  type="button"
                  className={slots.removeButton({ class: classNames?.removeButton })}
                  onClick={() => {
                    handleRemove(index);
                  }}
                  aria-label="remove file"
                >
                  <span className={slots._iRemove()} />
                </button>
              ) : null}
            </div>
          ))}

          {canAdd ? (
            <button
              type="button"
              className={slots.addButton({ class: classNames?.addButton })}
              onClick={handleAddTap}
              aria-label="add file"
            >
              <span className={slots.addIcon({ class: classNames?.addIcon })}>+</span>
              <span className={slots.addText({ class: classNames?.addText })}>
                {addText}
              </span>
            </button>
          ) : null}
        </div>

        {helperText ? (
          <div className={slots.helperText({ class: classNames?.helperText })}>
            {helperText}
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple={isMultiple}
          disabled={isDisabled}
          onChange={handleInputChange}
        />
      </div>
    );
  },
);

Uploader.displayName = 'Srcube.Uploader';
