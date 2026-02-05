import { fireEvent, render } from '@testing-library/react';
import { Scrollbox } from '../src/react/scrollbox';

it('updates mask classes on scroll', () => {
  const { container } = render(
    <Scrollbox
      classNames={{
        scrollview: 'test-scrollview',
        maskTop: 'test-mask-top',
        maskBottom: 'test-mask-bottom',
      }}
    >
      <div style={{ height: 200 }}>Content</div>
    </Scrollbox>,
  );

  const scrollView = container.querySelector('.test-scrollview') as HTMLElement;
  const maskTop = container.querySelector('.test-mask-top') as HTMLElement;
  const maskBottom = container.querySelector(
    '.test-mask-bottom',
  ) as HTMLElement;

  Object.defineProperty(scrollView, 'scrollHeight', {
    value: 200,
    configurable: true,
  });
  Object.defineProperty(scrollView, 'clientHeight', {
    value: 100,
    configurable: true,
  });
  Object.defineProperty(scrollView, 'scrollTop', {
    value: 10,
    configurable: true,
  });

  fireEvent.scroll(scrollView);

  expect(maskTop.className).toContain('opacity-100');
  expect(maskBottom.className).toContain('opacity-100');
});
