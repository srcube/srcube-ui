import * as simulate from "miniprogram-simulate";
import { beforeAll, expect, it, vi } from "vitest";
// @ts-expect-error -- raw wxml import for tests
import template from "../../src/components/radio/index.wxml?raw";

let definition: Record<string, unknown> | undefined;

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleTap: (e: WechatMiniprogram.TouchEvent) => Promise<void> | void;
};

vi.doMock("miniprogram-computed", () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import("../../src/components/radio/index");
});

function renderRadio(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error("Radio mini definition not captured");
  }

  const { relations: _relations, ...rest } = definition;
  void _relations;

  const id = simulate.load({
    template,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it("skips tap when disabled", async () => {
  const comp = renderRadio({ isDisabled: true });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});

it("supports auto loading wait", async () => {
  const comp = renderRadio({ isLoading: "auto" });

  let resolvePromise: (() => void) | undefined;
  const waitPromise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  const triggerSpy = vi.fn((name, detail) => {
    if (name === "tap") {
      detail.wait(waitPromise);
    }
  });

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  const handlePromise = instance.handleTap({
    detail: {},
  } as WechatMiniprogram.TouchEvent);

  await Promise.resolve();
  const data = comp.data as { _autoLoading?: boolean };
  expect(data._autoLoading).toBe(true);

  resolvePromise?.();
  await handlePromise;

  expect(data._autoLoading).toBe(false);
  comp.detach();
});

it("selects when uncontrolled", async () => {
  const comp = renderRadio({ value: "a" });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(comp.data._innerSelected).toBe(true);
  expect(triggerSpy).toHaveBeenCalledWith(
    "change",
    expect.objectContaining({
      value: "a",
      isSelected: true,
    })
  );

  comp.detach();
});

it("supports dark tone styles", () => {
  if (!definition) {
    throw new Error("Radio mini definition not captured");
  }

  const computed = definition.computed as Record<
    string,
    (data: Record<string, unknown>) => Record<string, string>
  >;

  const classNames = computed.$classNames({
    tone: "dark",
    color: "primary",
    size: null,
    isSelected: true,
    _innerSelected: false,
    isLoading: false,
    _autoLoading: false,
    isDisabled: false,
    isReadOnly: false,
    groupValue: null,
    groupColor: null,
    groupTone: null,
    groupSize: null,
    groupIsDisabled: null,
    groupIsReadOnly: null,
    className: "",
    classNames: {},
    value: "",
  });

  expect(classNames.radio).toContain("before:border-primary-600");
  expect(classNames.iconWrapper).toContain("text-primary-600");
});
