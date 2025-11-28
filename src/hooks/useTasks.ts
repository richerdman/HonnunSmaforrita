import { useCallback, useEffect, useState } from 'react';
import type { Task } from '../services/taskService';
import {
	deleteTask,
	getTasksByList,
	moveTask,
	createTask as svcCreateTask,
	editTask as svcEditTask,
	toggleTaskFinished,
} from '../services/taskService';

//* Hook to manage tasks for a specific list */
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
		toggleTaskFinished(id);
		refresh();
	}, [refresh]);

	const move = useCallback((id: number, toListId: number) => {
		moveTask(id, toListId);
		refresh();
	}, [refresh]);

	const remove = useCallback((id: number) => {
		deleteTask(id);
		refresh();
	}, [refresh]);

	const edit = useCallback((id: number, updates: Partial<Omit<Task, 'id' | 'listId'>>) => {
		svcEditTask(id, updates);
		refresh();
	}, [refresh]);

	return { tasks, refresh, createTask, toggle, move, remove, edit } as const;
}
