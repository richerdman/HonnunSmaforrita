import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { Board } from "../types/types";


type BoardCardProps = {
    board: Board;
    onPress: () => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
};


export default function BoardCard({ board, onPress, onDelete, onEdit }: BoardCardProps) {
    return (
        <TouchableOpacity 
            style={[styles.card, {borderLeftColor: COLORS.primary}]}
            onPress={onPress}
        > 
            <Image 
                source={{ uri: board.thumbnailPhoto }}
                style={{ width: 60, height: 60, marginRight: SPACING.md }}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{board.name}</Text>
                <Text style={styles.description}>{board.description}</Text>
            </View>

            <TouchableOpacity 
                style={styles.editButton}
                onPress={(e) => {
                    e?.stopPropagation?.();
                    onEdit(board.id);
                  }}
            >
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                
                style={styles.deleteButton}
                onPress={() => onDelete(board.id)}
            >
                <Text style = {styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: FONT_SIZES.medium,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: FONT_SIZES.small,
        color: COLORS.border,
        marginLeft: SPACING.sm,
    },
    thumbnailContainer: {
        marginLeft: SPACING.md,
    },
    arrow: {
        fontSize: FONT_SIZES.large,
        color: COLORS.border,
        marginLeft: SPACING.md,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    deleteButton: {
        marginLeft: SPACING.md,
        padding: SPACING.xs,
        backgroundColor: "#ff4d4d",
        borderRadius: 4,
    },
    deleteText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.small,
        fontWeight: "600",
    },
    editButton: {
        marginLeft: SPACING.md,
        padding: SPACING.xs,
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    editText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.small,
        fontWeight: "600",
    },
});