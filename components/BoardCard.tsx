import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { Board } from "../types";


type BoardCardProps = {
    board: Board;
    onPress: () => void;
};

export default function BoardCard({ board, onPress }: BoardCardProps) {
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
            <Text style = {styles.arrow}>→</Text>
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
        fontSize: 20,
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
});