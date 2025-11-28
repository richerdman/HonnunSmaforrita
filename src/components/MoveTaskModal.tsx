import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '../views/tasks/styles';
import Button from './button';

type ListItem = { id: number; name: string; color?: string };

type Props = {
    visible: boolean;
    moveTaskId: number | null;
    currentListId: number;
    allLists: ListItem[];
    onMove: (toListId: number) => void;
    onClose: () => void;
};

export default function MoveTaskModal({ visible, moveTaskId, currentListId, allLists, onMove, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Move task to...</Text>
          {allLists
            .filter((l) => l.id !== currentListId)
            .map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => {
                  if (!moveTaskId) return;
                  onMove(l.id);
                }}
                style={styles.modalListItem}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.modalListColor, { backgroundColor: l.color ?? '#fff' }]} />
                  <Text style={styles.modalListItemText}>{l.name}</Text>
                </View>
              </TouchableOpacity>
            ))}

          <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button title="Cancel" onPress={onClose} style={{ backgroundColor: '#ccc' }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
