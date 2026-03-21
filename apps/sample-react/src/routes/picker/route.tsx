import {
  Button,
  ButtonGroup,
  Picker,
  PickerDatetime,
  PickerDatetimeRange,
  PickerSelect,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/picker')({
  component: PickerDemo,
});

type PickerSize = 'sm' | 'md' | 'lg';
type PickerColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
type PickerDatetimeMode = 'datetime' | 'date' | 'time';

const pickerColorGroups: PickerColor[][] = [
  ['default', 'primary', 'secondary'],
  ['success', 'warning', 'danger'],
];

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
  const [pickerSize, setPickerSize] = useState<PickerSize>('md');
  const [pickerColor, setPickerColor] = useState<PickerColor>('primary');
  const [singleValue, setSingleValue] = useState<Array<string | number | null>>(
    [],
  );
  const [clearableValue, setClearableValue] = useState<
    Array<string | number | null>
  >([]);
  const [cascadeValue, setCascadeValue] = useState<
    Array<string | number | null>
  >([]);
  const [selectValue, setSelectValue] = useState<Array<string | number>>([]);
  const [datetimeMode, setDatetimeMode] =
    useState<PickerDatetimeMode>('datetime');
  const [datetimeValue, setDatetimeValue] = useState<string | null>(null);
  const [datetimeRangeValue, setDatetimeRangeValue] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
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

  const cascadeOptions = useMemo(
    () => [
      {
        id: 'fruit',
        label: '水果',
        children: [
          {
            id: 'citrus',
            label: '柑橘类',
            children: [
              { id: 'orange', label: '橙子' },
              { id: 'grapefruit', label: '西柚' },
            ],
          },
          {
            id: 'berry',
            label: '莓果类',
            children: [
              { id: 'strawberry', label: '草莓' },
              { id: 'blueberry', label: '蓝莓' },
            ],
          },
        ],
      },
      {
        id: 'drink',
        label: '饮品',
        children: [
          {
            id: 'tea',
            label: '茶饮',
            children: [
              { id: 'green-tea', label: '绿茶' },
              { id: 'oolong-tea', label: '乌龙茶' },
            ],
          },
          {
            id: 'coffee',
            label: '咖啡',
            children: [
              { id: 'latte', label: '拿铁' },
              { id: 'americano', label: '美式' },
            ],
          },
        ],
      },
      {
        id: 'snack',
        label: '零食',
        children: [
          {
            id: 'chips',
            label: '薯片',
            children: [
              { id: 'potato-chips', label: '土豆片' },
              { id: 'tortilla-chips', label: '玉米片' },
            ],
          },
          {
            id: 'nuts',
            label: '坚果',
            children: [
              { id: 'almond', label: '杏仁' },
              { id: 'cashew', label: '腰果' },
            ],
          },
        ],
      },
    ],
    [],
  );

  const selectItems = useMemo(
    () => [
      { id: 'discover', label: '需求调研' },
      { id: 'design', label: '设计方案' },
      { id: 'develop', label: '组件开发' },
      { id: 'test', label: '联调测试' },
      { id: 'release', label: '上线发布' },
      { id: 'monitor', label: '监控告警' },
      { id: 'retrospective', label: '复盘总结' },
      { id: 'a11y', label: '无障碍巡检' },
      { id: 'i18n', label: '多语言校对' },
      { id: 'token', label: '设计令牌同步' },
      { id: 'perf', label: '性能优化' },
      { id: 'security', label: '安全审计' },
      { id: 'docs', label: '文档补全' },
      { id: 'qa', label: '灰度验收' },
      { id: 'oncall', label: '值班处理' },
      { id: 'ops', label: '运维观察', isDisabled: true },
      { id: 'support', label: '客户支持' },
      { id: 'feedback', label: '反馈闭环' },
      { id: 'archive', label: '归档沉淀' },
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
        <Section
          title="Size"
          description="同步到 Drawer title、Pickbox/Selectbox 与 footer button"
        >
          <ButtonGroup size="sm" isBlock>
            <Button
              color={pickerSize === 'sm' ? 'primary' : 'default'}
              variant={pickerSize === 'sm' ? 'solid' : 'flat'}
              onTap={() => {
                setPickerSize('sm');
              }}
            >
              sm
            </Button>
            <Button
              color={pickerSize === 'md' ? 'primary' : 'default'}
              variant={pickerSize === 'md' ? 'solid' : 'flat'}
              onTap={() => {
                setPickerSize('md');
              }}
            >
              md
            </Button>
            <Button
              color={pickerSize === 'lg' ? 'primary' : 'default'}
              variant={pickerSize === 'lg' ? 'solid' : 'flat'}
              onTap={() => {
                setPickerSize('lg');
              }}
            >
              lg
            </Button>
          </ButtonGroup>
        </Section>

        <Section
          title="Color"
          description="同步到 Field / Pickbox / Selectbox / Confirm"
        >
          <div className="space-y-2">
            {pickerColorGroups.map((group) => (
              <ButtonGroup key={group.join('-')} size="sm" isBlock>
                {group.map((color) => (
                  <Button
                    key={color}
                    color={pickerColor === color ? color : 'default'}
                    variant={pickerColor === color ? 'solid' : 'flat'}
                    onTap={() => {
                      setPickerColor(color);
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </ButtonGroup>
            ))}
          </div>
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
            size={pickerSize}
            color={pickerColor}
            items={singleItems}
            onValueChange={setSingleValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {singleValue[0] ?? 'none'}
          </div>
        </Section>

        <Section
          title="Clearable"
          description="基础 Picker 支持 isClearable，选中后可一键清空"
        >
          <Picker
            label="可清空城市"
            size={pickerSize}
            color={pickerColor}
            items={singleItems}
            value={clearableValue}
            isClearable
            onValueChange={setClearableValue}
            onClear={() => {
              setClearableValue([]);
            }}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {clearableValue[0] ?? 'none'}
          </div>
        </Section>

        <Section
          title="Cascader Columns"
          description="使用 options 构建级联多列（替代原 multiple 示例）"
        >
          <Picker
            label="商品偏好"
            color={pickerColor}
            size={pickerSize}
            options={cascadeOptions}
            value={cascadeValue}
            onValueChange={setCascadeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {cascadeValue.filter((item) => item != null).join(' / ') || 'none'}
          </div>
        </Section>

        <Section
          title="PickerSelect"
          description="多选场景使用 PickerSelect（内部为 Selectbox）"
        >
          <PickerSelect
            label="里程碑"
            color={pickerColor}
            size={pickerSize}
            items={selectItems}
            value={selectValue}
            selectionMode="multiple"
            onValueChange={setSelectValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {selectValue.join(' / ') || 'none'}
          </div>
        </Section>

        <Section
          title="PickerDatetime"
          description="mode + format；mode=datetime 时展示全宽 Date/Time Tab"
        >
          <PickerDatetime
            label="日期时间"
            color={pickerColor}
            size={pickerSize}
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
            color={pickerColor}
            size={pickerSize}
            mode={datetimeMode}
            format={datetimeFormat}
            value={datetimeRangeValue}
            onValueChange={setDatetimeRangeValue}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value:{' '}
            {`${datetimeRangeValue.start || '--'} ~ ${datetimeRangeValue.end || '--'}`}
          </div>
        </Section>

        <Section
          title="Default Value"
          description="单独展示 defaultValue；其它示例均从空值开始"
        >
          <div className="space-y-4">
            <Picker
              label="默认城市"
              color={pickerColor}
              size={pickerSize}
              items={singleItems}
              defaultValue={['cd']}
            />
            <Picker
              label="默认商品偏好"
              color={pickerColor}
              size={pickerSize}
              options={cascadeOptions}
              defaultValue={['fruit', 'citrus', 'orange']}
            />
            <PickerSelect
              label="默认里程碑"
              color={pickerColor}
              size={pickerSize}
              items={selectItems}
              selectionMode="multiple"
              defaultValue={['design', 'develop']}
            />
            <PickerDatetime
              label="默认日期时间"
              color={pickerColor}
              size={pickerSize}
              mode={datetimeMode}
              format={datetimeFormat}
              defaultValue="2026-02-13 09:30:00"
            />
            <PickerDatetimeRange
              label="默认日期时间区间"
              color={pickerColor}
              size={pickerSize}
              mode={datetimeMode}
              format={datetimeFormat}
              defaultValue={{
                start: '2026-02-13 09:30:00',
                end: '2026-02-18 18:30:00',
              }}
            />
          </div>
        </Section>
      </div>
    </main>
  );
}
