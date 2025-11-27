import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import TasksForList from "../../components/TasksForList";
import { SPACING } from "../../constants/theme";
import { getLists } from "../../services/taskService";
import styles from "../../views/tasks/styles";

export const screenOptions = { title: "Tasks" } as const;

export default function TasksScreen() {
    const [lists, setLists] = useState(() => getLists());

    useEffect(() => {
        setLists(getLists());
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tasks by List</Text>
            <FlatList
                data={lists}
                keyExtractor={(l) => String(l.id)}
                renderItem={({ item: list }) => (
                    <TasksForList key={list.id} listId={list.id} />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No lists found.</Text>
                }
                contentContainerStyle={{ padding: SPACING.md }}
            />
        </View>
    );
}
