import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../src/components/button";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";

export default function HomeScreen() {
	const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Toodler!</Text>
            <Button 
                title="View Boards"
                onPress={() => router.push('/boards')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xlarge,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
});