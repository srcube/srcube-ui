import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { addToast, clearToasts, closeToast, getToasts, toast } from '../../src/components/toaster/registry';
import { Toaster } from '../../src/components/toaster';

void React;

afterEach(() => {
  vi.useRealTimers();
  act(() => {
    clearToasts();
  });
});

// ---------------------------------------------------------------------------
// Rendering basics
// ---------------------------------------------------------------------------

it('renders nothing when no toasts exist', () => {
  const { container } = render(<Toaster />);
  expect(container.innerHTML).toBe('');
});

it('renders toast item from registry', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Saved', description: 'Profile updated' });
  });

  await waitFor(() => {
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Profile updated')).toBeTruthy();
  });
});

it('renders title only when description is omitted', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Done' });
  });

  await waitFor(() => {
    expect(screen.getByText('Done')).toBeTruthy();
  });
});

it('renders description only when title is omitted', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ description: 'Something happened' });
  });

  await waitFor(() => {
    expect(screen.getByText('Something happened')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Tone variants
// ---------------------------------------------------------------------------

it.each(['light', 'dark', 'primary', 'secondary', 'success', 'warning', 'danger'] as const)(
  'renders %s tone without error',
  async (tone) => {
    render(<Toaster />);

    act(() => {
      addToast({ title: `Tone: ${tone}`, tone });
    });

    await waitFor(() => {
      expect(screen.getByText(`Tone: ${tone}`)).toBeTruthy();
    });
  },
);

it('defaults to dark tone', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Default tone' });
  });

  const items = getToasts();
  expect(items[0].tone).toBe('dark');
});

// ---------------------------------------------------------------------------
// Close button (showClose)
// ---------------------------------------------------------------------------

it('renders closable toast button when showClose is true', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Closable', showClose: true });
  });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'close toast' })).toBeTruthy();
  });
});

it('renders close button outside toast layer container', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Layer close button', showClose: true, shouldAutoDismiss: false });
  });

  const button = await screen.findByRole('button', { name: 'close toast' });
  const topLayer = document.body.querySelector('[data-toast-layer="0"]');

  expect(topLayer).toBeTruthy();
  expect(topLayer?.contains(button)).toBe(false);
});

it('does not render close button by default', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Not closable' });
  });

  await waitFor(() => {
    expect(screen.getByText('Not closable')).toBeTruthy();
  });

  expect(screen.queryByRole('button', { name: 'close toast' })).toBeNull();
});

it('removes toast when close button is clicked', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Close me', showClose: true, shouldAutoDismiss: false });
  });

  expect(screen.getByText('Close me')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'close toast' }));

  // After leave duration (300ms), the toast should be removed
  act(() => {
    vi.advanceTimersByTime(350);
  });

  expect(screen.queryByText('Close me')).toBeNull();
});

it('renders only one close button for the latest toast and hands it to next after close', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Layer A', showClose: true, shouldAutoDismiss: false });
    addToast({ title: 'Layer B', showClose: true, shouldAutoDismiss: false });
    addToast({ title: 'Layer C', showClose: true, shouldAutoDismiss: false });
  });

  expect(screen.getAllByRole('button', { name: 'close toast' })).toHaveLength(1);
  expect(document.body.querySelector('[data-toast-layer="0"]')?.textContent).toContain('Layer C');

  fireEvent.click(screen.getByRole('button', { name: 'close toast' }));

  act(() => {
    vi.advanceTimersByTime(350);
  });

  expect(screen.queryByText('Layer C')).toBeNull();
  expect(document.body.querySelector('[data-toast-layer="0"]')?.textContent).toContain('Layer B');
  expect(screen.getAllByRole('button', { name: 'close toast' })).toHaveLength(1);
});

// ---------------------------------------------------------------------------
// Auto-dismiss
// ---------------------------------------------------------------------------

it('auto-dismisses after default duration', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Auto dismiss' });
  });

  expect(screen.getByText('Auto dismiss')).toBeTruthy();

  // Default duration is 1800ms, then 300ms for leave animation
  act(() => {
    vi.advanceTimersByTime(2200);
  });

  expect(screen.queryByText('Auto dismiss')).toBeNull();
});

it('auto-dismisses after custom duration', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Custom duration', duration: 500 });
  });

  expect(screen.getByText('Custom duration')).toBeTruthy();

  act(() => {
    vi.advanceTimersByTime(850);
  });

  expect(screen.queryByText('Custom duration')).toBeNull();
});

it('keeps auto-dismiss timing when showClose is true', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Closable auto dismiss', duration: 500, showClose: true });
  });

  expect(screen.getByText('Closable auto dismiss')).toBeTruthy();

  act(() => {
    vi.advanceTimersByTime(850);
  });

  expect(screen.queryByText('Closable auto dismiss')).toBeNull();
});

it('does not auto-dismiss when shouldAutoDismiss is false', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ title: 'Persistent', shouldAutoDismiss: false });
  });

  expect(screen.getByText('Persistent')).toBeTruthy();

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(screen.getByText('Persistent')).toBeTruthy();
});

it('gates countdown to the active toast and activates next only after close completes', () => {
  vi.useFakeTimers();

  render(<Toaster />);

  act(() => {
    addToast({ id: 'toast-a', title: 'Toast A', duration: 1000 });
  });

  act(() => {
    vi.advanceTimersByTime(400);
  });

  act(() => {
    addToast({ id: 'toast-b', title: 'Toast B', duration: 1000 });
  });

  let snapshot = getToasts();
  expect(snapshot.find((item) => item.id === 'toast-a')?.lifecycle).toBe('paused');
  expect(snapshot.find((item) => item.id === 'toast-b')?.lifecycle).toBe('active');

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  snapshot = getToasts();
  expect(snapshot.find((item) => item.id === 'toast-b')?.state).toBe('leave');
  expect(snapshot.find((item) => item.id === 'toast-a')?.lifecycle).toBe('paused');

  act(() => {
    vi.advanceTimersByTime(300);
  });

  snapshot = getToasts();
  expect(snapshot.find((item) => item.id === 'toast-b')).toBeUndefined();
  expect(snapshot.find((item) => item.id === 'toast-a')?.lifecycle).toBe('active');

  // If timer was not reset on stack, Toast A would close around 600ms after reactivation.
  act(() => {
    vi.advanceTimersByTime(900);
  });
  snapshot = getToasts();
  expect(snapshot.find((item) => item.id === 'toast-a')?.state).toBe('enter');

  act(() => {
    vi.advanceTimersByTime(400);
  });
  snapshot = getToasts();
  expect(snapshot.find((item) => item.id === 'toast-a')).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Layering
// ---------------------------------------------------------------------------

it('limits visible toasts to the latest 3 layers', () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Toast A', shouldAutoDismiss: false });
    addToast({ title: 'Toast B', shouldAutoDismiss: false });
    addToast({ title: 'Toast C', shouldAutoDismiss: false });
    addToast({ title: 'Toast D', shouldAutoDismiss: false });
  });

  expect(screen.getByText('Toast D')).toBeTruthy();
  expect(screen.getByText('Toast C')).toBeTruthy();
  expect(screen.getByText('Toast B')).toBeTruthy();
  expect(screen.queryByText('Toast A')).toBeNull();
});

it('renders newest toast as top layer in stack mode', () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Layer A', shouldAutoDismiss: false });
    addToast({ title: 'Layer B', shouldAutoDismiss: false });
    addToast({ title: 'Layer C', shouldAutoDismiss: false });
  });

  const topLayer = document.body.querySelector('[data-toast-layer="0"]');
  const secondLayer = document.body.querySelector('[data-toast-layer="1"]');

  expect(topLayer?.textContent).toContain('Layer C');
  expect(secondLayer?.textContent).toContain('Layer B');
});

it('stacks previous layers downward from the active toast', () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Layer A', shouldAutoDismiss: false });
    addToast({ title: 'Layer B', shouldAutoDismiss: false });
    addToast({ title: 'Layer C', shouldAutoDismiss: false });
  });

  const topLayer = document.body.querySelector('[data-toast-layer="0"]');
  const secondLayer = document.body.querySelector('[data-toast-layer="1"]');

  expect(topLayer?.getAttribute('style')).toContain('translateY(0px)');
  expect(secondLayer?.getAttribute('style')).toContain('translateY(10px)');
});
// ---------------------------------------------------------------------------
// Registry API
// ---------------------------------------------------------------------------

it('addToast returns result with id and close function', () => {
  const result = addToast({ title: 'API test' });

  expect(typeof result.id).toBe('string');
  expect(typeof result.close).toBe('function');
  expect(result.closed).toBeInstanceOf(Promise);
});

it('getToasts returns current items', () => {
  addToast({ title: 'Item A', shouldAutoDismiss: false });
  addToast({ title: 'Item B', shouldAutoDismiss: false });

  const items = getToasts();
  expect(items).toHaveLength(2);
  expect(items[0].title).toBe('Item A');
  expect(items[1].title).toBe('Item B');
});

it('closeToast transitions to leave state', () => {
  const result = addToast({ title: 'Will close', shouldAutoDismiss: false });

  closeToast(result.id);

  const items = getToasts();
  const target = items.find((item) => item.id === result.id);
  expect(target?.state).toBe('leave');
});

it('clearToasts removes all items', () => {
  addToast({ title: 'A', shouldAutoDismiss: false });
  addToast({ title: 'B', shouldAutoDismiss: false });

  clearToasts();

  expect(getToasts()).toHaveLength(0);
});

it('addToast with custom id uses provided id', () => {
  const result = addToast({ id: 'custom-123', title: 'Custom ID' });
  expect(result.id).toBe('custom-123');
});

it('result.close() closes the toast', () => {
  const result = addToast({ title: 'Close via result', shouldAutoDismiss: false });

  result.close();

  const items = getToasts();
  const target = items.find((item) => item.id === result.id);
  expect(target?.state).toBe('leave');
});

// ---------------------------------------------------------------------------
// onClose callback
// ---------------------------------------------------------------------------

it('invokes onClose after leave animation completes', async () => {
  vi.useFakeTimers();

  const onClose = vi.fn();
  addToast({ title: 'Callback test', shouldAutoDismiss: false, onClose });

  const items = getToasts();
  closeToast(items[0].id);

  expect(onClose).not.toHaveBeenCalled();

  // Leave animation is 300ms
  act(() => {
    vi.advanceTimersByTime(350);
  });

  expect(onClose).toHaveBeenCalledOnce();

  vi.useRealTimers();
});

it('invokes onClose for each toast when clearToasts is called', () => {
  const onCloseA = vi.fn();
  const onCloseB = vi.fn();

  addToast({ title: 'A', shouldAutoDismiss: false, onClose: onCloseA });
  addToast({ title: 'B', shouldAutoDismiss: false, onClose: onCloseB });

  clearToasts();

  expect(onCloseA).toHaveBeenCalledOnce();
  expect(onCloseB).toHaveBeenCalledOnce();
});

// ---------------------------------------------------------------------------
// closed promise
// ---------------------------------------------------------------------------

it('closed promise resolves after leave removal', async () => {
  vi.useFakeTimers();

  const result = addToast({ title: 'Promise test', shouldAutoDismiss: false });
  let resolved = false;
  result.closed.then(() => {
    resolved = true;
  });

  result.close();

  // Not resolved yet during leave animation
  await Promise.resolve();
  expect(resolved).toBe(false);

  act(() => {
    vi.advanceTimersByTime(350);
  });

  // Flush microtasks
  await vi.waitFor(() => {
    expect(resolved).toBe(true);
  });

  vi.useRealTimers();
});

it('closed promise resolves when clearToasts is called', async () => {
  const result = addToast({ title: 'Clear promise', shouldAutoDismiss: false });
  let resolved = false;
  result.closed.then(() => {
    resolved = true;
  });

  clearToasts();

  await vi.waitFor(() => {
    expect(resolved).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// toast shorthand helpers
// ---------------------------------------------------------------------------

it('toast.success sets tone to success', () => {
  toast.success({ title: 'Success!' });
  const items = getToasts();
  expect(items[items.length - 1].tone).toBe('success');
});

it('toast.warning sets tone to warning', () => {
  toast.warning({ title: 'Warning!' });
  const items = getToasts();
  expect(items[items.length - 1].tone).toBe('warning');
});

it('toast.danger sets tone to danger', () => {
  toast.danger({ title: 'Danger!' });
  const items = getToasts();
  expect(items[items.length - 1].tone).toBe('danger');
});

it('toast.primary sets tone to primary', () => {
  toast.primary({ title: 'Primary!' });
  const items = getToasts();
  expect(items[items.length - 1].tone).toBe('primary');
});

it('toast shorthands return AddToastResult', () => {
  const result = toast.success({ title: 'Check result' });
  expect(typeof result.id).toBe('string');
  expect(typeof result.close).toBe('function');
  expect(result.closed).toBeInstanceOf(Promise);
});

// ---------------------------------------------------------------------------
// className / classNames overrides
// ---------------------------------------------------------------------------

it('applies custom className to base element', async () => {
  render(<Toaster className="custom-base" />);

  act(() => {
    addToast({ title: 'Styled' });
  });

  await waitFor(() => {
    expect(screen.getByText('Styled')).toBeTruthy();
  });

  const portalContent = document.body.querySelector('[class*="custom-base"]');
  expect(portalContent).toBeTruthy();
});

it('applies classNames overrides to slots', async () => {
  render(<Toaster classNames={{ stack: 'custom-stack', toast: 'custom-toast' }} />);

  act(() => {
    addToast({ title: 'ClassNames test' });
  });

  await waitFor(() => {
    expect(screen.getByText('ClassNames test')).toBeTruthy();
  });

  expect(document.body.querySelector('[class*="custom-stack"]')).toBeTruthy();
  expect(document.body.querySelector('[class*="custom-toast"]')).toBeTruthy();
});

// ---------------------------------------------------------------------------
// Custom icon
// ---------------------------------------------------------------------------

it('renders custom icon when provided', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'With icon', icon: '🎉' });
  });

  await waitFor(() => {
    expect(screen.getByText('🎉')).toBeTruthy();
  });
});

it('renders default icon when icon is not provided', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Default icon' });
  });

  await waitFor(() => {
    expect(screen.getByText('Default icon')).toBeTruthy();
  });

  // The default icon span should exist with the icon class
  const defaultIcon = document.body.querySelector('[class*="icon-info"]');
  expect(defaultIcon).toBeTruthy();
});

it('uses enlarged icon size for visual balance', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Large icon' });
  });

  await waitFor(() => {
    expect(screen.getByText('Large icon')).toBeTruthy();
  });

  const defaultIcon = document.body.querySelector('[class*="icon-info"]');
  const iconWrapperClass = defaultIcon?.parentElement?.getAttribute('class') ?? '';
  expect(iconWrapperClass).toContain('text-3xl');
});

it('renders close button with mobile-friendly hit area', async () => {
  render(<Toaster />);

  act(() => {
    addToast({ title: 'Closable hit area', showClose: true, shouldAutoDismiss: false });
  });

  const button = await screen.findByRole('button', { name: 'close toast' });
  const className = button.getAttribute('class') ?? '';
  const closeLayerClass = button.parentElement?.getAttribute('class') ?? '';
  expect(className).toContain('h-10');
  expect(className).toContain('w-10');
  expect(className).toContain('pointer-events-auto');
  expect(closeLayerClass).toContain('pointer-events-none');
  expect(closeLayerClass).toContain('z-10');
});

// ---------------------------------------------------------------------------
// displayName
// ---------------------------------------------------------------------------

it('has correct displayName', () => {
  expect(Toaster.displayName).toBe('Srcube.Toaster');
});
