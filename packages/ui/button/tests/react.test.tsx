import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Button, ButtonGroup } from "../src/react";

it("calls onTap when enabled", () => {
  const onTap = vi.fn();
  render(<Button onTap={onTap}>Tap me</Button>);

  fireEvent.click(screen.getByRole("button"));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it("does not call onTap when disabled", () => {
  const onTap = vi.fn();
  render(
    <Button isDisabled onTap={onTap}>
      Disabled
    </Button>,
  );

  fireEvent.click(screen.getByRole("button"));
  expect(onTap).not.toHaveBeenCalled();
});

it("applies group position styles", () => {
  render(
    <ButtonGroup>
      <Button>First</Button>
      <Button>Last</Button>
    </ButtonGroup>,
  );

  const [first, last] = screen.getAllByRole("button");
  expect(first.className).toContain("rounded-r-none");
  expect(last.className).toContain("rounded-l-none");
});
