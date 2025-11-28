import { useState } from "react";
import {
    Alert,
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
    const [showCompleted, setShowCompleted] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());
    const [errorMsg, setErrorMsg] = useState("");
    const [moveTaskId, setMoveTaskId] = useState<number | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);


    function onSubmitForm() {
        // validate due date if provided: must be ISO YYYY-MM-DD
        const due = newDueDate?.trim();
        if (due) {
            const isIso = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(due);
            let valid = false;
            if (isIso) {
                const d = new Date(due);
                valid = !isNaN(d.getTime()) && d.toISOString().startsWith(due);
            }
            if (!valid) {
                const msg = 'Please enter the due date in YYYY-MM-DD format.';
                setErrorMsg(msg);
                Alert.alert('Invalid date', msg);
                return;
            }
            // check for past date (compare date-only values)
            const parsed = new Date(due);
            const parsedDateOnly = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            const today = new Date();
            const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if (parsedDateOnly < todayDateOnly) {
                const msg = 'Due date cannot be in the past.';
                setErrorMsg(msg);
                Alert.alert('Past date', msg);
                return;
            }
        }
        if (!newName.trim()) {
            const msg = 'Please enter a task name.';
            setErrorMsg(msg);
            Alert.alert('Missing name', msg);
            return;
        }
        if (editingTaskId !== null) {
            const res = edit(editingTaskId, { name: newName.trim(), description: newDescription.trim(), dueDate: newDueDate || undefined });
            if (!(res && (res as any).ok)) {
                const msg = (res && (res as any).error) || 'Failed to save task';
                setErrorMsg(msg);
                Alert.alert('Error', msg);
                return;
            }
        } else {
            const res = createTask({ name: newName.trim(), description: newDescription.trim(), dueDate: newDueDate || undefined });
            if (!(res && (res as any).ok)) {
                const msg = (res && (res as any).error) || 'Failed to create task';
                setErrorMsg(msg);
                Alert.alert('Error', msg);
                return;
            }
        }
        setNewName("");
        setNewDescription("");
        setNewDueDate("");
        setErrorMsg("");
        setEditingTaskId(null);
        setOpenForm(false);
    }

    function onEdit(task: Task) {
        setNewName(task.name);
        setNewDescription(task.description ?? "");
        setNewDueDate(task.dueDate ?? "");
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
                        title={showCompleted ? 'Hide completed' : 'Show completed'}
                        onPress={() => setShowCompleted((s) => !s)}
                        style={{
                            paddingHorizontal: SPACING.md,
                            paddingVertical: SPACING.sm,
                            alignSelf: "flex-start",
                            marginLeft: SPACING.md,
                            marginTop: 8,
                        }}
                    />
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

            {tasks.filter((t) => showCompleted || !t.isFinished).length === 0 ? (
                <Text style={styles.empty}>No tasks in this list.</Text>
            ) : (
                <FlatList
                    data={tasks.filter((t) => showCompleted || !t.isFinished)}
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
                        <View>
                            <TextInput
                                placeholder="Due Date (YYYY-MM-DD)"
                                value={newDueDate}
                                onChangeText={(t) => {
                                    setNewDueDate(t);
                                    if (errorMsg) setErrorMsg("");
                                }}
                                style={styles.input}
                            />
                            {errorMsg ? (
                                <Text style={styles.error}>{errorMsg}</Text>
                            ) : null}
                            <TouchableOpacity
                                onPress={() => {
                                    setDatePickerDate(newDueDate ? new Date(newDueDate) : new Date());
                                    setShowDatePicker(true);
                                }}
                                style={styles.datePickerButton}
                            >
                
                            </TouchableOpacity>
                        </View>
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
