import { useCallback, useEffect, useState } from 'react';
import {
  Task,
  getTasksByList,
  createTask as svcCreateTask,
  deleteTask as svcDelete,
  moveTask as svcMove,
  toggleTaskFinished as svcToggle,
} from '../services/taskService';

export function useTasks(listId: number) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!Number.isNaN(listId)) setTasks(getTasksByList(listId));
  }, [listId]);

  const refresh = useCallback(() => {
    setTasks(getTasksByList(listId));
  }, [listId]);

  const createTask = useCallback(
    (payload: { name: string; description?: string }) => {
      svcCreateTask({ ...payload, listId });
      refresh();
    },
    [listId, refresh]
  );

  const toggle = useCallback((id: number) => {
    svcToggle(id);
    refresh();
  }, [refresh]);

  const move = useCallback((id: number, toListId: number) => {
    svcMove(id, toListId);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: number) => {
    svcDelete(id);
    refresh();
  }, [refresh]);

  return { tasks, refresh, createTask, toggle, move, remove } as const;
}
