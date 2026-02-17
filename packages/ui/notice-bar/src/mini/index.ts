import { UIComponent } from '@srcube-ui/runtime/mini';
import { noticeBar } from '../style';
import { noticeBarMiniProps, type NoticeBarMiniProps } from './props';

type NoticeBarMiniState = {
  _innerVisible: boolean;
};

type NoticeBarMiniData = NoticeBarMiniProps & NoticeBarMiniState;

function resolveVisible(data: NoticeBarMiniData) {
  return Boolean(data._innerVisible);
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
  } satisfies NoticeBarMiniState,

  observers: {
    isVisible(nextVisible: boolean) {
      this.setData({
        _innerVisible: Boolean(nextVisible),
      } satisfies Partial<NoticeBarMiniState>);
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerVisible: Boolean(this.data.isVisible ?? this.data.defaultVisible),
      } satisfies Partial<NoticeBarMiniState>);
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
        text: slots.text({ class: custom.text }),
        action: slots.action({ class: custom.action }),
        close: slots.close({ class: custom.close }),
      };
    },
    $isVisible(data: NoticeBarMiniData) {
      return resolveVisible(data);
    },
  },

  methods: {
    handleCloseTap() {
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

export { noticeBar } from '../style';
export type { NoticeBarMiniProps } from './props';
export { noticeBarMiniProps } from './props';
