import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Platform, Text, View } from "react-native";
import Button from "../../src/components/button";
import MoveTaskModal from "../../src/components/MoveTaskModal";
import TaskCard from "../../src/components/taskCard/TaskCard";
import TaskFormModal from "../../src/components/TaskFormModal";
import TaskHeader from "../../src/components/TaskHeader";
import { SPACING } from "../../src/constants/theme";
import { getListByIdFromStore, useAllLists } from "../../src/hooks/useLists";
import { useTasks } from "../../src/hooks/useTasks";
import useVisibleTasks from "../../src/hooks/useVisibleTasks";
import { getListById as getListByIdFromService } from "../../src/services/taskService";
import styles from "../../src/views/tasks/styles";

export default function TasksForList() {
    const params = useLocalSearchParams<{ listId?: string }>();
    const listId = Number(params.listId ?? NaN);

    const [moveTaskId, setMoveTaskId] = useState<number | null>(null);
    
    const [errorMsg, setErrorMsg] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [showCompleted, setShowCompleted] = useState(true);
    const [sortMode, setSortMode] = useState<'none' | 'due' | 'name'>('none');
    const { tasks, createTask, edit, toggle, move, remove } = useTasks(listId);

    function onToggle(id: number) {
        toggle(id);
    }

    // Task creation/editing is handled by TaskFormModal

    function onDelete(id: number) {
        if (Platform.OS === "web") {
            if (window.confirm("Delete task\n\nAre you sure?")) {
                remove(id);
            }
            return;
        }

        Alert.alert("Delete task", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => remove(id),
            },
        ]);
    }
	

    if (Number.isNaN(listId)) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Invalid list</Text>
            </View>
        );
    }

    // prefer hook-backed list lookup so newly created lists are visible
    const list = getListByIdFromStore(listId) ?? getListByIdFromService(listId);
    const { lists: allLists } = useAllLists();

    // prepare filtered + sorted tasks for display based on header menu choices
    const displayed = useVisibleTasks(tasks, showCompleted, sortMode);

    return (
        <View style={styles.container}>

            <TaskHeader
                title={list?.name ?? `List ${listId}`}
                showCompleted={showCompleted}
                onToggleShowCompleted={() => setShowCompleted((s) => !s)}
                sortMode={sortMode}
                setSortMode={(m) => setSortMode(m)}
                buttonStyle={{ marginRight: SPACING.md, marginTop: SPACING.xs }}
            />

            <FlatList
                data={displayed}
                keyExtractor={(t) => String(t.id)}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        listColor={list?.color}
                        onToggle={(id: number) => onToggle(id)}
                        onMove={() => setMoveTaskId(item.id)}
                        onEdit={() => {
                            setEditingTaskId(item.id);
                            setShowCreateModal(true);
                        }}
                        onDelete={() => onDelete(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No tasks in this list.</Text>
                }
                contentContainerStyle={{ padding: SPACING.md }}
            />

            <MoveTaskModal
                visible={!!moveTaskId}
                moveTaskId={moveTaskId}
                currentListId={listId}
                allLists={allLists}
                onMove={(toListId) => {
                    if (!moveTaskId) return;
                    move(moveTaskId, toListId);
                    setMoveTaskId(null);
                }}
                onClose={() => setMoveTaskId(null)}
            />

            <Button
                title="Create Task"
                onPress={() => {
                    setEditingTaskId(null);
                    setShowCreateModal(true);
                }}
                style={{
                    marginTop: SPACING.sm,
                    paddingHorizontal: SPACING.lg,
                    paddingVertical: SPACING.md,
                    minHeight: 48,
                    marginBottom: SPACING.md,
                    marginHorizontal: SPACING.md,
                    alignSelf: 'stretch',
                }}
            />

            <TaskFormModal
                visible={showCreateModal}
                title={editingTaskId !== null ? 'Edit Task' : 'Create Task'}
                task={editingTaskId !== null ? tasks.find((t) => t.id === editingTaskId) : undefined}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingTaskId(null);
                }}
                onSubmit={(payload) => {
                    if (editingTaskId !== null) {
                        return edit(editingTaskId, { name: payload.name, description: payload.description, dueDate: payload.dueDate });
                    }
                    return createTask({ name: payload.name, description: payload.description, dueDate: payload.dueDate });
                }}
            />
        </View>
    );
}
