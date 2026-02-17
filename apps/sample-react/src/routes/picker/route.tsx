import { Button, ButtonGroup } from '@srcube-ui/button';
import {
  DatePicker,
  DateRangePicker,
  Picker,
  PickerDatetime,
  PickerDatetimeRange,
  TimePicker,
} from '@srcube-ui/picker';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/picker')({
  component: PickerDemo,
});

type PickerType = 'default' | 'calendar';
type PickerDatetimeMode = 'datetime' | 'date' | 'time';

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
  const [singleValue, setSingleValue] = useState<Array<string | number | null>>([
    'cq',
  ]);
  const [multiValue, setMultiValue] = useState<Array<string | number | null>>([
    'fruit',
    'apple',
  ]);
  const [dateValue, setDateValue] = useState<string | null>('2026-02-13');
  const [timeValue, setTimeValue] = useState<string | null>('09:30:00');
  const [dateRangeValue, setDateRangeValue] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: '2026-02-13',
    end: '2026-02-18',
  });
  const [datetimeMode, setDatetimeMode] = useState<PickerDatetimeMode>('datetime');
  const [datetimeValue, setDatetimeValue] = useState<string | null>(
    '2026-02-13 09:30:00',
  );
  const [datetimeRangeValue, setDatetimeRangeValue] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: '2026-02-13 09:30:00',
    end: '2026-02-18 18:30:00',
  });

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

  const datetimeFormat = useMemo(() => {
    if (datetimeMode === 'date') {
      return 'YYYY/MM/DD';
    }
    if (datetimeMode === 'time') {
      return 'HH:mm';
    }
    return 'YYYY-MM-DD HH:mm:ss';
  }, [datetimeMode]);

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

        <Section title="Datetime Mode" description="datetime / date / time">
          <ButtonGroup size="sm" isBlock>
            <Button
              color={datetimeMode === 'datetime' ? 'primary' : 'default'}
              variant={datetimeMode === 'datetime' ? 'solid' : 'flat'}
              onTap={() => {
                setDatetimeMode('datetime');
              }}
            >
              datetime
            </Button>
            <Button
              color={datetimeMode === 'date' ? 'primary' : 'default'}
              variant={datetimeMode === 'date' ? 'solid' : 'flat'}
              onTap={() => {
                setDatetimeMode('date');
              }}
            >
              date
            </Button>
            <Button
              color={datetimeMode === 'time' ? 'primary' : 'default'}
              variant={datetimeMode === 'time' ? 'solid' : 'flat'}
              onTap={() => {
                setDatetimeMode('time');
              }}
            >
              time
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
            color="primary"
            items={singleItems}
            value={singleValue}
            onValueChange={setSingleValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {singleValue[0] ?? 'none'}
          </div>
        </Section>

        <Section title="Multiple" description="多列选择 + 同步 Confirm 按钮色值/尺寸">
          <Picker
            label="商品偏好"
            type={pickerType}
            color="secondary"
            size="sm"
            columns={multiColumns}
            value={multiValue}
            onValueChange={setMultiValue}
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

        <Section title="TimePicker" description="与 DatePicker 一致，改为时/分/秒数据源">
          <TimePicker
            label="时间"
            type={pickerType}
            color="warning"
            value={timeValue}
            onValueChange={setTimeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {timeValue ?? 'none'}
          </div>
        </Section>

        <Section
          title="DateRangePicker"
          description="Drawer body 内使用 Tabs 切换 start/end，对应 Pickbox 选中态联动"
        >
          <DateRangePicker
            label="日期区间"
            type={pickerType}
            color="primary"
            value={dateRangeValue}
            onValueChange={setDateRangeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {`${dateRangeValue.start} ~ ${dateRangeValue.end}`}
          </div>
        </Section>

        <Section
          title="PickerDatetime"
          description="mode + format；mode=datetime 时展示全宽 Date/Time Tab"
        >
          <PickerDatetime
            label="日期时间"
            type={pickerType}
            color="success"
            size="sm"
            mode={datetimeMode}
            format={datetimeFormat}
            value={datetimeValue}
            onValueChange={setDatetimeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {datetimeValue ?? 'none'}
          </div>
        </Section>

        <Section
          title="PickerDatetimeRange"
          description="start/end + date/time 双层全宽 Tab，支持 format"
        >
          <PickerDatetimeRange
            label="日期时间区间"
            type={pickerType}
            color="primary"
            size="sm"
            mode={datetimeMode}
            format={datetimeFormat}
            value={datetimeRangeValue}
            onValueChange={setDatetimeRangeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {`${datetimeRangeValue.start || '--'} ~ ${datetimeRangeValue.end || '--'}`}
          </div>
        </Section>
      </div>
    </main>
  );
}
