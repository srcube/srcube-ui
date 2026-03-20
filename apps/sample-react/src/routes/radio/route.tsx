import { Button, Radio, RadioGroup } from "@srcube-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import PageHeader from "@/components/page-header";

export const Route = createFileRoute("/radio")({
  component: RadioDemo,
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

function RadioDemo() {
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

  const [tone, setTone] = useState<"default" | "dark">("default");
  const [colorValue, setColorValue] = useState("primary");
  const [sizeValue, setSizeValue] = useState("md");
  const [groupValue, setGroupValue] = useState("left");

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Radio" />
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
          <RadioGroup
            value={colorValue}
            onValueChange={setColorValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            {colors.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                color={item.value as never}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </Section>

        <Section title="Sizes" description="size + group" tone={tone}>
          <RadioGroup
            value={sizeValue}
            onValueChange={setSizeValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            {sizes.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                size={item.value as never}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </Section>

        <Section
          title="Custom Icon"
          description="Iconify className"
          tone={tone}
        >
          <div className="flex flex-wrap gap-4">
            <Radio
              tone={tone}
              value="custom"
              defaultSelected
              icon={({ isSelected, className }) => (
                <span
                  className={`${className} ${
                    isSelected
                      ? "icon-[ion--checkmark]"
                      : "icon-[ion--ellipse-outline]"
                  }`}
                />
              )}
            >
              Check
            </Radio>
            <Radio
              tone={tone}
              value="custom-2"
              icon={({ className }) => (
                <span className={`${className} icon-[ion--chevron-back]`} />
              )}
            >
              Chevron
            </Radio>
          </div>
        </Section>

        <Section title="States" tone={tone}>
          <div className="flex flex-wrap gap-4">
            <Radio tone={tone} defaultSelected>
              Normal
            </Radio>
            <Radio tone={tone} isDisabled>
              Disabled
            </Radio>
            <Radio tone={tone} isLoading>
              Loading
            </Radio>
            <Radio
              tone={tone}
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Radio>
          </div>
        </Section>

        <Section title="Group" description="orientation + isBlock" tone={tone}>
          <RadioGroup
            value={groupValue}
            onValueChange={setGroupValue}
            orientation="y"
            isBlock
            tone={tone}
          >
            <Radio value="left">Left</Radio>
            <Radio value="middle">Middle</Radio>
            <Radio value="right">Right</Radio>
          </RadioGroup>
          <RadioGroup orientation="x" defaultValue="a" tone={tone}>
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
          </RadioGroup>
        </Section>
      </div>
    </main>
  );
}
