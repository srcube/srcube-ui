import { UIComponent } from "@srcube-ui/mini";
import { button } from "../style";
import { buttonMiniProps } from "./props";

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: "apply-shared",
  },

  relations: {
    "./button-group/index": {
      type: "ancestor",
    },
  },

  properties:
    buttonMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _autoLoading: false,
    groupColor: null,
    groupVariant: null,
    groupSize: null,
    groupRadius: null,
    groupIsBlock: null,
    groupIsDisabled: null,
  },

  computed: {
    $isLoading(data) {
      const { isLoading, _autoLoading } = data;
      return isLoading === "auto" ? _autoLoading : isLoading;
    },
    $isDisabled(data) {
      const { isDisabled, isLoading, _autoLoading, groupIsDisabled } = data;
      const loading = isLoading === "auto" ? _autoLoading : isLoading;
      const disabled = isDisabled || groupIsDisabled || loading;
      return disabled;
    },
    $classNames(data) {
      const {
        color,
        variant,
        size,
        radius,
        isBlock,
        isIcon,
        isLoading,
        isDisabled,
        isInGroup,
        groupPosition,
        className,
        classNames,
        _autoLoading,
        groupColor,
        groupVariant,
        groupSize,
        groupRadius,
        groupIsBlock,
        groupIsDisabled,
      } = data;

      const resolvedColor = color ?? groupColor ?? "primary";
      const resolvedVariant = variant ?? groupVariant ?? "solid";
      const resolvedSize = size ?? groupSize ?? "md";
      const resolvedRadius = radius ?? groupRadius ?? "md";
      const resolvedIsBlock = isBlock ?? groupIsBlock ?? false;
      const loading = isLoading === "auto" ? _autoLoading : isLoading;
      const disabled = isDisabled || groupIsDisabled || loading;

      const slots = button({
        color: resolvedColor,
        variant: resolvedVariant,
        size: resolvedSize,
        radius: resolvedRadius,
        isBlock: resolvedIsBlock,
        isIcon,
        isLoading: loading,
        isDisabled: disabled,
        isInGroup,
        groupIsBlock: groupIsBlock ?? false,
        groupPosition: radius ? "none" : groupPosition,
      });

      return {
        base: slots.base({ class: [classNames?.base, className] }),
        _iLoading: slots._iLoading(),
      };
    },
  },

  methods: {
    async handleTap(e: WechatMiniprogram.TouchEvent) {
      const { isDisabled, isLoading, _autoLoading } = this.data;

      const currentLoading = isLoading === "auto" ? _autoLoading : isLoading;

      if (isDisabled || currentLoading) return;

      if (isLoading === "auto") {
        let promiseToWait: Promise<unknown> | undefined;

        const detail = {
          ...e.detail,
          source: e,
          wait: (
            promiseOrFactory: Promise<unknown> | (() => Promise<unknown>),
          ) => {
            const resolvedPromise =
              typeof promiseOrFactory === "function"
                ? promiseOrFactory()
                : promiseOrFactory;

            if (resolvedPromise && typeof resolvedPromise.then === "function") {
              promiseToWait = resolvedPromise;
            }
          },
        };

        this.triggerEvent("tap", detail);

        if (promiseToWait) {
          this.setData({ _autoLoading: true });
          try {
            await promiseToWait;
          } catch (err) {
            console.error("Button async error:", err);
          } finally {
            this.setData({ _autoLoading: false });
          }
        }
      } else {
        this.triggerEvent("tap", e);
      }
    },

    onGetUserInfo(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("getuserinfo", e);
    },
    onContact(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("contact", e);
    },
    onGetPhoneNumber(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("getphonenumber", e);
    },
    onGetRealTimePhoneNumber(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("getrealtimephonenumber", e);
    },
    onError(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("error", e);
    },
    onOpenSetting(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("opensetting", e);
    },
    onLaunchApp(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("launchapp", e);
    },
    onChooseAvatar(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("chooseavatar", e);
    },
    onAgreePrivacyAuthorization(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("agreeprivacyauthorization", e);
    },
  },
});

export { button } from "../style";
export type { ButtonMiniProps } from "./props";
export { buttonMiniProps } from "./props";
