import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
    createTask,
    deleteTask,
    getListById,
    getTasksByList,
    Task,
    toggleTaskFinished,
} from '../../src/services/taskService';
import styles from '../../src/views/tasks/styles';

export default function TasksForList() {
  const params = useLocalSearchParams<{ listId?: string }>();
  const listId = Number(params.listId ?? NaN);

  const [tasks, setTasks] = useState<Task[]>([]);
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
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks in this list.</Text>}
      />

      <View style={styles.form}>
        <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
        <TextInput placeholder="Description" value={newDescription} onChangeText={setNewDescription} style={[styles.input, styles.textarea]} multiline />
        <Button title="Create Task" onPress={onCreate} />
      </View>
    </View>
  );
}
