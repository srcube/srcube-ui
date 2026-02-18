import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Cascader } from '../src/react';

void React;

const options = [
  {
    id: 'zj',
    label: '浙江',
    children: [
      {
        id: 'hz',
        label: '杭州',
        children: [
          { id: 'xh', label: '西湖区' },
          { id: 'yh', label: '余杭区' },
        ],
      },
      {
        id: 'nb',
        label: '宁波',
        children: [{ id: 'jb', label: '江北区' }],
      },
    ],
  },
  {
    id: 'gd',
    label: '广东',
    children: [
      {
        id: 'sz',
        label: '深圳',
        children: [{ id: 'ns', label: '南山' }],
      },
    ],
  },
];

it('renders cascader display value from controlled value', () => {
  render(
    <Cascader label="地区" options={options} value={['zj', 'hz', 'xh']} />,
  );

  expect(screen.getByText('浙江 / 杭州 / 西湖区')).toBeTruthy();
});

it('calls onValueChange with current path detail on confirm', () => {
  const onValueChange = vi.fn();

  render(
    <Cascader
      label="地区"
      options={options}
      value={['zj', 'hz', 'xh']}
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getByText('浙江 / 杭州 / 西湖区'));
  fireEvent.click(screen.getByText('确认'));

  expect(onValueChange).toHaveBeenCalled();
  const [value, detail] = onValueChange.mock.calls.at(-1) ?? [];

  expect(value).toEqual(['zj', 'hz', 'xh']);
  expect(detail.labels).toEqual(['浙江', '杭州', '西湖区']);
});

it('normalizes default value when level path is missing', () => {
  render(<Cascader label="地区" options={options} defaultValue={['gd']} />);

  expect(screen.getByText('广东 / 深圳 / 南山')).toBeTruthy();
});
