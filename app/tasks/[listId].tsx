import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../components/button";
import TaskCard from "../../components/TaskCard";
import { SPACING } from "../../constants/theme";
import {
    createTask,
    deleteTask,
    getListById,
    getLists,
    getTasksByList,
    moveTask,
    Task,
    toggleTaskFinished,
} from "../../services/taskService";
import styles from "../../views/tasks/styles";

export default function TasksForList() {
    const params = useLocalSearchParams<{ listId?: string }>();
    const listId = Number(params.listId ?? NaN);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [moveTaskId, setMoveTaskId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (!Number.isNaN(listId)) setTasks(getTasksByList(listId));
    }, [listId]);

    function refresh() {
        setTasks(getTasksByList(listId));
    }

    function onToggle(id: number) {
        toggleTaskFinished(id);
        refresh();
    }

    function onCreate() {
        if (!newName.trim()) return;
        createTask({
            name: newName.trim(),
            description: newDescription.trim(),
            listId,
        });
        setNewName("");
        setNewDescription("");
        setShowCreateModal(false);
        refresh();
    }

    function onDelete(id: number) {
        if (Platform.OS === "web") {
            if (window.confirm("Delete task\n\nAre you sure?")) {
                deleteTask(id);
                refresh();
            }
            return;
        }

        Alert.alert("Delete task", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    deleteTask(id);
                    refresh();
                },
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

    const list = getListById(listId);

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{list?.name ?? `List ${listId}`}</Text>

            <FlatList
                data={tasks}
                keyExtractor={(t) => String(t.id)}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        listColor={list?.color}
                        onToggle={(id: number) => onToggle(id)}
                        onMove={() => setMoveTaskId(item.id)}
                        onDelete={() => onDelete(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No tasks in this list.</Text>
                }
                contentContainerStyle={{ padding: SPACING.md }}
            />

            <Modal visible={!!moveTaskId} transparent animationType="fade" onRequestClose={() => setMoveTaskId(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Move task to...</Text>
                        {getLists()
                            .filter((l) => l.id !== listId)
                            .map((l) => (
                                <TouchableOpacity
                                    key={l.id}
                                    onPress={() => {
                                        if (!moveTaskId) return;
                                        moveTask(moveTaskId, l.id);
                                        setMoveTaskId(null);
                                        refresh();
                                    }}
                                    style={styles.modalListItem}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={[styles.modalListColor, { backgroundColor: l.color ?? '#fff' }]} />
                                        <Text style={styles.modalListItemText}>{l.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        <View style={{ marginTop: SPACING.sm, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button title="Cancel" onPress={() => setMoveTaskId(null)} style={{ backgroundColor: '#ccc' }} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Button
                title="Create Task"
                onPress={() => setShowCreateModal(true)}
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

            <Modal visible={showCreateModal} transparent animationType="fade" onRequestClose={() => setShowCreateModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.formTitle}>Create Task</Text>
                        <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
                        <TextInput placeholder="Description" value={newDescription} onChangeText={setNewDescription} style={[styles.input, styles.textarea]} multiline />
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                            <Button title="Create" onPress={onCreate} style={{ paddingHorizontal: SPACING.lg }} />
                            <Button title="Cancel" onPress={() => { setNewName(''); setNewDescription(''); setShowCreateModal(false); }} style={{ backgroundColor: '#ccc' }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
