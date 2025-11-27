import React, { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SPACING } from '../constants/theme';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../services/taskService';
import { getListById, getLists } from '../services/taskService';
import styles from '../views/tasks/styles';
import Button from './button';
import TaskCard from './TaskCard';

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
      <TaskCard
        task={task}
        listColor={getListById(listId)?.color}
        onToggle={(id) => toggle(id)}
        onMove={() => setMoveTaskId(task.id)}
        onDelete={() => remove(task.id)}
      />
    );
  }

  return (
    <View style={{ marginBottom: 16 }}>
      {showHeader && (
        <>
          <Text style={styles.title}>{list?.name ?? `List ${listId}`}</Text>
          <Button
            title="Add task"
            onPress={() => setOpenForm(true)}
            style={{ paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, alignSelf: 'flex-start', marginLeft: SPACING.md }}
          />
        </>
      )}

      {tasks.length === 0 ? (
        <Text style={styles.empty}>No tasks in this list.</Text>
      ) : (
        <FlatList data={tasks} keyExtractor={(t) => String(t.id)} renderItem={renderTask} />
      )}

      <Modal visible={openForm} animationType="fade" transparent onRequestClose={() => setOpenForm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.formTitle}>Create Task</Text>
            <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
            <TextInput placeholder="Description" value={newDescription} onChangeText={setNewDescription} style={[styles.input, styles.textarea]} multiline />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
               <Button title="Create" onPress={onCreate} style={{ paddingHorizontal: SPACING.lg }} />
              <Button title="Cancel" onPress={() => { setOpenForm(false); setNewName(''); setNewDescription(''); }} style={{ backgroundColor: '#ccc' }} />
            </View>
          </View>
        </View>
      </Modal>

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
