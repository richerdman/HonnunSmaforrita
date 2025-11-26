import React, { useState } from 'react';
import { Button, FlatList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../services/taskService';
import { getListById, getLists } from '../services/taskService';
import styles from '../views/tasks/styles';

type Props = { listId: number; showHeader?: boolean };

export default function TasksForList({ listId, showHeader = true }: Props) {
  const { tasks, createTask, toggle, move, remove } = useTasks(listId);
  const [openForm, setOpenForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [moveTaskId, setMoveTaskId] = useState<number | null>(null);

  const list = getListById(listId);

  function onCreate() {
    if (!newName.trim()) return;
    createTask({ name: newName.trim(), description: newDescription.trim() });
    setNewName('');
    setNewDescription('');
    setOpenForm(false);
  }

  function renderTask({ item: task }: { item: Task }) {
    return (
      <View style={styles.row} key={task.id}>
        <View style={styles.info}>
          <Text style={[styles.name, task.isFinished && styles.finished]}>{task.name}</Text>
          <Text style={styles.desc}>{task.description}</Text>
        </View>
        <View style={styles.actions}>
          <Switch value={task.isFinished} onValueChange={() => toggle(task.id)} />
          <TouchableOpacity onPress={() => setMoveTaskId(task.id)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: '#007aff' }}>Move</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => remove(task.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 16 }}>
      {showHeader && <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{list?.name ?? `List ${listId}`}</Text>}

      {tasks.length === 0 ? (
        <Text style={{ color: '#666', marginBottom: 6 }}>No tasks in this list.</Text>
      ) : (
        <FlatList data={tasks} keyExtractor={(t) => String(t.id)} renderItem={renderTask} />
      )}

      {openForm ? (
        <View style={styles.form}>
          <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
          <TextInput placeholder="Description" value={newDescription} onChangeText={setNewDescription} style={[styles.input, styles.textarea]} multiline />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Create" onPress={onCreate} />
            <Button title="Cancel" onPress={() => setOpenForm(false)} />
          </View>
        </View>
      ) : (
        <Button title="Add task" onPress={() => setOpenForm(true)} />
      )}

      {moveTaskId && (
        <View style={{ padding: 8, backgroundColor: '#f8f8f8', borderRadius: 8, marginTop: 8 }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Move task to...</Text>
          {getLists()
            .filter((l) => l.id !== listId)
            .map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => {
                  move(moveTaskId, l.id);
                  setMoveTaskId(null);
                }}
                style={{ paddingVertical: 6 }}>
                <Text>{l.name}</Text>
              </TouchableOpacity>
            ))}
          <Button title="Cancel" onPress={() => setMoveTaskId(null)} />
        </View>
      )}
    </View>
  );
}
