import { Button, ButtonGroup } from '@srcube-ui/react';
import { Selectbox } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/selectbox')({
  component: SelectboxDemo,
});

type SelectboxColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
type SelectboxSize = 'sm' | 'md' | 'lg';
type SelectionMode = 'single' | 'multiple';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function formatValue(value: Array<string | number>) {
  if (!Array.isArray(value) || value.length <= 0) {
    return 'none';
  }

  return value.map((item) => String(item)).join(' / ');
}

function SelectboxDemo() {
  const [color, setColor] = useState<SelectboxColor>('default');
  const [size, setSize] = useState<SelectboxSize>('md');
  const [mode, setMode] = useState<SelectionMode>('multiple');
  const [selectIcon, setSelectIcon] = useState(true);
  const [value, setValue] = useState<Array<string | number>>(['design', 'develop']);
  const [horizontalValue, setHorizontalValue] = useState<Array<string | number>>(['phase-2']);

  const items = useMemo(
    () => [
      { id: 'planning', label: '需求规划', isSticky: true },
      { id: 'discover', label: '需求调研' },
      { id: 'design', label: '设计方案' },
      { id: 'develop', label: '组件开发' },
      { id: 'test', label: '联调测试' },
      { id: 'release', label: '上线发布' },
      { id: 'ops', label: '运维观察', isDisabled: true },
      { id: 'feedback', label: '反馈闭环' },
    ],
    [],
  );

  const horizontalItems = useMemo(
    () => [
      { id: 'phase', label: '阶段', isSticky: true },
      { id: 'phase-1', label: '第一阶段' },
      { id: 'phase-2', label: '第二阶段' },
      { id: 'phase-3', label: '第三阶段' },
      { id: 'phase-4', label: '第四阶段' },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Selectbox" />
      <div className="px-4 pb-8">
        <Section title="Controls" description="color + size + selectionMode + selectIcon">
          <div className="space-y-2">
            <ButtonGroup size="sm" isBlock>
              {(['default', 'primary', 'secondary'] as const).map((option) => (
                <Button
                  key={option}
                  color={color === option ? option : 'default'}
                  variant={color === option ? 'solid' : 'flat'}
                  onTap={() => {
                    setColor(option);
                  }}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" isBlock>
              {(['success', 'warning', 'danger'] as const).map((option) => (
                <Button
                  key={option}
                  color={color === option ? option : 'default'}
                  variant={color === option ? 'solid' : 'flat'}
                  onTap={() => {
                    setColor(option);
                  }}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" isBlock>
              {(['sm', 'md', 'lg'] as const).map((option) => (
                <Button
                  key={option}
                  color={size === option ? 'primary' : 'default'}
                  variant={size === option ? 'solid' : 'flat'}
                  onTap={() => {
                    setSize(option);
                  }}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" isBlock>
              {(['multiple', 'single'] as const).map((option) => (
                <Button
                  key={option}
                  color={mode === option ? 'primary' : 'default'}
                  variant={mode === option ? 'solid' : 'flat'}
                  onTap={() => {
                    setMode(option);
                  }}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" isBlock>
              <Button
                color={selectIcon ? 'primary' : 'default'}
                variant={selectIcon ? 'solid' : 'flat'}
                onTap={() => {
                  setSelectIcon(true);
                }}
              >
                icon-on
              </Button>
              <Button
                color={!selectIcon ? 'primary' : 'default'}
                variant={!selectIcon ? 'solid' : 'flat'}
                onTap={() => {
                  setSelectIcon(false);
                }}
              >
                icon-off
              </Button>
            </ButtonGroup>
          </div>
        </Section>

        <Section
          title="Vertical"
          description="基于 Listbox，size 同步行高/文字/选中块，支持 selectIcon"
        >
          <Selectbox
            className="h-80 rounded-2xl border border-slate-200"
            color={color}
            size={size}
            selectionMode={mode}
            selectIcon={selectIcon}
            items={items}
            value={value}
            hasDivider
            onValueChange={setValue}
          />
          <div className="mt-3 text-xs text-slate-500">Value: {formatValue(value)}</div>
        </Section>

        <Section title="Horizontal" description="orientation=x + single">
          <Selectbox
            className="h-24 rounded-2xl border border-slate-200"
            orientation="x"
            color={color}
            size={size}
            selectionMode="single"
            selectIcon={selectIcon}
            items={horizontalItems}
            value={horizontalValue}
            estimateSize={120}
            onValueChange={setHorizontalValue}
          />
          <div className="mt-3 text-xs text-slate-500">
            Value: {formatValue(horizontalValue)}
          </div>
        </Section>

        <Section title="Empty" description="locale=zh-CN">
          <Selectbox
            className="h-32 rounded-2xl border border-slate-200"
            size={size}
            selectIcon={selectIcon}
            items={[]}
            locale="zh-CN"
          />
        </Section>
      </div>
    </main>
  );
}
