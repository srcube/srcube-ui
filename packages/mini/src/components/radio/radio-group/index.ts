import { radioGroup } from "@srcube-ui/styles/components/radio/style";
import { UIComponent } from "../../../shared/ui-component";

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: "shared",
    virtualHost: true,
  },

  relations: {
    "../index": {
      type: "descendant",
      linked() {
        this._updateChildren();
      },
      linkChanged() {
        this._updateChildren();
      },
      unlinked() {
        this._updateChildren();
      },
    },
  },

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: String, value: "" },
    orientation: { type: String, value: "y" },
    isBlock: { type: Boolean, value: false },
    color: { type: null, value: null },
    tone: { type: null, value: null },
    size: { type: null, value: null },
    isDisabled: { type: null, value: null },
    isReadOnly: { type: null, value: null },
    className: { type: String, value: "" },
    style: { type: String, value: "" },
  } satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: "" as string,
  },

  lifetimes: {
    attached() {
      if (this.data.value === null || this.data.value === undefined) {
        this.setData({ _innerValue: this.data.defaultValue });
      }
    },
  },

  computed: {
    $className(data) {
      return radioGroup({
        orientation: data.orientation,
        isBlock: data.isBlock,
        className: data.className ?? "",
      });
    },
  },

  observers: {
    "value,_innerValue,color,tone,size,isDisabled,isReadOnly": function () {
      this._updateChildren();
    },
  },

  methods: {
    _getCurrentValue(): string {
      return this.data.value ?? this.data._innerValue;
    },

    _updateChildren() {
      const children = this.getRelationNodes("../index");
      if (!children || children.length === 0) return;

      const currentValue = this._getCurrentValue();

      children.forEach((child) => {
        child.setData({
          groupValue: currentValue,
          groupColor: this.data.color,
          groupTone: this.data.tone,
          groupSize: this.data.size,
          groupIsDisabled: this.data.isDisabled,
          groupIsReadOnly: this.data.isReadOnly,
        });
      });
    },

    onChildSelect(value: string) {
      if (this.data.value === null || this.data.value === undefined) {
        this.setData({ _innerValue: value });
      }

      this.triggerEvent("change", { value });
    },
  },
});
