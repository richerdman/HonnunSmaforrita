import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, ListRenderItem, Platform, StyleSheet, Text, View } from "react-native";
import BoardCard from "../src/components/BoardCard";
import Button from "../src/components/button";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";
import { useBoards } from "../src/hooks/useBoards";
import { Board } from "../src/types/types";


// 
export default function BoardsScreen() {
    const router = useRouter();
    const { boards, removeBoard } = useBoards();

    function handleDeleteWithConfirm(id: number) {
        if (Platform.OS === 'web') {
            if (window.confirm('Delete board\n\nAre you sure?')) removeBoard(id);
            return;
        }

        Alert.alert('Delete board', 'Are you sure you want to delete this board?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => removeBoard(id) },
        ]);
    }

    const renderBoard: ListRenderItem<Board> = ({ item }) => (
        <BoardCard
        board={item}
        onPress={() => {
            router.push(`/lists?boardId=${item.id}`);
        }}
        onDelete={(id)=>{
            handleDeleteWithConfirm(id);
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

        <Button
            title="Create Board"
            onPress={() => router.push("/createBoard")}
            style={{
                marginTop: SPACING.md,
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.md,
                minHeight: 48,
                marginBottom: SPACING.md,
                marginHorizontal: SPACING.md,
                alignSelf: 'stretch',
                borderRadius: 5,
            }}
        />
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