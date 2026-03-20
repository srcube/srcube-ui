import { Button, Checkbox, CheckboxGroup } from "@srcube-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import PageHeader from "@/components/page-header";

export const Route = createFileRoute("/checkbox")({
  component: CheckboxDemo,
});

type DemoItem = {
  label: string;
  value: string;
};

function Section({
  title,
  description,
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: "default" | "dark";
  children: React.ReactNode;
}) {
  const isDark = tone === "dark";

  return (
    <section
      className={[
        "mt-6 rounded-2xl p-4 shadow-sm transition-colors duration-200",
        isDark ? "bg-zinc-900 shadow-black/20" : "bg-white",
      ].join(" ")}
    >
      <div
        className={
          isDark
            ? "text-sm font-semibold text-zinc-50"
            : "text-sm font-semibold text-slate-900"
        }
      >
        {title}
      </div>
      {description ? (
        <div
          className={
            isDark
              ? "mt-1 text-xs text-zinc-400"
              : "mt-1 text-xs text-slate-500"
          }
        >
          {description}
        </div>
      ) : null}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function CheckboxDemo() {
  const colors = useMemo<DemoItem[]>(
    () => [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Danger", value: "danger" },
    ],
    []
  );

  const sizes = useMemo<DemoItem[]>(
    () => [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
    []
  );

  const radii = useMemo<DemoItem[]>(
    () => [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "Full", value: "full" },
    ],
    []
  );

  const [tone, setTone] = useState<"default" | "dark">("default");
  const [colorValue, setColorValue] = useState<string[]>(["primary"]);
  const [sizeValue, setSizeValue] = useState<string[]>(["md"]);
  const [radiusValue, setRadiusValue] = useState<string[]>(["md"]);
  const [groupValue, setGroupValue] = useState<string[]>(["left"]);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Checkbox" />
      <div className="px-4 pb-8">
        <Section title="Tone" tone="default">
          <div className="flex gap-2">
            <Button
              size="sm"
              color={tone === "default" ? "primary" : "default"}
              variant={tone === "default" ? "solid" : "flat"}
              onTap={() => setTone("default")}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === "dark" ? "solid" : "flat"}
              onTap={() => setTone("dark")}
            >
              dark
            </Button>
          </div>
        </Section>

        <Section title="Colors" description="color + group" tone={tone}>
          <CheckboxGroup
            value={colorValue}
            onValueChange={setColorValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            {colors.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                color={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section title="Sizes" description="size + group" tone={tone}>
          <CheckboxGroup
            value={sizeValue}
            onValueChange={setSizeValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            {sizes.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                size={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section title="Radius" description="radius + group" tone={tone}>
          <CheckboxGroup
            value={radiusValue}
            onValueChange={setRadiusValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            {radii.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                radius={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section
          title="Custom Icon"
          description="Iconify className"
          tone={tone}
        >
          <div className="flex flex-wrap gap-4">
            <Checkbox
              tone={tone}
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--checkmark]`} />
              )}
            >
              Check
            </Checkbox>
            <Checkbox
              tone={tone}
              isIndeterminate
              icon={({ className }) => (
                <span className={`${className} icon-[ion--remove]`} />
              )}
            >
              Indeterminate
            </Checkbox>
          </div>
        </Section>

        <Section title="States" tone={tone}>
          <div className="flex flex-wrap gap-4">
            <Checkbox tone={tone} defaultSelected>
              Normal
            </Checkbox>
            <Checkbox tone={tone} isDisabled>
              Disabled
            </Checkbox>
            <Checkbox tone={tone} isLoading>
              Loading
            </Checkbox>
            <Checkbox
              tone={tone}
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Checkbox>
            <Checkbox tone={tone} isIndeterminate>
              Mixed
            </Checkbox>
            <Checkbox tone={tone} defaultSelected isLineThrough>
              Line Through
            </Checkbox>
          </div>
        </Section>

        <Section title="Group" description="orientation + isBlock" tone={tone}>
          <CheckboxGroup
            value={groupValue}
            onValueChange={setGroupValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            <Checkbox value="left">Left</Checkbox>
            <Checkbox value="middle">Middle</Checkbox>
            <Checkbox value="right">Right</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup defaultValue={["a"]} orientation="x" tone={tone}>
            <Checkbox value="a">Option A</Checkbox>
            <Checkbox value="b">Option B</Checkbox>
          </CheckboxGroup>
        </Section>
      </div>
    </main>
  );
}
