import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  createTask,
  deleteTask,
  getListById,
  getLists,
  getTasksByList,
  moveTask,
  Task,
  toggleTaskFinished,
} from '../../src/services/taskService';
import styles from '../../src/views/tasks/styles';

export default function TasksForList() {
  const params = useLocalSearchParams<{ listId?: string }>();
  const listId = Number(params.listId ?? NaN);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [moveTaskId, setMoveTaskId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
    createTask({ name: newName.trim(), description: newDescription.trim(), listId });
    setNewName('');
    setNewDescription('');
    refresh();
  }

  function onDelete(id: number) {
    Alert.alert('Delete task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteTask(id); refresh(); } },
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
      <Text style={styles.header}>{list?.name ?? `List ${listId}`}</Text>

      <FlatList
        data={tasks}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={[styles.name, item.isFinished && styles.finished]}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={styles.actions}>
              <Switch value={item.isFinished} onValueChange={() => onToggle(item.id)} />
              <TouchableOpacity onPress={() => setMoveTaskId(item.id)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: '#007aff' }}>Move</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks in this list.</Text>}
      />

      {moveTaskId && (
        <View style={{ padding: 8, backgroundColor: '#f8f8f8', borderRadius: 8, marginTop: 8 }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Move task to...</Text>
          {getLists()
            .filter((l) => l.id !== listId)
            .map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => {
                  moveTask(moveTaskId, l.id);
                  setMoveTaskId(null);
                  refresh();
                }}
                style={{ paddingVertical: 6 }}>
                <Text>{l.name}</Text>
              </TouchableOpacity>
            ))}
          <Button title="Cancel" onPress={() => setMoveTaskId(null)} />
        </View>
      )}

      <View style={styles.form}>
        <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
        <TextInput placeholder="Description" value={newDescription} onChangeText={setNewDescription} style={[styles.input, styles.textarea]} multiline />
        <Button title="Create Task" onPress={onCreate} />
      </View>
    </View>
  );
}
