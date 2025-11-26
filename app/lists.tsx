import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Button from "../components/button";
import ListCard from "../components/ListCard";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { useLists } from "../hooks/useLists";

type Params = {
  boardId?: string;
};

export default function ListsRoute() {
  const params = useLocalSearchParams<Params>();
  const router = useRouter();
  const boardId = params.boardId ? Number(params.boardId) : 0;

  const { lists, createList, deleteList } = useLists(boardId);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a list name.");
      return;
    }
    try {
      createList({ name: name.trim(), color });
      setName("");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to create list");
    }
  }

  function handleDeleteWithConfirm(id: number) {
    if (Platform.OS === "web") {
      if (window.confirm("Delete list\n\nAre you sure?")) deleteList(id);
      return;
    }
    Alert.alert("Delete list", "Are you sure you want to delete this list?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteList(id) },
    ]);
  }

  function openList(listId: number) {
    router.push({ pathname: "/tasks", params: { listId } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new List </Text>
    
      <View style={styles.inputRow}>
        <TextInput
          placeholder="List name"
          value={name}
          onChangeText={setName}
          style={styles.nameInput}
        />
        <TextInput
          placeholder="#color"
          value={color}
          onChangeText={setColor}
          style={styles.colorInput}
        />
        <Button title="Add" onPress={handleCreate} />
      </View>
      
      <Text style={styles.title}>Lists for this board </Text>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListCard
            list={item}
            onPress={() => openList(item.id)}
            onDelete={() => handleDeleteWithConfirm(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No lists yet.</Text>}
        contentContainerStyle={{ padding: SPACING.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginLeft: SPACING.md,
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: "center",
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
  colorInput: {
    width: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
  empty: {
    textAlign: "center",
    color: COLORS.border,
    fontSize: FONT_SIZES.medium,
    marginTop: SPACING.lg,
  },
});
