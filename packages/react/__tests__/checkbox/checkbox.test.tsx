import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Checkbox, CheckboxGroup } from "../../src/components/checkbox";

it("calls onTap when enabled", () => {
  const onTap = vi.fn();
  render(<Checkbox onTap={onTap}>Option A</Checkbox>);

  fireEvent.click(screen.getByRole("checkbox", { name: "Option A" }));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it("does not call onTap when disabled", () => {
  const onTap = vi.fn();
  render(
    <Checkbox isDisabled onTap={onTap}>
      Disabled
    </Checkbox>
  );

  fireEvent.click(screen.getByRole("checkbox", { name: "Disabled" }));
  expect(onTap).not.toHaveBeenCalled();
});

it("calls onValueChange for standalone", () => {
  const onValueChange = vi.fn();
  render(<Checkbox onValueChange={onValueChange}>Standalone</Checkbox>);

  fireEvent.click(screen.getByRole("checkbox", { name: "Standalone" }));
  expect(onValueChange).toHaveBeenCalledWith(true);
});

it("keeps icon hidden when unchecked and not loading", () => {
  const { container } = render(<Checkbox>Idle</Checkbox>);
  const iconWrapper = container.querySelector(".icon-check")?.parentElement;
  expect(iconWrapper?.className).toContain("opacity-0");
  expect(iconWrapper?.className).toContain("invisible");
});

it("renders spinner when loading", () => {
  const { container } = render(<Checkbox isLoading>Loading</Checkbox>);
  const spinner = container.querySelector(".icon-spinner");
  expect(spinner).not.toBeNull();
});

it("renders check icon when selected", () => {
  const { container } = render(<Checkbox isSelected>Checked</Checkbox>);
  const check = container.querySelector(".icon-check");
  expect(check).not.toBeNull();
});

it("supports dark tone styles", () => {
  const { container } = render(
    <Checkbox tone="dark" isSelected>
      Dark
    </Checkbox>
  );

  const checkboxControl = container.querySelector(
    "label > span:nth-of-type(2)"
  );
  expect(checkboxControl?.className).toContain("before:border-zinc-600");
  expect(checkboxControl?.className).toContain("after:bg-zinc-600");
});

it("calls onValueChange for group", () => {
  const onValueChange = vi.fn();
  render(
    <CheckboxGroup
      aria-label="options"
      defaultValue={[]}
      onValueChange={onValueChange}
    >
      <Checkbox value="a">Option A</Checkbox>
      <Checkbox value="b">Option B</Checkbox>
    </CheckboxGroup>
  );

  fireEvent.click(screen.getByRole("checkbox", { name: "Option A" }));
  expect(onValueChange).toHaveBeenCalledWith(["a"]);
});
