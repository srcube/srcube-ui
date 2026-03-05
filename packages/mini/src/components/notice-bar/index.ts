import { UIComponent } from '../../shared/ui-component';
import { noticeBar } from '@srcube-ui/styles/components/notice-bar/style';
import { noticeBarMiniProps, type NoticeBarMiniProps } from './props';

const DEFAULT_SWITCH_INTERVAL = 3000;
const DEFAULT_SWITCH_DURATION = 280;
const DEFAULT_MARQUEE_DURATION = 6000;

const autoPlayTimerMap = new WeakMap<object, ReturnType<typeof setInterval>>();

type NoticeBarMiniState = {
  _innerVisible: boolean;
  _currentIndex: number;
  _activeText: string;
  _switchToken: number;
  _isAutoSwitching: boolean;
  _shouldMarquee: boolean;
  _lineStyle: string;
  _textStyle: string;
};

type NoticeBarMiniData = NoticeBarMiniProps & NoticeBarMiniState;

function resolveVisible(data: NoticeBarMiniData) {
  return Boolean(data._innerVisible);
}

function normalizeDuration(
  value: number | undefined,
  fallback: number,
  minimum: number,
) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.round(value));
}

function resolveNoticeItems(data: NoticeBarMiniData) {
  const items = Array.isArray(data.items) ? data.items : [];
  const normalizedItems = items
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);

  if (normalizedItems.length > 0) {
    return normalizedItems;
  }

  const fallback = String(data.text ?? '').trim();
  if (fallback.length > 0) {
    return [fallback];
  }

  return [''];
}

function clearAutoPlayTimer(instance: object) {
  const timer = autoPlayTimerMap.get(instance);
  if (!timer) {
    return;
  }

  clearInterval(timer);
  autoPlayTimerMap.delete(instance);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    noticeBarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerVisible: true,
    _currentIndex: 0,
    _activeText: '',
    _switchToken: 0,
    _isAutoSwitching: false,
    _shouldMarquee: false,
    _lineStyle: '',
    _textStyle: '',
  } satisfies NoticeBarMiniState,

  observers: {
    isVisible(nextVisible: boolean) {
      this.setData(
        {
          _innerVisible: Boolean(nextVisible),
        } satisfies Partial<NoticeBarMiniState>,
        () => {
          this.syncTickerState();
          this.restartAutoPlay();
        },
      );
    },
    'text,items,isAutoPlay,isMarquee,switchInterval,switchDuration,marqueeDuration'() {
      this.syncTickerState();
      this.restartAutoPlay();
    },
  },

  lifetimes: {
    attached() {
      this.setData(
        {
          _innerVisible: Boolean(this.data.isVisible ?? this.data.defaultVisible),
        } satisfies Partial<NoticeBarMiniState>,
        () => {
          this.syncTickerState();
          this.restartAutoPlay();
        },
      );
    },
    detached() {
      clearAutoPlayTimer(this);
    },
  },

  computed: {
    $classNames(data: NoticeBarMiniData) {
      const slots = noticeBar({
        color: data.color,
        size: data.size,
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        icon: slots.icon({ class: custom.icon }),
        content: slots.content({ class: custom.content }),
        ticker: slots.ticker({ class: custom.ticker }),
        line: slots.line({ class: custom.line }),
        lineAnimated: slots.lineAnimated({ class: custom.lineAnimated }),
        text: slots.text({ class: custom.text }),
        textMarquee: slots.textMarquee({ class: custom.textMarquee }),
        action: slots.action({ class: custom.action }),
        close: slots.close({ class: custom.close }),
        closeIcon: slots.closeIcon({ class: custom.closeIcon }),
      };
    },
    $isVisible(data: NoticeBarMiniData) {
      return resolveVisible(data);
    },
  },

  methods: {
    syncTickerState() {
      const data = this.data as NoticeBarMiniData;
      const items = resolveNoticeItems(data);
      const itemCount = items.length;
      const safeIndex = itemCount > 0 ? data._currentIndex % itemCount : 0;
      const activeText = items[safeIndex] ?? items[0] ?? '';
      const isAutoSwitching = Boolean(data.isAutoPlay && itemCount > 1);
      const shouldMarquee = Boolean(data.isMarquee);

      const lineStyle = isAutoSwitching
        ? `animation-duration:${normalizeDuration(
            data.switchDuration,
            DEFAULT_SWITCH_DURATION,
            120,
          )}ms;`
        : '';
      const textStyle = shouldMarquee
        ? `animation-duration:${normalizeDuration(
            data.marqueeDuration,
            DEFAULT_MARQUEE_DURATION,
            1500,
          )}ms;`
        : '';

      this.setData({
        _currentIndex: safeIndex,
        _activeText: activeText,
        _isAutoSwitching: isAutoSwitching,
        _shouldMarquee: shouldMarquee,
        _lineStyle: lineStyle,
        _textStyle: textStyle,
      } satisfies Partial<NoticeBarMiniState>);
    },
    restartAutoPlay() {
      clearAutoPlayTimer(this);

      const data = this.data as NoticeBarMiniData;
      if (!resolveVisible(data) || !data.isAutoPlay) {
        return;
      }

      const items = resolveNoticeItems(data);
      if (items.length <= 1) {
        return;
      }

      const interval = normalizeDuration(
        data.switchInterval,
        DEFAULT_SWITCH_INTERVAL,
        1000,
      );
      const timer = setInterval(() => {
        const runtimeData = this.data as NoticeBarMiniData;
        if (!resolveVisible(runtimeData)) {
          return;
        }

        const runtimeItems = resolveNoticeItems(runtimeData);
        if (runtimeItems.length <= 1) {
          return;
        }

        const nextIndex = (runtimeData._currentIndex + 1) % runtimeItems.length;
        this.setData({
          _currentIndex: nextIndex,
          _activeText: runtimeItems[nextIndex] ?? runtimeItems[0] ?? '',
          _switchToken: runtimeData._switchToken + 1,
        } satisfies Partial<NoticeBarMiniState>);
      }, interval);

      autoPlayTimerMap.set(this, timer);
    },
    handleCloseTap() {
      clearAutoPlayTimer(this);
      this.setData({
        _innerVisible: false,
      } satisfies Partial<NoticeBarMiniState>);
      this.triggerEvent('visibleChange', {
        isVisible: false,
      });
      this.triggerEvent('close');
    },
  },
});

export { noticeBar } from '@srcube-ui/styles/components/notice-bar/style';
export type { NoticeBarMiniProps } from './props';
export { noticeBarMiniProps } from './props';
