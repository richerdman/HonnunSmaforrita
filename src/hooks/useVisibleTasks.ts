import { useMemo } from 'react';

type SortMode = 'none' | 'due' | 'name';

/**
 * Returns a filtered + sorted copy of the provided tasks.
 * - filters out finished tasks when `showCompleted` is false
 * - sorts by due date (ISO YYYY-MM-DD) when `sortMode==='due'`
 * - sorts by name when `sortMode==='name'`
 */
export default function useVisibleTasks<T extends { dueDate?: string | null; isFinished?: boolean; name: string }>(
  tasks: T[],
  showCompleted: boolean,
  sortMode: SortMode
) {
  return useMemo(() => {
    const filtered = tasks.filter((t) => showCompleted || !t.isFinished);
    const displayed = [...filtered];

    if (sortMode === 'due') {
      displayed.sort((a, b) => {
        const ad = a.dueDate ?? '';
        const bd = b.dueDate ?? '';
        if (!ad && !bd) return 0;
        if (!ad) return 1;
        if (!bd) return -1;
        return ad.localeCompare(bd);
      });
    } else if (sortMode === 'name') {
      displayed.sort((a, b) => a.name.localeCompare(b.name));
    }

    return displayed;
  }, [tasks, showCompleted, sortMode]);
}
