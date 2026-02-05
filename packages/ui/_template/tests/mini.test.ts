import * as simulate from "miniprogram-simulate";
import { expect, test } from "vitest";
// @ts-expect-error -- raw wxml import for tests
import template from "../src/mini/index.wxml?raw";
import { componentMiniProps } from "../src/mini/props";

test("renders with className in template", () => {
  const id = simulate.load({
    template,
    properties: componentMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, { className: "mini-demo" });
  comp.attach(document.body);

  const data = comp.data as { className?: string };
  expect(data.className).toBe("mini-demo");

  comp.detach();
});
