import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { getLists } from "../../src/services/taskService";
import styles from "../../src/views/tasks/styles";

export const screenOptions = { title: "Tasks" } as const;

export default function TasksScreen() {
    const [lists, setLists] = useState(() => getLists());

    useEffect(() => {
        setLists(getLists());
    }, []);

    return (
        <View style={styles.container}>
            
        </View>
    );
}
