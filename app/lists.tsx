import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Button from "../src/components/button";
import ListCard from "../src/components/ListCard";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";
import { useLists } from "../src/hooks/useLists";
import { List } from "../src/types/types";

type Params = {
    boardId?: string;
};

export default function ListsRoute() {
    const params = useLocalSearchParams<Params>();
    const router = useRouter();
    const boardId = params.boardId ? Number(params.boardId) : 0;

    const { lists, createList, deleteList, updateList } = useLists(boardId);

    const [name, setName] = useState("");
    const [color, setColor] = useState("#ffffff");

    const [editing, setEditing] = useState<{ id: number; name: string; color: string } | null>(null);

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
        router.push(`/tasks/${listId}`);
    }

    function openEditModal(list: List) {
        setEditing({ id: list.id, name: list.name, color: list.color });
    }

    function closeEditModal() {
        setEditing(null);
    }

    function saveEdit() {
        if (!editing) return;
        if (!editing.name.trim()) {
        Alert.alert("Validation", "List name cannot be empty.");
        return;
        }
        const updated = updateList(editing.id, { name: editing.name.trim(), color: editing.color });
        if (!updated) {
        Alert.alert("Error", "Failed to update list.");
        }
        closeEditModal();
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Create a new List </Text>

        <View style={styles.inputRow}>
            <TextInput placeholder="List name" value={name} onChangeText={setName} style={styles.nameInput} />
            <TextInput placeholder="#color" value={color} onChangeText={setColor} style={styles.colorInput} />
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
                onEdit={() => openEditModal(item)}
            />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No lists yet.</Text>}
            contentContainerStyle={{ padding: SPACING.md }}
        />

        {/* Edit Modal */}
        <Modal visible={!!editing} animationType="slide" transparent>
            <View style={modalStyles.overlay}>
            <View style={modalStyles.sheet}>
                <Text style={modalStyles.heading}>Edit list</Text>

                <TextInput
                placeholder="List name"
                value={editing?.name ?? ""}
                onChangeText={(v) => setEditing((s) => (s ? { ...s, name: v } : s))}
                style={modalStyles.input}
                />
                <TextInput
                placeholder="#color"
                value={editing?.color ?? ""}
                onChangeText={(v) => setEditing((s) => (s ? { ...s, color: v } : s))}
                style={modalStyles.input}
                />

                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: SPACING.md }}>
                <Pressable onPress={closeEditModal} style={modalStyles.button}>
                    <Text>Cancel</Text>
                </Pressable>
                <Pressable onPress={saveEdit} style={[modalStyles.button, { marginLeft: SPACING.sm }]}>
                    <Text style={{ fontWeight: "600" }}>Save</Text>
                </Pressable>
                </View>
            </View>
            </View>
        </Modal>
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

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        padding: SPACING.md,
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
    },
    heading: {
        fontSize: FONT_SIZES.large,
        fontWeight: "600",
        marginBottom: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.sm,
        borderRadius: 6,
        backgroundColor: COLORS.white,
        marginBottom: SPACING.sm,
    },
    button: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.background,
        borderRadius: 6,
    },
});
