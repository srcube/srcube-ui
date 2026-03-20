import { Button, ButtonGroup, TabPanel, Tabs } from "@srcube-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useMemo, useState } from "react";
import PageHeader from "@/components/page-header";

export const Route = createFileRoute("/tabs")({
  component: TabsDemo,
});

type DemoTabValue = string;

type DemoTabItem = {
  value: DemoTabValue;
  label: string;
  isDisabled?: boolean;
};

const tabsColorGroups = [
  [
    { label: "default", value: "default" },
    { label: "primary", value: "primary" },
    { label: "success", value: "success" },
  ],
  [
    { label: "secondary", value: "secondary" },
    { label: "warning", value: "warning" },
    { label: "danger", value: "danger" },
  ],
] as const;

type TabsColor = (typeof tabsColorGroups)[number][number]["value"];
type TabsVariant = "default" | "outline" | "twotone" | "underline";
type TabsPlacement = "top" | "start" | "end" | "bottom";
type TabsTone = "default" | "dark";

function Section({
  title,
  description,
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: TabsTone;
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
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TabsDemo() {
  const basicItems = useMemo<DemoTabItem[]>(
    () => [
      { value: "tab-1", label: "Tab 1" },
      { value: "tab-2", label: "Tab 2" },
      { value: "tab-3", label: "Tab 3" },
    ],
    []
  );

  const verticalItems = useMemo<DemoTabItem[]>(
    () => [
      { value: "tab-a", label: "Tab A" },
      { value: "tab-b", label: "Tab B" },
      { value: "tab-c", label: "Tab C", isDisabled: true },
    ],
    []
  );

  const colorItems = basicItems;
  const customPanelItems = basicItems;
  const longItems = useMemo<DemoTabItem[]>(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        value: `long-${index + 1}`,
        label: `Tab ${index + 1}`,
      })),
    []
  );

  const [tone, setTone] = useState<TabsTone>("default");
  const [basicValue, setBasicValue] = useState<DemoTabValue>("tab-1");
  const [verticalValue, setVerticalValue] = useState<DemoTabValue>("tab-a");
  const [placementValue, setPlacementValue] = useState<TabsPlacement>("start");
  const [activeColor, setActiveColor] = useState<TabsColor>("default");
  const [activeVariant, setActiveVariant] = useState<TabsVariant>("default");
  const [colorValue, setColorValue] = useState<DemoTabValue>("tab-1");
  const [customValue, setCustomValue] = useState<DemoTabValue>("tab-1");
  const [longValue, setLongValue] = useState<DemoTabValue>("long-1");

  const buttonTone = tone === "dark" ? "dark" : "light";
  const panelClassName =
    tone === "dark"
      ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100"
      : "rounded-2xl border border-slate-200 bg-white p-4";
  const verticalPanelClassName =
    tone === "dark"
      ? "h-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-100"
      : "h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm";
  const externalPanelClassName =
    tone === "dark"
      ? "mt-3 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-300"
      : "mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600";
  const metaTextClassName =
    tone === "dark"
      ? "mt-2 text-xs text-zinc-400"
      : "mt-2 text-xs text-slate-500";

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Tabs" />
      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
          <div className="flex gap-2">
            <Button
              size="sm"
              tone={buttonTone}
              color={tone === "default" ? "primary" : "default"}
              variant={tone === "default" ? "solid" : "flat"}
              onTap={() => {
                setTone("default");
              }}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === "dark" ? "solid" : "flat"}
              onTap={() => {
                setTone("dark");
              }}
            >
              dark
            </Button>
          </div>
        </Section>

        <Section
          title="Basic"
          tone={tone}
          description="horizontal + panel (size=md radius=full)"
        >
          <Tabs
            items={basicItems}
            value={basicValue}
            tone={tone}
            size="md"
            radius="full"
            onValueChange={(next: string | number) => {
              setBasicValue(next as DemoTabValue);
            }}
          >
            <TabPanel value="tab-1" className={panelClassName}>
              Panel for Tab 1
            </TabPanel>
            <TabPanel value="tab-2" className={panelClassName}>
              Panel for Tab 2
            </TabPanel>
            <TabPanel value="tab-3" className={panelClassName}>
              Panel for Tab 3
            </TabPanel>
          </Tabs>
        </Section>

        <Section
          title="Vertical"
          tone={tone}
          description="placement=top/start/end/bottom + variant=underline"
        >
          <ButtonGroup size="sm" isBlock>
            <Button
              tone={buttonTone}
              color={placementValue === "top" ? "primary" : "default"}
              variant={placementValue === "top" ? "solid" : "flat"}
              onTap={() => {
                setPlacementValue("top");
              }}
            >
              top
            </Button>
            <Button
              tone={buttonTone}
              color={placementValue === "start" ? "primary" : "default"}
              variant={placementValue === "start" ? "solid" : "flat"}
              onTap={() => {
                setPlacementValue("start");
              }}
            >
              start
            </Button>
            <Button
              tone={buttonTone}
              color={placementValue === "end" ? "primary" : "default"}
              variant={placementValue === "end" ? "solid" : "flat"}
              onTap={() => {
                setPlacementValue("end");
              }}
            >
              end
            </Button>
            <Button
              tone={buttonTone}
              color={placementValue === "bottom" ? "primary" : "default"}
              variant={placementValue === "bottom" ? "solid" : "flat"}
              onTap={() => {
                setPlacementValue("bottom");
              }}
            >
              bottom
            </Button>
          </ButtonGroup>

          <Tabs
            className="mt-3 h-44"
            items={verticalItems}
            value={verticalValue}
            tone={tone}
            placement={placementValue}
            variant="underline"
            color="primary"
            size="sm"
            radius="none"
            onValueChange={(next: string | number) => {
              setVerticalValue(next as DemoTabValue);
            }}
          >
            <TabPanel value="tab-a" className={verticalPanelClassName}>
              Panel for Tab A
            </TabPanel>
            <TabPanel value="tab-b" className={verticalPanelClassName}>
              Panel for Tab B
            </TabPanel>
            <TabPanel value="tab-c" className={verticalPanelClassName}>
              Panel for Tab C (disabled tab)
            </TabPanel>
          </Tabs>
        </Section>

        <Section
          title="Variant / Color"
          tone={tone}
          description="default / outline / twotone / underline"
        >
          <ButtonGroup size="sm" isBlock>
            <Button
              tone={buttonTone}
              color={activeVariant === "default" ? "primary" : "default"}
              variant={activeVariant === "default" ? "solid" : "flat"}
              onTap={() => {
                setActiveVariant("default");
              }}
            >
              default
            </Button>
            <Button
              tone={buttonTone}
              color={activeVariant === "outline" ? "primary" : "default"}
              variant={activeVariant === "outline" ? "solid" : "flat"}
              onTap={() => {
                setActiveVariant("outline");
              }}
            >
              outline
            </Button>
            <Button
              tone={buttonTone}
              color={activeVariant === "twotone" ? "primary" : "default"}
              variant={activeVariant === "twotone" ? "solid" : "flat"}
              onTap={() => {
                setActiveVariant("twotone");
              }}
            >
              twotone
            </Button>
            <Button
              tone={buttonTone}
              color={activeVariant === "underline" ? "primary" : "default"}
              variant={activeVariant === "underline" ? "solid" : "flat"}
              onTap={() => {
                setActiveVariant("underline");
              }}
            >
              underline
            </Button>
          </ButtonGroup>

          <div className="w-full">
            <div className="mt-2 flex flex-col gap-2">
              {tabsColorGroups.map((group, groupIndex) => (
                <ButtonGroup
                  key={`tabs-color-group-${groupIndex}`}
                  size="sm"
                  isBlock
                >
                  {group.map((item) => (
                    <Button
                      key={item.value}
                      tone={buttonTone}
                      color={
                        activeColor === item.value ? item.value : "default"
                      }
                      variant={activeColor === item.value ? "solid" : "flat"}
                      onTap={() => {
                        setActiveColor(item.value);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </ButtonGroup>
              ))}
            </div>

            <Tabs
              className="mt-3"
              items={colorItems}
              value={colorValue}
              tone={tone}
              color={activeColor}
              variant={activeVariant}
              onValueChange={(next: string | number) => {
                setColorValue(next as DemoTabValue);
              }}
            />

            <div className={metaTextClassName}>
              Variant: {activeVariant} / Color: {activeColor} / Selected:{" "}
              {colorValue}
            </div>
          </div>
        </Section>

        <Section
          title="Tabs Only"
          tone={tone}
          description="external custom panel (e.g. swiper / business container)"
        >
          <Tabs
            items={customPanelItems}
            value={customValue}
            tone={tone}
            onValueChange={(next: string | number) => {
              setCustomValue(next as DemoTabValue);
            }}
          />

          <div className={externalPanelClassName}>
            {customValue === "tab-1"
              ? "External Panel: Tab 1"
              : customValue === "tab-2"
              ? "External Panel: Tab 2"
              : "External Panel: Tab 3"}
          </div>
        </Section>

        <Section
          title="Long List"
          tone={tone}
          description="virtualized tabs + edge tap auto shift"
        >
          <Tabs
            className="w-full"
            items={longItems}
            value={longValue}
            tone={tone}
            radius="full"
            estimateSize={88}
            onValueChange={(next: string | number) => {
              setLongValue(String(next));
            }}
          />

          <div className={metaTextClassName}>Selected: {longValue}</div>
        </Section>
      </div>
    </main>
  );
}
