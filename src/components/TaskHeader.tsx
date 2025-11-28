import React from "react";
import { Text, View } from "react-native";
import styles from "../views/tasks/styles";
import OverflowMenu from "./overflowMenu/overflowMenu";

type SortMode = "none" | "due" | "name";

type Props = {
    title: string;
    showCompleted: boolean;
    onToggleShowCompleted: () => void;
    sortMode: SortMode;
    setSortMode: (m: SortMode) => void;
    buttonStyle?: any;
};

export default function TaskHeader({
    title,
    showCompleted,
    onToggleShowCompleted,
    sortMode,
    setSortMode,
    buttonStyle,
}: Props) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Text style={styles.title}>{title}</Text>
            <OverflowMenu
                items={[
                    {
                        label: showCompleted
                            ? "Hide completed"
                            : "Show completed",
                        onPress: onToggleShowCompleted,
                    },
                    { label: "Sort By:", isHeader: true },
                    {
                        label: `${sortMode === "none" ? "✓ " : ""}None`,
                        onPress: () => setSortMode("none"),
                    },
                    {
                        label: `${sortMode === "due" ? "✓ " : ""}Due date`,
                        onPress: () => setSortMode("due"),
                    },
                    {
                        label: `${sortMode === "name" ? "✓ " : ""}Alphabetical`,
                        onPress: () => setSortMode("name"),
                    },
                ]}
                buttonStyle={buttonStyle}
            />
        </View>
    );
}
