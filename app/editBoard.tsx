import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../src/components/button';
import { COLORS, FONT_SIZES, SPACING } from '../src/constants/theme';
import { useBoards } from '../src/hooks/useBoards';
import { getBoardById } from '../src/services/boardServices';

export default function EditBoardScreen() {
  const router = useRouter();
  const { boardId } = useLocalSearchParams();
  const { editBoard } = useBoards();
  
  const board = getBoardById(Number(boardId));
  
  const [name, setName] = useState(board?.name || '');
  const [description, setDescription] = useState(board?.description || '');

  if (!board) {
    return (
      <View style={styles.container}>
        <Text>Board not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a board name');
      return;
    }

    editBoard(Number(boardId), {
      name: name.trim(),
      description: description.trim(),
    });
    
    router.push('/boards');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Board Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new board name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter new description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZES.medium,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: SPACING.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  cancelButton: {
    backgroundColor: '#999',
    marginTop: SPACING.sm,
  },
});