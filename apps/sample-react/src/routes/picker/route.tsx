import { Button, ButtonGroup } from '@srcube-ui/button';
import { DatePicker, Picker } from '@srcube-ui/picker';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/picker')({
  component: PickerDemo,
});

type PickerType = 'default' | 'calendar';

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
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PickerDemo() {
  const [pickerType, setPickerType] = useState<PickerType>('default');
  const [singleValue, setSingleValue] = useState<string | number | null>('cq');
  const [multiValue, setMultiValue] = useState<Array<string | number | null>>([
    'fruit',
    'apple',
  ]);
  const [dateValue, setDateValue] = useState<string | null>('2026-02-13');

  const singleItems = useMemo(
    () => [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
      { id: 'sz', label: '深圳' },
    ],
    [],
  );

  const multiColumns = useMemo(
    () => [
      {
        id: 'category',
        items: [
          { id: 'fruit', label: '水果' },
          { id: 'drink', label: '饮品' },
          { id: 'snack', label: '零食' },
        ],
      },
      {
        id: 'name',
        items: [
          { id: 'apple', label: '苹果' },
          { id: 'banana', label: '香蕉' },
          { id: 'orange', label: '橙子' },
        ],
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Picker" />
      <div className="px-4 pb-8">
        <Section title="Type" description="default / calendar（当前均使用 pickbox）">
          <ButtonGroup size="sm" isBlock>
            <Button
              color={pickerType === 'default' ? 'primary' : 'default'}
              variant={pickerType === 'default' ? 'solid' : 'flat'}
              onTap={() => {
                setPickerType('default');
              }}
            >
              default
            </Button>
            <Button
              color={pickerType === 'calendar' ? 'primary' : 'default'}
              variant={pickerType === 'calendar' ? 'solid' : 'flat'}
              onTap={() => {
                setPickerType('calendar');
              }}
            >
              calendar
            </Button>
          </ButtonGroup>
        </Section>

        <Section
          title="Single"
          description="Field + Drawer(bottom) + Pickbox，dismiss=取消"
        >
          <Picker
            label="城市"
            type={pickerType}
            mode="single"
            color="primary"
            items={singleItems}
            value={singleValue}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                return;
              }
              setSingleValue(nextValue);
            }}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {singleValue ?? 'none'}
          </div>
        </Section>

        <Section title="Multiple" description="多列选择 + 同步 Confirm 按钮色值/尺寸">
          <Picker
            label="商品偏好"
            type={pickerType}
            mode="multiple"
            color="secondary"
            size="sm"
            columns={multiColumns}
            value={multiValue}
            onValueChange={(nextValue) => {
              if (!Array.isArray(nextValue)) {
                return;
              }
              setMultiValue(nextValue);
            }}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {multiValue.filter((item) => item != null).join(' / ')}
          </div>
        </Section>

        <Section title="DatePicker" description="1900~2099 单选日期">
          <DatePicker
            label="日期"
            type={pickerType}
            color="success"
            value={dateValue}
            onValueChange={setDateValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {dateValue ?? 'none'}
          </div>
        </Section>
      </div>
    </main>
  );
}
