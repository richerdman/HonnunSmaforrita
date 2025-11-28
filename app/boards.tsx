import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BoardCard from "../src/components/BoardCard";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";
import { useBoards } from "../src/hooks/useBoards";
import { Board } from "../src/types/types";


// 
export default function BoardsScreen() {
    const router = useRouter();
    const { boards, removeBoard } = useBoards();

    const renderBoard: ListRenderItem<Board> = ({ item }) => (
        <BoardCard
        board={item}
        onPress={() => {
            router.push(`/lists?boardId=${item.id}`);
        }}
        onDelete={(id)=>{
            console.log("Deleting board with id:", id);
            removeBoard(id);
        }}
        onEdit={(id) => {
            router.push(`/editBoard?boardId=${id}`);
        }}
        />
    );

    return (
        <View style={styles.container}>
        <FlatList
            data={boards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBoard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No boards available.</Text>
            }
        />

        <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/createBoard")}
            >
                <Text style={styles.addButtonText}>Create Board</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        padding: SPACING.md,
    },
    emptyText: {
        textAlign: "center",
        color: COLORS.border,
        fontSize: FONT_SIZES.medium,
        marginTop: SPACING.lg,
    },
    addButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
        marginHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
    },
});