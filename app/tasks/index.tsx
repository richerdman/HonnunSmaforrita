import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createTask, deleteTask, getLists, getTasksByList, moveTask, toggleTaskFinished } from '../../src/services/taskService';
import styles from '../../src/views/tasks/styles';

export default function TasksScreen() {
    const [lists, setLists] = useState(() => getLists());
    const [tasksChanged, setTasksChanged] = useState(0);

    const [openFormListId, setOpenFormListId] = useState<number | null>(null);
    const [moveListOpenForTaskId, setMoveListOpenForTaskId] = useState<number | null>(null);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        setLists(getLists());
    }, []);

    function refresh() {
        setTasksChanged((v) => v + 1);
    }

    function onToggle(taskId: number) {
        const result = toggleTaskFinished(taskId);
        refresh();
    }

    function onDelete(taskId: number) {
        Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => { deleteTask(taskId); refresh(); } },
        ]);
    }

    function onCreateForList(listId: number) {
        if (!newName.trim()) return;
        createTask({ name: newName.trim(), description: newDescription.trim(), listId });
        setNewName('');
        setNewDescription('');
        setOpenFormListId(null);
        refresh();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tasks by List</Text>
            <FlatList
                data={lists}
                extraData={tasksChanged}
                keyExtractor={(l) => String(l.id)}
                renderItem={({ item: list }) => {
                    const tasks = getTasksByList(list.id);
                    return (
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{list.name}</Text>
                            {tasks.length === 0 ? (
                                <Text style={{ color: '#666', marginBottom: 6 }}>No tasks in this list.</Text>
                            ) : (
                                tasks.map((task) => (
                                    <View key={task.id} style={styles.row}>
                                        <View style={styles.info}>
                                            <Text style={[styles.name, task.isFinished && styles.finished]}>{task.name}</Text>
                                            <Text style={styles.desc}>{task.description}</Text>
                                        </View>
                                        <View style={styles.actions}>
                                                <Switch value={task.isFinished} onValueChange={() => onToggle(task.id)} />
                                                <TouchableOpacity onPress={() => setMoveListOpenForTaskId(task.id)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                                                    <Text style={{ color: '#007aff' }}>Move</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
                                                    <Text style={styles.deleteTxt}>Delete</Text>
                                                </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}

                                {openFormListId === list.id ? (
                                <View style={styles.form}>
                                    <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
                                    <TextInput
                                        placeholder="Description"
                                        value={newDescription}
                                        onChangeText={setNewDescription}
                                        style={[styles.input, styles.textarea]}
                                        multiline
                                    />
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <Button title="Create" onPress={() => onCreateForList(list.id)} />
                                        <Button title="Cancel" onPress={() => setOpenFormListId(null)} />
                                    </View>
                                </View>
                            ) : (
                                <Button title="Add task" onPress={() => setOpenFormListId(list.id)} />
                            )}
                            {/** Inline move list selector rendered outside tasks map so it doesn't duplicate per task render */}
                            {moveListOpenForTaskId && tasks.some((t) => t.id === moveListOpenForTaskId) && (
                                <View style={{ padding: 8, backgroundColor: '#f8f8f8', borderRadius: 8, marginTop: 8 }}>
                                    <Text style={{ fontWeight: '700', marginBottom: 6 }}>Move task to...</Text>
                                    {getLists()
                                        .filter((l) => l.id !== list.id)
                                        .map((l) => (
                                            <TouchableOpacity
                                                key={l.id}
                                                onPress={() => {
                                                    console.log('moving task', moveListOpenForTaskId, 'to', l.id);
                                                    const result = moveTask(moveListOpenForTaskId as number, l.id);
                                                    console.log('move result', result);
                                                    setMoveListOpenForTaskId(null);
                                                    refresh();
                                                }}
                                                style={{ paddingVertical: 6 }}>
                                                <Text>{l.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    <Button title="Cancel" onPress={() => setMoveListOpenForTaskId(null)} />
                                </View>
                            )}
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.empty}>No lists found.</Text>}
            />
        </View>
    );
}
