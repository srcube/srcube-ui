import type { PickboxColumn, PickboxItem, PickboxItemId } from './props';

export function getDefaultColumnValue(column: PickboxColumn): PickboxItemId | null {
  const firstEnabled = column.items.find((item) => !item.isDisabled);
  return firstEnabled?.id ?? column.items[0]?.id ?? null;
}

export function ensurePickboxValue(
  columns: PickboxColumn[],
  input?: Array<PickboxItemId | null>,
): Array<PickboxItemId | null> {
  return columns.map(
    (column, index) => input?.[index] ?? getDefaultColumnValue(column),
  );
}

export function resolveSelectedIndex(
  items: PickboxItem[],
  selectedId: PickboxItemId | null,
) {
  if (items.length === 0) {
    return -1;
  }

  if (selectedId == null) {
    const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
  }

  const currentIndex = items.findIndex((item) => item.id === selectedId);
  if (currentIndex >= 0) {
    return currentIndex;
  }

  const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
  return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
}

export function resolveNearestEnabledIndex(params: {
  items: PickboxItem[];
  virtualItems: Array<{ index: number; start: number; size: number }>;
  viewportCenter: number;
}) {
  const { items, virtualItems, viewportCenter } = params;

  let nearestIndex = -1;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const virtualItem of virtualItems) {
    const item = items[virtualItem.index];
    if (!item || item.isDisabled) {
      continue;
    }

    const itemCenter = virtualItem.start + virtualItem.size / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = virtualItem.index;
    }
  }

  return nearestIndex;
}
