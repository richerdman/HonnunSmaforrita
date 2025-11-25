import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ListModel } from "../../components/models/list";
import { listService } from "../../components/services/listService";

type Props = {
  boardId: number;
  onOpenList?: (listId: number) => void;
};

export default function ListsScreen({ boardId, onOpenList }: Props) {
  const [lists, setLists] = useState<ListModel[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    loadLists();
  }, [boardId]);

  function loadLists() {
    setLists(listService.getByBoardId(boardId));
  }

  function handleCreate() {
    try {
      if (!name.trim()) {
        Alert.alert("Validation", "Please enter a list name.");
        return;
      }
      listService.create({ name: name.trim(), color, boardId });
      loadLists();
      setName("");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to create list");
    }
  }

  function confirmAndDelete(id: number) {
    if (Platform.OS === "web") {
      const ok = window.confirm("Delete list\n\nAre you sure you want to delete this list?");
      if (ok) doDelete(id);
      return;
    }

    Alert.alert("Delete list", "Are you sure you want to delete this list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => doDelete(id),
      },
    ]);
  }

  function doDelete(id: number) {
    const removed = listService.delete(id);
    if (!removed) {
      Alert.alert("Error", "Failed to delete the list (id not found).");
      return;
    }
    loadLists();
  }

  function handleOpen(listId: number) {
    if (onOpenList) {
      onOpenList(listId);
    } else {
      console.log(`Open list tapped (id=${listId}). Provide onOpenList prop to navigate to Tasks screen.`);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Lists for board {boardId}</Text>

      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TextInput
          placeholder="List name"
          value={name}
          onChangeText={setName}
          style={{ flex: 1, borderWidth: 1, padding: 8, marginRight: 8, borderRadius: 6 }}
        />
        <TextInput
          placeholder="#color"
          value={color}
          onChangeText={setColor}
          style={{ width: 100, borderWidth: 1, padding: 8, marginRight: 8, borderRadius: 6 }}
        />
        <Button title="Add" onPress={handleCreate} />
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleOpen(item.id)}
            activeOpacity={0.8}
            style={{
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: "#fff",
              elevation: 1,
            }}
            testID={`list-row-${item.id}`}
            accessibilityRole="button"
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: item.color,
                    marginRight: 10,
                    borderRadius: 4,
                  }}
                />
                <Text>{item.name}</Text>
              </View>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation?.();
                  confirmAndDelete(item.id);
                }}
                testID={`delete-btn-${item.id}`}
                accessibilityRole="button"
                style={{ padding: 8 }}
              >
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
