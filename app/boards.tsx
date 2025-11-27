import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BoardCard from "../components/BoardCard";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { useBoards } from "../hooks/useBoards";
import { Board } from "../types";


// 
export default function BoardsScreen() {
    const router = useRouter();
    const { boards } = useBoards();

    const renderBoard: ListRenderItem<Board> = ({ item }) => (
        <BoardCard
        board={item}
        onPress={() => {
            router.push(`/lists?boardId=${item.id}`);
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
                <Text style={styles.addButtonText}>+</Text>
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
        position: "absolute",
        bottom: SPACING.lg,
        right: SPACING.lg,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: "bold",
    },
});