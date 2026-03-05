import { readFileSync } from 'node:fs';
import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/avatar/index.wxml?raw';
import { avatarMiniProps } from '../../src/components/avatar/props';

const testTemplate = template.replaceAll('sr-skeleton', 'view');

it('contains image error handler in template', () => {
  expect(template).toContain('binderror="handleImageError"');
  expect(template).toContain('bindload="handleImageLoad"');
  expect(template).toContain('<sr-skeleton');
  expect(template).toContain('radius="{{radius}}"');
  expect(template).toContain(
    'classNames="{{$skeletonClassNames || classNames}}"',
  );
  expect(template).toContain('wx:if="{{$isGradientOrb}}"');
  expect(template).toContain('style="{{$orbStyle}}"');
  expect(template).toContain('style="{{$orbGlowStyle}}"');
  expect(template).toContain('style="{{$fallbackTextStyle}}"');
});

it('accepts name in mini render data', () => {
  const id = simulate.load({
    template: testTemplate,
    properties: avatarMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    name: 'Mini User',
  });

  const data = comp.data as { name?: string };
  expect(data.name).toBe('Mini User');
});

it('uses full as default radius', () => {
  expect(avatarMiniProps.radius.value).toBe('full');
});

it('uses empty string as default fallback', () => {
  expect(avatarMiniProps.fallback.value).toBe('');
});

it('uses gradient-orb as default fallback style', () => {
  expect(avatarMiniProps.fallbackStyle.value).toBe('gradient-orb');
});

it('uses auto as default fallback theme', () => {
  expect(avatarMiniProps.fallbackTheme.value).toBe('auto');
});

it('maps sr-skeleton to sibling mini component', () => {
  const json = JSON.parse(
    readFileSync('packages/mini/src/components/avatar/index.json', 'utf8'),
  ) as {
    usingComponents?: Record<string, string>;
  };

  expect(json.usingComponents?.['sr-skeleton']).toBe('../skeleton/index');
});
