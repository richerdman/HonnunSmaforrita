import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../src/components/button";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";

export default function CreateBoardScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateBoard = () => {
        if (name.trim() === "") {
            Alert.alert("Validation Error", "Board name is required.");
            return;
        }

        console.log("Creating board:", { name, description });
        Alert.alert("Board created successfully!");
        router.push("/boards");
    }


return (
    <View style={styles.container}>
        <Text style={styles.label}>Board Name</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter board name"
            value={name}
            onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter board description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
        />

        <Button 
            title="Create Board"
            onPress={handleCreateBoard}
            style={styles.button}
        />

        <Button 
            title="Cancel"
            onPress={() => router.push("/boards")}
            style={styles.cancelButton}
        />
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.medium,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: FONT_SIZES.medium,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    button: {
        marginTop: SPACING.md,
    },
    cancelButton: {
        marginTop: SPACING.sm,
        backgroundColor: COLORS.border,
    },
});