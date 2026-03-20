import { Button, Switch } from "@srcube-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import PageHeader from "@/components/page-header";

export const Route = createFileRoute("/switch")({
  component: SwitchDemo,
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

function SwitchDemo() {
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
  const [selectedColor, setSelectedColor] = useState("primary");
  const [selectedSize, setSelectedSize] = useState("md");
  const [isEnabled, setEnabled] = useState(true);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Switch" />
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

        <Section title="Colors" description="color + controlled" tone={tone}>
          <div className="flex flex-col gap-3">
            {colors.map((item) => (
              <Switch
                key={item.value}
                tone={tone}
                color={item.value as never}
                isSelected={selectedColor === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedColor(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </Section>

        <Section title="Sizes" description="size + controlled" tone={tone}>
          <div className="flex flex-col gap-3">
            {sizes.map((item) => (
              <Switch
                key={item.value}
                tone={tone}
                size={item.value as never}
                isSelected={selectedSize === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedSize(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </Section>

        <Section
          title="Custom Icon"
          description="Iconify className"
          tone={tone}
        >
          <div className="flex flex-wrap gap-4">
            <Switch
              tone={tone}
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--checkmark]`} />
              )}
            >
              Check
            </Switch>
            <Switch
              tone={tone}
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--flash]`} />
              )}
            >
              Flash
            </Switch>
          </div>
        </Section>

        <Section title="States" tone={tone}>
          <div className="flex flex-col gap-3">
            <Switch
              tone={tone}
              isSelected={isEnabled}
              onValueChange={setEnabled}
            >
              Controlled
            </Switch>
            <Switch tone={tone} isDisabled>
              Disabled
            </Switch>
            <Switch tone={tone} isReadOnly defaultSelected>
              ReadOnly
            </Switch>
            <Switch tone={tone} isLoading>
              Loading
            </Switch>
            <Switch
              tone={tone}
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Switch>
          </div>
        </Section>
      </div>
    </main>
  );
}
