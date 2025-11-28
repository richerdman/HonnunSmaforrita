import { useState } from "react";
import {
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import TaskCard from "../components/taskCard/TaskCard";
import { SPACING } from "../constants/theme";
import { useLists } from "../hooks/useLists";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../services/taskService";
import { getListById } from "../services/taskService";
import styles from "../views/tasks/styles";
import Button from "./button";

type Props = { listId: number; showHeader?: boolean };

export default function TasksForList({ listId, showHeader = true }: Props) {
    const list = getListById(listId);
    const boardId = list ? list.boardId : 0;
    const { lists } = useLists(boardId);
    const { tasks, createTask, edit, toggle, move, remove } = useTasks(listId);
    const [openForm, setOpenForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [moveTaskId, setMoveTaskId] = useState<number | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);


    function onSubmitForm() {
        if (!newName.trim()) return;
        if (editingTaskId !== null) {
            edit(editingTaskId, { name: newName.trim(), description: newDescription.trim() });
        } else {
            createTask({ name: newName.trim(), description: newDescription.trim() });
        }
        setNewName("");
        setNewDescription("");
        setEditingTaskId(null);
        setOpenForm(false);
    }

    function onEdit(task: Task) {
        setNewName(task.name);
        setNewDescription(task.description ?? "");
        setEditingTaskId(task.id);
        setOpenForm(true);
    }

    function renderTask({ item: task }: { item: Task }) {
        return (
            <TaskCard
                task={task}
                listColor={getListById(listId)?.color}
                onToggle={(id) => toggle(id)}
                onMove={() => setMoveTaskId(task.id)}
				onEdit={() => onEdit(task)}
                onDelete={() => remove(task.id)}
            />
        );
    }

    return (
        <View style={{ marginBottom: 16 }}>
            {showHeader && (
                <>
                    <Text style={styles.title}>
                        {list?.name ?? `List ${listId}`}
                    </Text>
                    <Button
                        title="Add task"
                        onPress={() => setOpenForm(true)}
                        style={{
                            paddingHorizontal: SPACING.md,
                            paddingVertical: SPACING.sm,
                            alignSelf: "flex-start",
                            marginLeft: SPACING.md,
                        }}
                    />
                </>
            )}

            {tasks.length === 0 ? (
                <Text style={styles.empty}>No tasks in this list.</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(t) => String(t.id)}
                    renderItem={renderTask}
                />
            )}

            <Modal
                visible={openForm}
                animationType="fade"
                transparent
                onRequestClose={() => setOpenForm(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.formTitle}>{editingTaskId !== null ? 'Edit Task' : 'Create Task'}</Text>
                        <TextInput
                            placeholder="Name"
                            value={newName}
                            onChangeText={setNewName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Description"
                            value={newDescription}
                            onChangeText={setNewDescription}
                            style={[styles.input, styles.textarea]}
                            multiline
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                marginTop: 8,
                            }}
                        >
                            <Button
                                title={editingTaskId !== null ? 'Save' : 'Create'}
                                onPress={onSubmitForm}
                                style={{ paddingHorizontal: SPACING.lg }}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setOpenForm(false);
                                    setNewName("");
                                    setNewDescription("");
                                    setEditingTaskId(null);
                                }}
                                style={{ backgroundColor: "#ccc" }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {moveTaskId && (
                <View
                    style={{
                        padding: 8,
                        backgroundColor: "#f8f8f8",
                        borderRadius: 8,
                        marginTop: 8,
                    }}
                >
                    <Text style={{ fontWeight: "700", marginBottom: 6 }}>
                        Move task to...
                    </Text>
                    {lists
                        .filter((l) => l.id !== listId)
                        .map((l) => (
                            <TouchableOpacity
                                key={l.id}
                                onPress={() => {
                                    move(moveTaskId, l.id);
                                    setMoveTaskId(null);
                                }}
                                style={{ paddingVertical: 6 }}
                            >
                                <Text>{l.name}</Text>
                            </TouchableOpacity>
                        ))}
                    <Button
                        title="Cancel"
                        onPress={() => setMoveTaskId(null)}
                    />
                </View>
            )}
        </View>
    );
}
